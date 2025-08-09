# TanStack Query 아키텍처 가이드

웹 애플리케이션의 데이터 페칭과 상태 관리를 위한 TanStack Query 사용 패턴과 구조를 설명합니다.

## 개요

my-speak 웹 애플리케이션은 **서버-클라이언트 하이브리드 아키텍처**를 채택하여:
- **서버 컴포넌트**: 초기 데이터 로딩, SEO 최적화, 정적 레이아웃
- **클라이언트 컴포넌트**: 사용자 인터랙션, 동적 상태 관리, 실시간 업데이트

모든 클라이언트 사이드 데이터 페칭은 **TanStack Query**로 통일하여 캐싱, 에러 처리, 로딩 상태를 일관되게 관리합니다.

## 폴더 구조

```
app/[language]/topics/[id]/
├── components/          # React 컴포넌트들
├── hooks/              # TanStack Query 훅들
├── queries/            # 데이터 쿼리 함수들
├── mutations/          # 데이터 변경 함수들
└── utils/              # 유틸리티 함수들
```

### hooks/ - TanStack Query 훅들

```typescript
hooks/
├── use-user.ts              # 전역 사용자 인증 상태
├── use-topic.ts             # 주제 정보
├── use-user-progress.ts     # 사용자 학습 진행도
├── use-stage-one-data.ts    # 1단계 데이터 (한글 스크립트, 학습 포인트)
├── use-stage-two-data.ts    # 2단계 데이터 (영어 스크립트, 사용자 번역)
├── use-stage-three-data.ts  # 3단계 데이터 (읽기 연습)
└── use-stage-four-data.ts   # 4단계 데이터 (키워드 스피치)
```

### queries/ - 데이터 쿼리 함수들

```typescript
queries/
├── user-auth-queries.ts        # 사용자 인증 관련
├── topic-info-queries.ts       # 주제 메타데이터
├── user-progress-queries.ts    # 학습 진행도
├── stage-one-queries.ts        # 1단계 개별 쿼리들
├── stage-two-queries.ts        # 2단계 복합 쿼리
├── stage-three-queries.ts      # 3단계 복합 쿼리
└── stage-four-queries.ts       # 4단계 키워드 스피치
```

## 주요 패턴

### 1. useSuspenseQuery 통일

모든 데이터 페칭에 `useSuspenseQuery`를 사용하여:
- 컴포넌트 코드 단순화 (loading 상태 제거)
- Suspense 경계에서 로딩 UI 처리
- 에러 경계에서 에러 UI 처리

```typescript
// ✅ Good
export function useUser() {
  return useSuspenseQuery({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: 15 * 60 * 1000,
    gcTime: Infinity,
    initialData: null, // Hydration 이슈 방지
  });
}

// ❌ Avoid
export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    enabled: someCondition, // useSuspenseQuery에는 enabled 없음
  });
}
```

**Hydration 이슈 해결:**
- `initialData: null`로 서버-클라이언트 초기 상태 통일
- 비로그인 사용자에 대한 안전한 기본값 제공

### 2. 쿼리 키 전략

사용자별 데이터 분리와 효율적인 캐시 무효화를 위한 쿼리 키 패턴:

```typescript
// 전역 데이터
["user"]                           // 사용자 정보
["topic", topicId]                 // 주제 정보

// 사용자별 데이터  
["user-progress", topicId, userId]          // 학습 진행도
["stage-one-data", topicId, userId]         // 1단계 사용자 데이터
["stage-two-data", topicId, userId]         // 2단계 사용자 데이터

// 게스트 사용자 처리
["stage-one-data", topicId, "guest"]        // 비로그인 사용자
```

### 3. 캐싱 전략

데이터 특성에 따른 차별화된 캐싱 정책:

