# 콘텐츠 제작 워크플로우

마크다운에서 Supabase 데이터베이스까지 외국어 학습 콘텐츠 자동 변환 시스템

## 전체 플로우

```
MD 작성 → CLI 파싱 → JSON 생성 → DB 업로드 → 앱에서 사용
```

---

## 1️⃣ 마크다운 파일 작성

### 파일 위치
```
content/source/
├── coffee-shop-ordering.md
├── meeting-collaboration.md
└── [new-topic].md
```

### 템플릿 구조

```markdown
---
topic_id: "550e8400-e29b-41d4-a716-446655440000"  # 필수: UUID v4 형식 (시스템 명령어로 생성)
title: "주제명"
category: "일상생활"  # 일상생활, 업무/학습, 여행, 건강/의료, 쇼핑, 취미/여가, etc
difficulty: "초급"    # 초급, 중급, 고급
description: "간단한 설명"
language_code: "en"   # en (영어), ja (일본어)
highlight_sentence:
  sentence_order: 2
  korean_text: "핵심이 되는 한글 문장"  # 순수 텍스트만 (** 볼드 마킹 금지)
  foreign_text: "Core foreign sentence"  # 순수 텍스트만
  reason: "이 문장이 핵심인 이유"
---

# 1단계: 한글 스크립트

첫 번째 문장입니다.
**중요한 표현**{important expression}을 포함한 두 번째 문장입니다.
세 번째 문장입니다.
[5-10문장으로 구성하여 학습 부담 최소화]

# 2단계: 외국어 스크립트

This is the first sentence.
This is the second sentence with important expression.
This is the third sentence.

# 2단계: 끊어읽기 버전

This is | the first sentence.
This is | the second sentence | with important expression.
This is | the third sentence.

# 3단계: 사용자 자유 연습

1 ~ 2단계에서 구성한 콘텐츠 기반으로 한→영 스피킹 연습 진행

# 4단계: 키워드 스피치

## 레벨 1: 상세한 키워드 (70% 정보)

첫 번째, 문장 → This is the first sentence.
중요한 표현 → This is the second sentence with important expression.
[품질 우선: 의미 있는 키워드만 선별, 1-3개 항목]

## 레벨 2: 핵심 키워드 (50% 정보)

첫 번째 → This is the first sentence.
표현 → This is the second sentence with important expression.

## 레벨 3: 최소한의 키워드 (30% 정보)

문장 → This is the first sentence.
표현 → This is the second sentence with important expression.

## 레벨 4: 외국어 키워드

expression → This is the second sentence with important expression.
```

### 학습 포인트 표시법
```markdown
**한글 핵심 표현**{corresponding foreign phrase}
```

### UUID 생성 방법

**중요**: topic_id는 반드시 유효한 UUID v4 형식이어야 합니다.

```bash
# macOS/Linux에서 UUID 생성
uuidgen | tr '[:upper:]' '[:lower:]'

# 출력 예시: 8c6b970f-5eb8-4536-9755-8414d427d761
```

**UUID v4 형식 요구사항**:
- 3번째 그룹의 첫 문자: `1-5` 중 하나 (버전 표시)
- 4번째 그룹의 첫 문자: `8`, `9`, `a`, `b` 중 하나 (변형 표시)

**자동 콘텐츠 생성 시**:
- `/add-content` 명령어는 자동으로 시스템 명령어로 UUID 생성
- LLM이 직접 UUID 생성 시 형식 오류 발생 가능성 있음
- 수동 작성 시에도 `uuidgen` 사용 권장

---

## 2️⃣ CLI 파싱 및 업로드

### 명령어
```bash
cd packages/content-parser

# 특정 파일 파싱
pnpm parse coffee-shop-ordering.md

# 모든 파일 파싱
pnpm parse:all
```

### 환경 설정
```bash
# .env.local
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 3️⃣ 생성되는 데이터

### JSON 구조
```json
{
  "topic": {
    "title": "카페에서 음료 주문하기",
    "category": "일상생활",
    "difficulty": "초급",
    "total_sentences": 12
  },
  "korean_scripts": [...],
  "foreign_scripts": [...],
  "keyword_speeches": [...],
  "learning_points": [...],
  "highlight_sentences": [...]
}
```

### 데이터베이스 테이블
- `topics`: 주제 메타데이터
- `korean_scripts`: 1단계 한글 스크립트
- `foreign_scripts`: 2단계 외국어 스크립트 + 끊어읽기
- `keyword_speeches`: 4단계 키워드 스피치 (레벨 1-4)
- `learning_points`: 학습 포인트 (`**phrase**{translation}`)
- `highlight_sentences`: 핵심 문장 (토픽별 1개)

---

## 4️⃣ 검증 항목

### 자동 검증
- ✅ topic_id UUID 형식 및 필수성
- ✅ frontmatter 필수 필드 (title, category, difficulty)
- ✅ highlight_sentence 구조
- ✅ 4단계 섹션 존재 여부
- ✅ 한글/외국어 스크립트 문장 수 일치 (5-10문장)
- ✅ 키워드 스피치 품질 우선 검증 (분량보다 학습 효과)
- ✅ 학습 포인트 `**phrase**{translation}` 형식

### 수동 검토
- [ ] 한글 스크립트 자연스러움
- [ ] 외국어 번역 정확성
- [ ] 끊어읽기 위치 적절성
- [ ] 키워드 선택의 적절성