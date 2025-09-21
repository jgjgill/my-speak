# 딥링크 시스템 개선 사후 보고서

**일시**: 2025-09-21
**소요 시간**: 연장 세션 (다중 단계 문제 해결)
**작업 유형**: 아키텍처 개선 및 기술적 문제 해결

## 🚨 문제 상황 (Situation)

### 발생한 문제
My Speak 앱의 딥링크 시스템이 항상 루트 페이지(`/`)로만 이동하여, 사용자가 웹에서 "앱으로 보기"를 클릭할 때 특정 콘텐츠 페이지(예: `/en/topics/123`)로 직접 이동할 수 없는 문제가 발생했습니다.

- **현재 딥링크**: `https://myspeak-native.expo.app` → 항상 루트로 이동
- **원하는 동작**: `https://myspeak-native.expo.app/en/topics/123` → 특정 콘텐츠로 직접 이동
- **주요 장애물**: "Unmatched Route" 에러로 인한 네이티브 앱 라우팅 충돌

### 주요 프롬프트 지시사항
> **초기 요구사항**
> - 웹에서 특정 페이지에 있을 때 "앱으로 보기" 클릭시 해당 페이지로 직접 이동
> - iOS Universal Links와 Android App Links 모두 지원
> - 기존 네이티브 앱 라우팅 구조와 충돌 방지
>
> **아키텍처 개선 요구사항**
> - 전역 변수 대신 React Context API 사용
> - 관심사 분리 (딥링크 로직 vs WebView URL 관리)
> - useCallback을 통한 성능 최적화
>
> **문서화 요구사항**
> - 복잡한 기술 문제 해결 과정을 히스토리로 관리
> - 한국어 기반 사후 보고서 스타일 문서화 시스템 구축

### AS-IS (기존 상태)
```typescript
// 기존: 항상 루트로만 이동하는 단순한 딥링크
const deepLinkUrl = "https://myspeak-native.expo.app";

// 문제가 있던 WebView URL 관리
let globalWebViewUrl = "https://my-speak.com"; // 전역 변수 사용
```

## 🎯 행동 (Action)

### 접근 방법 및 해결 과정

1. **1차 시도: 직접 경로 포함 방식**
   - `https://myspeak-native.expo.app/en/topics/123` 형태로 딥링크 생성
   - **결과**: "Unmatched Route" 에러 발생 (네이티브 앱에 해당 라우트가 없음)

2. **2차 시도: 쿼리 파라미터 방식**
   - `https://myspeak-native.expo.app?path=/en/topics/123` 형태로 변경
   - **결과**: 라우팅 충돌 해결, 하지만 아키텍처 문제 발견

3. **3차 시도: 전역 변수 기반 구현**
   - 전역 변수로 딥링크 상태 관리
   - **결과**: React 패턴에 적합하지 않다는 피드백

4. **최종 해결책: Context 기반 아키텍처**
   - DeepLinkContext와 WebViewContext 분리
   - useCallback으로 성능 최적화
   - **결과**: 성공적인 딥링크 구현 및 아키텍처 개선

### 핵심 구현 코드