```typescript
// 사용자 인증 정보 - 세션 동안 유지
staleTime: 15 * 60 * 1000,  // 15분
gcTime: Infinity,           // 메모리에 영구 보관

// 주제 정보 - 거의 변하지 않음
// 전역 기본값 사용 (5분 staleTime, 10분 gcTime)

// 학습 데이터 - 사용자 액션에 따라 변경
// 전역 기본값 사용, mutation 시 selective invalidation
```

### 4. 서버-클라이언트 호환 쿼리 함수

서버와 클라이언트에서 모두 사용 가능한 쿼리 함수 패턴:

```typescript
// 서버/클라이언트 환경 모두 지원
export async function getKoreanScripts(
  topicId: string,
  supabase?: SupabaseClient, // 옵셔널 서버 인스턴스
): Promise<KoreanScript[]> {
  const client = supabase || createClient(); // 기본값은 클라이언트
  
  const { data, error } = await client
    .from("korean_scripts")
    .select("*")
    .eq("topic_id", topicId)
    .order("sentence_order");

  if (error) throw error;
  return data || [];
}
```

### 5. 안전한 에러 처리

비로그인 사용자에 대한 안전한 에러 처리:

```typescript
// 사용자 인증 정보 조회
export async function getUser(): Promise<User | null> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  // 비로그인 사용자는 에러가 아닌 null을 반환
  if (error) {
    console.log("User not authenticated:", error.message);
    return null;
  }
  return data.user;
}
```

### 6. 복합 데이터 쿼리

여러 테이블의 데이터를 한 번에 가져오는 패턴:

```typescript
// useSuspenseQueries로 병렬 데이터 페칭
export function useStageOneData(topicId: string, user: User | null) {
  return useSuspenseQueries({
    queries: [
      {
        queryKey: ["korean-scripts", topicId],
        queryFn: () => getKoreanScripts(topicId),
      },
      {
        queryKey: ["learning-points", topicId],
        queryFn: () => getLearningPoints(topicId),
      },
      {
        queryKey: ["user-translations", topicId, user ? user.id : "guest"],
        queryFn: user 
          ? () => getUserTranslations(topicId, user)
          : () => Promise.resolve([]),
      },
    ],
  });
}
```

## 전역 설정

`app/providers/query-provider.tsx`에서 전역 기본값 설정:

```typescript
defaultOptions: {
  queries: {
    staleTime: 1000 * 60 * 5,      // 5분
    gcTime: 1000 * 60 * 10,        // 10분  
    refetchOnWindowFocus: false,    // 윈도우 포커스 시 refetch 비활성화
    refetchOnReconnect: true,       // 네트워크 재연결 시 refetch
    refetchOnMount: false,          // 마운트 시 refetch 비활성화
  },
  mutations: {
    retry: 1,                       // 실패 시 1회 재시도
  },
}
```

## 컴포넌트 패턴

### 서버 컴포넌트 (페이지 레벨) - SSR Prefetching

```typescript
// page.tsx - SSR prefetching과 초기 설정
export default async function TopicDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  
  // 사용자 정보 확인 (에러 처리 포함)
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  const currentUser = authError ? null : user;
  
  // 사용자별 초기 단계 설정
  let initialStage = 1;
  if (currentUser) {
    const { data: progressData } = await supabase
      .from("user_progress")
      .select("current_stage")
      .eq("user_id", currentUser.id)
      .eq("topic_id", id)
      .single();
    
    initialStage = progressData?.current_stage || 1;
  }
  
  // 공개 데이터만 SSR에서 prefetch (SEO 최적화)
  const queryClient = new QueryClient();
  
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["korean-scripts", id],
      queryFn: () => getKoreanScripts(id, supabase),
    }),
    queryClient.prefetchQuery({
      queryKey: ["learning-points", id],
      queryFn: () => getLearningPoints(id, supabase),
    }),
    queryClient.prefetchQuery({
      queryKey: ["topic", id],
      queryFn: () => getTopic(id, supabase),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="p-4">
        <Suspense fallback={<TopicHeaderSkeleton />}>
          <TopicHeader topicId={id} />
        </Suspense>
        
        <Suspense fallback={<StageLoadingSkeleton />}>
          <TopicClientWrapper topicId={id} initialStage={initialStage} />
        </Suspense>
      </div>
    </HydrationBoundary>
  );
}
```

