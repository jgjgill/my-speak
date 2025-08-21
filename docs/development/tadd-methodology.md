# TADD (Test AI Driven Development) 방법론

## 개요

TADD(Test AI Driven Development)는 기존 TDD(Test Driven Development)에 AI 협업을 결합한 개발 방법론입니다. AI와 개발자가 함께 테스트 우선 개발을 진행하여 안정적이고 유지보수가 용이한 코드를 작성하는 것을 목표로 합니다.

## 핵심 원칙

### 1. 테스트 우선 설계 (Test-First Design)
- 구현 코드보다 테스트 코드를 먼저 작성
- 인터페이스와 기대되는 동작을 명확히 정의
- AI와 함께 테스트 시나리오 설계

### 2. 순수 함수 우선 (Pure Function First)
- 부수 효과가 없는 순수 함수로 비즈니스 로직 분리
- 테스트 가능성과 예측 가능성 향상
- 함수형 프로그래밍 패턴 활용

### 3. AI-Human 협업 프로세스 (AI-Human Collaboration)
- AI의 코드 생성 능력과 인간의 도메인 지식 결합
- 지속적인 피드백과 개선 사이클
- AI가 제안한 코드에 대한 인간의 검증과 가이드

## TADD 개발 사이클

### 1단계: 요구사항 분석 및 인터페이스 설계
```
개발자 → AI: "기능 요구사항 설명"
AI → 개발자: "인터페이스 및 함수 시그니처 제안"
개발자 → AI: "피드백 및 수정 요청"
```

### 2단계: 테스트 케이스 작성
```
AI: 기본 테스트 케이스 생성
개발자: 엣지 케이스 및 도메인 특화 시나리오 추가
AI: 추가 테스트 케이스 구현
```

### 3단계: 구현 코드 작성
```
AI: 테스트를 통과하는 최소 구현 코드 작성
개발자: 코드 리뷰 및 개선 사항 제안
AI: 리팩토링 및 최적화
```

### 4단계: 통합 및 검증
```
AI: 컴포넌트 통합 코드 작성
개발자: 실제 사용 시나리오 테스트
AI: 버그 수정 및 최종 정리
```

## 실제 적용 사례: Korean Sentence Highlighter

### 배경
- 기존 `react-highlight-words` 라이브러리의 한계
- 여러 키워드의 독립적 토글 상태 관리 필요
- 한국어 텍스트 처리 특화 기능

### TADD 적용 과정

#### 1단계: 요구사항 분석 및 인터페이스 설계

**개발자 요청:**
```
"Highlighter 안쓰고 텍스트 강조 효과 구현할 수 있을까?"
"접근을 안정성있고 좋은 코드를 작성하는 방향으로 진행해보자."
```

**AI 제안:**
```typescript
interface KoreanSentenceHighlighterProps {
  sentenceOrder: number;
  koreanText: string;
  learningPoints: LearningPoint[];
  selectedPoints: Set<string>;
  onLearningPointClick: (sentenceOrder: number, text: string) => void;
}

interface TextSegment {
  text: string;
  isKeyword: boolean;
  learningPoint?: LearningPoint;
  isSelected: boolean;
}
```

#### 2단계: 테스트 케이스 작성

**개발자 요청:**
```
"koren-sentence-highlighter.spec.tsx 로 구현해보자"
"헬퍼 함수들도 테스트 코드를 작성해줘"
```

**AI 구현:**
- 기본 기능 테스트 (키워드 추출, 매칭, 선택 상태)
- 엣지 케이스 테스트 (빈 배열, 중복 키워드, 존재하지 않는 키워드)
- 통합 테스트 (전체 텍스트 파싱 시나리오)

#### 3단계: 구현 코드 작성

**개발자 피드백:**
```
"parseTextSegments 구현할 때 함수들의 조합으로 해결할 수 없을까?"
"순수함수로 관리하자"
"fxts 라이브러리 활용하자"
```

**AI 구현:**
```typescript
export const getLearningPointKeywords = (
  learningPoints: LearningPoint[],
): string[] => {
  return fx(learningPoints)
    .map((point) => point.korean_phrase)
    .filter((phrase) => phrase !== null && phrase !== undefined)
    .toArray();
};

export const parseTextSegments = (
  text: string,
  sentenceOrder: number,
  learningPoints: LearningPoint[],
  selectedPoints: Set<string>,
): TextSegment[] => {
  // 함수 조합을 통한 복잡한 파싱 로직 구현
};
```

