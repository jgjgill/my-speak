# 콘텐츠 제작 워크플로우

영어 학습 콘텐츠를 마크다운에서 Supabase 데이터베이스까지 자동 변환하는 완전한 워크플로우입니다.

## 📋 전체 플로우 개요

```
1. MD 작성 → 2. CLI 파싱 → 3. JSON 생성 → 4. DB 업로드 → 5. 앱에서 사용
```

---

## 1️⃣ 마크다운 파일 작성

### 파일 위치

```
content/source/
├── meeting-collaboration.md     # 회의 및 협업 (중급)
├── greeting-basics.md          # 인사 기본 (초급)
└── [new-topic].md             # 새로운 주제
```

### 기본 구조 템플릿

```markdown
---
title: "주제명"
category: "업무/학업"  # 일상생활, 업무/학업, 사회/문화, 개인성장
difficulty: "중급"     # 초급, 중급, 고급
description: "간단한 설명"
---

# 1단계: 한글 스크립트

첫 번째 문장입니다.
**중요한 표현**{important expression}을 포함한 두 번째 문장입니다.
세 번째 문장입니다.

# 2단계: 영어 스크립트

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

첫 번째, 문장 → This is the first sentence.
두 번째, 중요한 표현 → This is the second sentence with important expression.
세 번째, 문장 → This is the third sentence.
```

### 핵심 구문: **phrase**{translation}

학습 포인트 표시를 위한 특별 구문:

```markdown
**한글 핵심 표현**{corresponding english phrase}
```

**예시:**

```markdown
오늘 오후 3시에 **중요한 프로젝트 회의**{important project meeting}가 있습니다.
지난주에 우리가 논의했던 **마케팅 전략**{marketing strategy}에 대해 다시 검토해야 합니다.
```

---

## 2️⃣ CLI를 통한 자동 파싱

### 설치 및 설정

```bash
# content-parser 패키지로 이동
cd packages/content-parser

# 환경 변수 설정 (.env.local)
PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 사용 가능한 명령어

```bash
# 특정 파일 파싱
pnpm parse meeting-collaboration.md

# 모든 마크다운 파일 파싱
pnpm parse:all
```

### 파싱 과정

1. **프론트매터 파싱**: 메타데이터 추출
2. **섹션 분리**: 헤딩 기준으로 1단계, 2단계, 4단계 구분
3. **한글 스크립트 파싱**: 
   - 학습 포인트 추출 (`**phrase**{translation}`)
   - 마크업 제거하여 깔끔한 텍스트 생성
4. **영어 스크립트 파싱**: 일반 버전과 끊어읽기 버전 처리
5. **키워드 스피치 파싱**: `→` 구분자로 키워드와 목표 문장 분리

---

## 3️⃣ JSON 파일 자동 생성

### 출력 위치
```
content/json/
├── meeting-collaboration.json
├── greeting-basics.json
└── [new-topic].json
```

### 생성되는 JSON 구조

```json
{
  "topic": {
    "title": "회의 및 협업",
    "category": "업무/학업", 
    "difficulty": "중급",
    "description": "업무 환경에서 자주 사용되는 회의 진행과 팀 협업 표현들을 학습합니다.",
    "total_sentences": 7
  },
  "korean_scripts": [
    {
      "sentence_order": 1,
      "korean_text": "오늘 오후 3시에 중요한 프로젝트 회의가 있습니다."
    }
  ],
  "english_scripts": [
    {
      "sentence_order": 1,
      "english_text": "We have an important project meeting at 3 PM today.",
      "chunked_text": "We have | an important project meeting | at 3 PM today."
    }
  ],
  "keyword_speeches": [
    {
      "stage": 4,
      "level": 1,
      "sequence_order": 1,
      "keywords": ["오늘 오후", "중요한 회의", "프로젝트"],
      "target_sentence": "We have an important project meeting at 3 PM today.",
      "difficulty_percentage": 70
    }
  ],
  "learning_points": [
    {
      "sentence_order": 1,
      "korean_phrase": "중요한 프로젝트 회의",
      "english_phrase": "important project meeting"
    }
  ]
}
```

---

## 4️⃣ Supabase 데이터베이스 자동 업로드

### 업로드되는 테이블

1. **topics**: 주제 메타데이터
2. **korean_scripts**: 1단계 한글 스크립트
3. **english_scripts**: 2-3단계 영어 스크립트 + 끊어읽기
4. **keyword_speeches**: 4단계 키워드 스피치
5. **learning_points**: 콘텐츠 제작자가 선별한 학습 포인트

### 자동 생성되는 관계

- 모든 테이블이 `topic_id`로 연결
- `sentence_order`로 문장 순서 보장
- `learning_points`가 `sentence_order`로 한글/영어 스크립트와 매칭

---

## 5️⃣ 실제 사용 예시

### 새로운 콘텐츠 추가하기

```bash
# 1. 새로운 마크다운 파일 생성
touch content/source/restaurant-ordering.md

# 2. 내용 작성 (위 템플릿 참고)
# ... 편집 ...

# 3. 파싱 및 업로드
cd packages/content-parser
pnpm parse restaurant-ordering.md
```

### 기존 콘텐츠 수정하기

```bash
# 1. 마크다운 파일 수정
# ... 편집 ...

# 2. 재파싱 (기존 데이터는 새로운 topic_id로 별도 저장됨)
pnpm parse restaurant-ordering.md
```

### 전체 콘텐츠 일괄 처리

```bash
# 모든 마크다운 파일을 한 번에 처리
pnpm parse:all

# 결과 확인
# ✅ Successful: 3
# ❌ Failed: 0
```

---

## 📊 품질 관리

### 자동 검증 항목

- ✅ 프론트매터 필수 필드 확인
- ✅ 섹션 구조 검증 (1단계, 2단계, 4단계)
- ✅ 한글/영어 스크립트 문장 수 일치
- ✅ 키워드 스피치 형식 검증
- ✅ 학습 포인트 영어 표현 매칭 확인

### 수동 검토 체크리스트

- [ ] 한글 스크립트 자연스러움
- [ ] 영어 번역 정확성
- [ ] 끊어읽기 위치 적절성  
- [ ] 키워드 선택의 적절성
- [ ] 학습 포인트 선별 기준 준수

---

## 🚀 CI/CD 통합

### GitHub Actions

@TODO