### 클라이언트 래퍼 컴포넌트

```typescript
// topic-client-wrapper.tsx - 상태 관리와 조건부 렌더링
"use client";

export default function TopicClientWrapper({ topicId, initialStage }) {
  const { data: user } = useUser();
  const [currentStage, setCurrentStage] = useState(initialStage);

  return (
    <>
      <StageNavigation 
        currentStage={currentStage}
        onStageChange={setCurrentStage}
      />
      
      {currentStage === 1 && <StageOneContainer topicId={topicId} user={user} />}
      {currentStage === 2 && <StageTwoContainer topicId={topicId} user={user} />}
      {currentStage === 3 && <StageThreeContainer topicId={topicId} user={user} />}
      {currentStage === 4 && <StageFourContainer topicId={topicId} />}
    </>
  );
}
```

### 데이터 컨테이너 컴포넌트

```typescript
// stage-two-container.tsx - 데이터 페칭과 UI 렌더링
"use client";

export default function StageTwoContainer({ topicId, user }) {
  const { data: {
    koreanScripts,
    englishScripts, 
    learningPoints,
    userTranslations,
    userSelectedPoints,
  } } = useStageTwoData(topicId, user);

  // UI 렌더링 로직
  return <div>{/* 컴포넌트 내용 */}</div>;
}
```

## 장점

1. **일관된 데이터 관리**: 모든 API 호출이 TanStack Query로 통일
2. **성능 최적화**: 자동 캐싱, 백그라운드 업데이트, 중복 요청 방지
3. **사용자 경험**: 즉시 응답하는 UI, 스켈레톤 로딩
4. **개발자 경험**: 단순한 컴포넌트 코드, 재사용 가능한 훅
5. **유지보수성**: 명확한 관심사 분리, 테스트 가능한 구조

## SSR vs CSR 데이터 분리 전략

### SSR에서 Prefetch할 데이터
- **공개 데이터**: SEO에 필요한 콘텐츠
  - `korean-scripts`: 한글 스크립트 (검색엔진 크롤링)
  - `learning-points`: 학습 포인트 (콘텐츠 구조)
  - `topic`: 주제 메타데이터 (페이지 제목, 설명)

### 클라이언트에서만 처리할 데이터
- **사용자별 데이터**: 보안 및 개인화 데이터
  - `user`: 사용자 인증 정보
  - `user-progress`: 개인 학습 진행도
  - `user-translations`: 개인 번역 기록

### 장점
1. **SEO 최적화**: 검색엔진이 핵심 콘텐츠를 즉시 확인 가능
2. **보안**: 사용자 데이터는 클라이언트에서만 처리
3. **성능**: 공개 데이터는 서버에서 미리 로드, 개인 데이터는 필요시 로드
4. **캐싱**: CDN에서 공개 데이터 캐싱 가능, 사용자별 데이터는 격리

## 문제 해결 가이드

### Hydration 깜빡임 방지
```typescript
// ✅ initialData로 서버-클라이언트 초기 상태 통일
const { data: user } = useSuspenseQuery({
  queryKey: ["user"],
  queryFn: getUser,
  initialData: null,
});
```

### 에러 처리
```typescript
// ✅ 비로그인 사용자를 위한 안전한 에러 처리
export async function getUser(): Promise<User | null> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.log("User not authenticated:", error.message);
    return null; // 에러 대신 null 반환
  }
  return data.user;
}
```

## 참고사항

- Suspense 경계는 페이지 레벨에서 설정
- 에러는 Error Boundary에서 처리  
- 사용자별 데이터는 쿼리 키로 격리
- mutation 후에는 관련 쿼리 무효화로 데이터 동기화
- SSR prefetch는 공개 데이터만, 사용자 데이터는 클라이언트에서 처리