#### 4단계: 통합 및 검증

**개발자 피드백:**
```
"usememo 안써도 돼"
"getLearningPointInfo 함수의 경우 undefined 이면 에러 던지면 어떨까?"
"createTextSegment는 단순히 객체로 만드는거여서 테스트 코드가 생략되어도 괜찮지 않을까?"
```

**최종 결과:**
- 17개 테스트 모두 통과
- 순수 함수 기반 모듈화된 코드
- 타입 안정성 확보
- 접근성 고려된 UI 컴포넌트

## TADD의 장점

### 1. 코드 품질 향상
- 테스트 우선 개발로 인한 높은 테스트 커버리지
- 순수 함수 기반 설계로 예측 가능한 동작
- AI의 일관된 코딩 패턴과 인간의 도메인 지식 결합

### 2. 개발 속도 향상
- AI의 빠른 코드 생성 능력
- 테스트 자동화를 통한 리그레션 방지
- 지속적인 리팩토링으로 기술 부채 최소화

### 3. 학습 효과
- AI와의 협업을 통한 새로운 패턴 학습
- 테스트 케이스 작성 능력 향상
- 함수형 프로그래밍 개념 습득

### 4. 유지보수성
- 명확한 인터페이스와 계약
- 변경에 대한 안정성 보장
- 리팩토링의 안전성

## TADD 적용 가이드라인

### Do's (권장사항)

1. **명확한 요구사항 전달**
   - 구체적인 사용 사례 제시
   - 제약 조건과 선호 사항 명시
   - 도메인 특화 지식 공유

2. **적극적인 피드백**
   - AI가 제안한 코드에 대한 즉시 피드백
   - 더 나은 방향 제시
   - 코드 리뷰 관점에서 접근

3. **테스트 케이스 강화**
   - 엣지 케이스 적극 추가
   - 실제 사용 시나리오 반영
   - 에러 케이스 처리

4. **함수형 접근**
   - 순수 함수 우선 설계
   - 불변성 유지
   - 합성 가능한 함수 작성

### Don'ts (주의사항)

1. **테스트 없는 구현**
   - 테스트 코드 우선 작성 원칙 유지
   - 커버리지 낮은 코드 방지

2. **과도한 의존성**
   - 불필요한 라이브러리 도입 지양
   - 기존 프로젝트 패턴 우선 활용

3. **복잡한 단일 함수**
   - 큰 함수를 작은 순수 함수로 분해
   - 단일 책임 원칙 준수

4. **AI 맹신**
   - AI 제안에 대한 비판적 검토
   - 도메인 지식 기반 검증

## 도구 및 기술 스택

### 테스팅 도구
- **vitest**: 빠른 테스트 실행 및 모킹 지원
- **@testing-library**: 사용자 관점의 컴포넌트 테스트

### 개발 도구
- **TypeScript**: 정적 타입 검사로 런타임 에러 방지
- **Biome**: 일관된 코드 스타일 유지
- **fxts**: 함수형 프로그래밍 유틸리티

### AI 협업 도구
- **Claude Code**: 코드 생성 및 리팩토링
- **GitHub Copilot**: 실시간 코드 제안
- **ChatGPT**: 설계 논의 및 문제 해결

## 결론

TADD는 AI의 코드 생성 능력과 인간의 창의성 및 도메인 지식을 결합하여 고품질의 소프트웨어를 빠르게 개발할 수 있는 방법론입니다. 특히 복잡한 비즈니스 로직을 가진 기능을 개발할 때 그 진가를 발휘합니다.

Korean Sentence Highlighter 개발 사례에서 보듯이, TADD를 통해 17개의 테스트를 모두 통과하는 안정적인 코드를 단시간에 구현할 수 있었습니다. 이는 전통적인 개발 방식 대비 개발 속도와 코드 품질 모두에서 우수한 결과를 보여줍니다.

앞으로 더 많은 프로젝트에서 TADD 방법론을 적용하여 그 효과를 검증하고 개선해 나가야 할 것입니다.