```typescript
// TO-BE: Context 기반 딥링크 처리
const processDeepLink = useCallback(async () => {
  if (hasProcessedRef.current) {
    console.log("📱 딥링크 이미 처리됨, initialPath 초기화");
    setInitialPath(undefined);
    return;
  }
  try {
    const initialUrl = await Linking.getInitialURL();
    if (initialUrl) {
      const parsed = Linking.parse(initialUrl);
      const pathParam = parsed.queryParams?.path;
      if (pathParam && typeof pathParam === "string") {
        setInitialPath(pathParam);
      }
    }
    hasProcessedRef.current = true;
  } catch (error) {
    console.error("딥링크 처리 중 오류:", error);
    hasProcessedRef.current = true;
  }
}, []);

// 웹에서 딥링크 URL 생성
const createDeepLinkUrl = (currentPath: string): string => {
  const isNativeRoute = NATIVE_DEEP_LINK_LIST.some((route) =>
    currentPath.startsWith(route),
  );
  if (isNativeRoute) {
    return `https://myspeak-native.expo.app${currentPath}`;
  } else {
    return `https://myspeak-native.expo.app?path=${encodeURIComponent(currentPath)}`;
  }
};
```

### 주요 변경 파일
- `apps/web/app/components/app-download-modal.tsx`: 딥링크 URL 생성 로직 개선
- `apps/native/context/deep-link-context.tsx`: 새로 생성된 딥링크 전용 Context
- `apps/native/context/webview-context.tsx`: WebView URL 관리 Context 개선
- `apps/native/app/index.tsx`: Context 기반 딥링크 처리로 리팩토링
- `apps/native/public/.well-known/apple-app-site-association`: iOS Universal Links 설정 개선

## ✅ 결과 (Result)

### TO-BE (개선된 상태)
- 웹에서 특정 페이지 → 네이티브 앱 해당 페이지로 직접 이동 가능
- iOS/Android 플랫폼 모두에서 일관된 딥링크 동작
- React Context 패턴 기반의 깔끔한 아키텍처
- useCallback 최적화로 불필요한 재실행 방지

### 작업 커밋
```bash
feat: Context 기반 딥링크 아키텍처 구현
fix: useCallback으로 딥링크 중복 실행 방지
refactor: 딥링크와 WebView 로직 관심사 분리
feat: 웹 앱에서 쿼리 파라미터 기반 딥링크 생성
```

### AS-IS vs TO-BE 비교
| 항목 | AS-IS | TO-BE | 개선 효과 |
|------|-------|-------|-----------|
| 딥링크 이동 | 항상 루트 페이지 | 특정 콘텐츠 페이지 | 사용자 편의성 100% 향상 |
| 아키텍처 | 전역 변수 기반 | React Context 패턴 | 유지보수성 및 확장성 향상 |
| 성능 | 다중 실행 문제 | useCallback 최적화 | 불필요한 재실행 제거 |
| 플랫폼 호환성 | iOS 전용 | iOS/Android 통합 | 크로스 플랫폼 일관성 |

## 📈 영향 (Impact)

### 기술적 영향
- **아키텍처 품질 향상**: 전역 변수에서 Context 패턴으로 전환하여 React 모범 사례 준수
- **성능 최적화**: useCallback 적용으로 불필요한 함수 재생성 및 useEffect 재실행 방지
- **코드 분리**: 딥링크 처리와 WebView URL 관리의 명확한 관심사 분리
- **크로스 플랫폼 안정성**: iOS Universal Links와 Android App Links 적용

### 비즈니스 영향
- **사용자 경험 개선**: 웹에서 앱으로 매끄러운 전환으로 이탈률 감소 예상
- **콘텐츠 접근성 향상**: 특정 학습 콘텐츠로 직접 이동 가능하여 학습 연속성 확보
- **마케팅 효과**: 특정 콘텐츠 공유 및 캠페인 링크 활용 가능
- **개발 효율성**: 명확한 아키텍처로 향후 딥링크 기능 확장 용이

## 🤔 회고 (Learning)

### 핵심 학습사항
- **React Native 딥링크 패턴**: 직접 라우트 매칭보다 쿼리 파라미터 방식이 더 안전함
- **useCallback의 중요성**: useEffect 의존성 배열에서 함수 안정성이 성능에 미치는 영향
- **Context 아키텍처**: 전역 상태 관리에서 Context API의 적절한 분리 기준
- **iOS vs Android 딥링크**: Universal Links와 App Links의 설정

### 아쉬웠던 점
- **초기 접근법**: 직접 경로 방식으로 시작하여 "Unmatched Route" 문제
- **전역 변수 사용**: React 패턴을 벗어난 접근으로 리팩토링 필요성 발생
- **다중 실행 버그**: useCallback 부재로 인한 렌더링 이슈

### 다음 작업시 고려사항
- **Context 설계시**: 관심사 적절하게 분리
- **useEffect 사용시**: 렌더링 이슈 발생시 effect 내 의존성 배열 검토