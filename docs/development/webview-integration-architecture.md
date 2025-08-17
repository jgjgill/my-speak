# WebView 연동 아키텍처

네이티브 앱과 웹 앱 간의 원활한 연동을 위한 WebView 아키텍처 설계 문서입니다.

## 아키텍처 개요

### 핵심 구성 요소

1. **React Native WebView** (`apps/native/components/simple-webview.tsx`)
2. **Next.js 미들웨어** (`apps/web/middleware.ts`)
3. **WebView Context** (`apps/web/app/contexts/webview-context.tsx`)
4. **Native Bridge** (`apps/web/app/components/native-bridge.tsx`)

## 인증 세션 동기화

### 1. 네이티브 앱에서 세션 전달

```typescript
// apps/native/components/simple-webview.tsx
const sendAuthToWebView = useCallback(async () => {
  if (webViewRef.current && user) {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    const authData = {
      type: "AUTH_DATA",
      user: { id: user.id, email: user.email, user_metadata: user.user_metadata },
      session: session ? {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at
      } : null
    };
    
    webViewRef.current.postMessage(JSON.stringify(authData));
  }
}, [user]);
```

### 2. 웹 앱에서 세션 수신 및 설정

```typescript
// apps/web/app/components/native-bridge.tsx
const handleNativeMessage = (event: MessageEvent) => {
  const message = JSON.parse(event.data);
  
  if (message.type === "AUTH_DATA" && message.session) {
    const supabase = createClient();
    
    supabase.auth.setSession({
      access_token: message.session.access_token,
      refresh_token: message.session.refresh_token
    }).then(({ error }) => {
      if (!error) {
        window.dispatchEvent(new CustomEvent("supabaseSessionUpdated"));
      }
    });
  }
};
```

## 헤더 깜빡임 방지 시스템

### 문제점
- 초기 렌더링 시 쿼리 파라미터를 클라이언트에서 읽어 헤더를 숨기면 깜빡임 발생
- 페이지 이동 시 쿼리 파라미터가 유실되어 헤더가 다시 나타남

### 해결 방법

#### 1. Next.js 미들웨어로 쿼리 파라미터 → 헤더 변환

```typescript
// apps/web/middleware.ts
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const searchParams = request.nextUrl.searchParams.toString();
  response.headers.set("searchParams", searchParams);
  return response;
}
```

#### 2. 서버 사이드에서 초기값 설정

```typescript
// apps/web/app/layout.tsx
export default async function Layout({ children }: RootLayoutProps) {
  const headerStore = await headers();
  const searchParams = Object.fromEntries(
    new URLSearchParams(headerStore.get("searchParams") || "")
  );
  
  const initialIsWebView = searchParams.native === "true";
  const initialHideHeader = searchParams.hideHeader === "true";
  
  return (
    <WebViewProvider
      initialIsWebView={initialIsWebView}
      initialHideHeader={initialHideHeader}
    >
      <ConditionalHeader />
      <main>{children}</main>
    </WebViewProvider>
  );
}
```

#### 3. WebView Context로 상태 관리

```typescript
// apps/web/app/contexts/webview-context.tsx
export function WebViewProvider({ 
  children, 
  initialIsWebView = false, 
  initialHideHeader = false 
}: WebViewProviderProps) {
  const [isWebView, setIsWebView] = useState(initialIsWebView);
  const [hideHeader, setHideHeader] = useState(initialHideHeader);

  useEffect(() => {
    // 서버에서 초기값이 설정된 경우 sessionStorage에 저장
    if (initialIsWebView || initialHideHeader) {
      sessionStorage.setItem("isWebView", initialIsWebView.toString());
      sessionStorage.setItem("hideHeader", initialHideHeader.toString());
      return;
    }

    // sessionStorage에서 복원
    const storedWebView = sessionStorage.getItem("isWebView") === "true";
    const storedHideHeader = sessionStorage.getItem("hideHeader") === "true";
    
    if (storedWebView || storedHideHeader) {
      setIsWebView(storedWebView);
      setHideHeader(storedHideHeader);
    }
  }, [initialIsWebView, initialHideHeader]);

  return (
    <WebViewContext.Provider value={{ isWebView, hideHeader }}>
      {children}
    </WebViewContext.Provider>
  );
}
```

## WebView URL 구성

### 네이티브 앱에서 WebView 로드

```typescript
// apps/native/components/simple-webview.tsx
const webViewUrl = `${WEB_APP_URL}?native=true&hideHeader=true`;
```

### 쿼리 파라미터 설명

- `native=true`: 네이티브 앱 내 WebView임을 식별
- `hideHeader=true`: 웹 앱 헤더 숨김 요청

## 상태 지속성

### SessionStorage 활용
- 초기 접속: 쿼리 파라미터 → sessionStorage 저장
- 페이지 이동: sessionStorage에서 상태 복원
- 새로고침: sessionStorage 유지로 상태 보존

### 장점
1. **깜빡임 없는 UX**: 서버 사이드 초기값으로 즉시 올바른 상태 렌더링
2. **상태 지속성**: 페이지 이동 시에도 WebView 모드 유지
3. **신뢰성**: 쿼리 파라미터 의존성 제거로 안정적인 동작

## Safe Area 처리

### Native App Layout

```typescript
// apps/native/app/_layout.tsx
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
```

### WebView 화면

```typescript
// apps/native/app/index.tsx
<SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
  <SimpleWebView />
</SafeAreaView>
```

## 개발 시 주의사항

### 1. 환경 변수 분리
```bash
# 네이티브 API 서버 (백엔드)
EXPO_PUBLIC_BASE_URL=https://api.example.com

# WebView용 웹 앱 (프론트엔드)
EXPO_PUBLIC_WEB_APP_URL=https://web.example.com
```

### 2. 메시지 타입 정의
```typescript
interface NativeAuthMessage {
  type: "AUTH_DATA";
  user: {
    id: string;
    email: string;
    user_metadata: any;
  };
  session: {
    access_token: string;
    refresh_token: string;
    expires_at?: number;
  } | null;
}
```

### 3. 에러 처리
- 네이티브 메시지 파싱 실패 시 무시
- 세션 설정 실패 시 로그 출력 후 계속 진행
- WebView 로딩 실패 시 재시도 로직

## 성능 최적화

### 1. 불필요한 리렌더링 방지
- Context 값이 실제로 변경될 때만 리렌더링
- sessionStorage 읽기 최소화

### 2. 메모리 관리
- 이벤트 리스너 적절한 cleanup
- WebView 컴포넌트 언마운트 시 정리

### 3. 네트워크 최적화
- 세션 토큰 전달 시점 최적화
- 불필요한 API 호출 방지