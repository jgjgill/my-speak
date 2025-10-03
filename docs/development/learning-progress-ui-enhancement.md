# 학습 진행률 UI 개선 가이드

## 개요

사용자가 학습 중 진행 상황을 실시간으로 인지하고 동기부여를 받을 수 있도록 게이미피케이션 요소를 강화한 UI/UX 개선.

### 개선 목표

- **실시간 진행률 가시성**: 스크롤 위치와 무관하게 학습 진행률 확인 가능
- **즉각적 피드백**: 문장 완료 시 시각적 피드백 제공
- **게이미피케이션**: 마일스톤 달성 시 성취감 부여

## 문제점 분석

### 현재 상태
- 진행률 표시가 화면 상단에 고정되어 있음
- 사용자가 문장 번역 후 진행률 확인을 위해 스크롤 필요
- 완료한 문장과 미완료 문장의 시각적 구분 부족
- 학습 동기부여 요소 부족

### 영향
- 학습 몰입도 저하
- 진행 상황 파악의 어려움
- 성취감 경험 기회 감소

## 해결 방안

### 1. Sticky Progress Bar ✅

#### 설계
- **위치**: 화면 최상단 고정
- **동작**: 스크롤과 무관하게 항상 노출
- **스타일**: 얇은 linear progress bar (h-2, 8px)
- **애니메이션**: CSS `@keyframes progress-grow` (0% → target width)

#### 구현 완료

##### 컴포넌트 구조
- **StickyProgressBar**: `apps/web/app/[language]/topics/[id]/components/sticky-progress-bar.tsx`
  - 별도 컴포넌트로 분리
  - CSR 전용 처리 (`dynamic import` + `ssr: false`)
  - 하이드레이션 이슈 해결

- **PracticeHeader**: `apps/web/app/[language]/topics/[id]/components/practice-header.tsx`
  - `StickyProgressBar`를 dynamic import로 로드
  - loading fallback UI 제공 (skeleton)

##### 환경별 top 위치
```tsx
// 웹 환경: ConditionalHeader(h-16, 64px) 아래
// 네이티브 WebView: WebView viewport 최상단
const topPosition = isWebView && hideHeader ? "top-0" : "top-16";
```

##### CSS 애니메이션
- **파일**: `apps/web/app/styles/animations.css`
- **keyframes**: `progress-grow` (0% → `var(--target-width)`)
- **클래스**: `animate-progress-grow` (0.5s ease-out forwards)
- **효과**: 마운트 시 0%에서 실제 진행률까지 부드럽게 증가

##### 레이아웃 고려사항
- `page.tsx`에 `min-h-screen` 추가 (데스크탑 환경 sticky 작동 보장)
- `-mx-4 px-4`로 화면 전체 너비 활용
- `z-40` (ConditionalHeader z-50보다 낮게)
- `stage-one-container.tsx`의 `topic-card` hover 효과 제거 (sticky 요소 가림 방지)

### 2. 완료 카드 시각적 피드백 ✅

#### 설계
- **완료 상태 표시**: border 색상 변경 + 펄스 애니메이션 + 스케일 효과
- **애니메이션**:
  - border 색상 전환 (500ms transition)
  - 펄스 애니메이션 (무한 반복)
  - 약간의 스케일 확대 (1.01배)
- **상태 구분**:
  - 미완료: `border border-gray-200`
  - 완료: `border-2 border-stage-1 animate-pulse-border scale-[1.01]`

#### 구현 완료

##### 구현 위치
- **파일**: `apps/web/app/[language]/topics/[id]/components/stage-one-practice.tsx`

##### 핵심 로직
```tsx
// 완료 상태 판단
const isCompleted = isMounted &&
  userTranslations.find(t => t.sentence_order === sentenceOrder && t.is_completed);

// 동적 스타일링
className={`... ${
  isCompleted
    ? "border-2 border-stage-1 animate-pulse-border scale-[1.01]"
    : "border border-gray-200"
}`}
```

##### 디자인 결정
- **색상**: `border-stage-1` (1단계 테마 색상) 사용
- **펄스 효과**: `animate-pulse-border` 커스텀 애니메이션
- **스케일**: `scale-[1.01]` 미세한 크기 변화로 강조
- **전환 시간**: `duration-500` (0.5초) 부드러운 전환

### 3. 마일스톤 게이미피케이션 (설계 중)

#### 현재 상태
- ~~토스트 알림 방식~~ → UX 문제로 제거
  - 문제점: "번역이 저장되었습니다!" 토스트와 중첩되어 정보 과부하
  - 문제점: 중복 마일스톤 표시 이슈

#### 대안 방식 검토 중
- **Progress Bar 마일스톤 마커**: 25%, 50%, 75%, 100% 위치에 이모지 마커 표시
- **Confetti 효과**: 100% 달성 시만 화면 전체 애니메이션
- **Progress Bar 애니메이션**: 마일스톤 달성 시 색상 변화 + 펄스 효과

## 구현 체크리스트

- [x] Sticky Progress Bar 컴포넌트 통합
- [x] 웹/네이티브 환경별 top 위치 동적 설정
- [x] CSS 애니메이션 적용 (초기 마운트 시 0% → target%)
- [x] 하이드레이션 이슈 해결 (CSR 전용 처리)
- [x] 데스크탑 환경 sticky 작동 보장 (min-h-screen)
- [x] hover 효과 제거로 sticky 요소 가림 방지
- [x] 완료 카드 스타일링 및 애니메이션
- [ ] 마일스톤 게이미피케이션 (새로운 UI 방식 검토 중)
- [ ] 웹 환경 테스트
- [ ] 네이티브 WebView 환경 테스트
- [ ] 진행률 0% → 100% 전체 플로우 검증

## 기술적 의존성

### Context API
- `WebViewContext`: 환경 감지 (웹/네이티브)
- `ToastContext`: 마일스톤 알림 표시

### 데이터 소스
- `useUserTranslations`: 문장별 완료 상태
- `progressPercentage`: 전체 진행률 계산

### 스타일링
- Tailwind CSS 동적 클래스
- CSS transition 애니메이션

## 예상 효과

### 사용자 경험
- 학습 진행 상황 실시간 파악
- 문장 완료 시 즉각적 성취감
- 마일스톤 달성을 통한 동기부여

### 게이미피케이션
- 진행률 바 채우기 (Progress visualization)
- 성취 배지 효과 (Milestone badges)
- 긍정 강화 (Positive reinforcement)

## 향후 확장 가능성

- 일일 학습 목표 연동
- 연속 학습일 스트릭(Streak) 표시
- 학습 통계 대시보드 통합
- 소셜 공유 기능 (진행률 공유)

## 참고 자료

- [TanStack Query 아키텍처](apps/web/docs/development/tanstack-query-architecture.md)
- [WebView 연동 아키텍처](docs/development/webview-integration-architecture.md)
- [Toast Context 구현](apps/web/app/contexts/toast-context.tsx)
