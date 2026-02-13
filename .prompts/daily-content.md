# 외국어 학습 콘텐츠 생성

**주제**: {{TITLE}}
**카테고리**: {{CATEGORY}}
**언어**: {{LANGUAGE}}
**난이도**: {{DIFFICULTY}}
**UUID**: {{UUID}}
**Slug**: {{SLUG}}

## 📋 출력 형식 지침

**절대적 요구사항**:
1. 첫 줄은 `---` (frontmatter 시작, 코드 블록 사용 금지)
2. 두 번째 줄부터 `topic_id:` 등 필드 작성 (YAML 배열 형식 `-` 사용 금지)
3. title, category, difficulty는 위에 제공된 한글 값을 **그대로** 사용
4. highlight_sentence의 korean_text, foreign_text는 **순수 텍스트만** 사용 (1단계의 `**볼드**{번역}` 학습 포인트 마킹을 절대 포함하지 않음)

---
topic_id: "{{UUID}}"
title: "{{TITLE}}"
slug: "{{SLUG}}"
category: "{{CATEGORY}}"
difficulty: "{{DIFFICULTY}}"
description: "[주제에 맞는 간단한 한글 설명 1-2문장]"
language_code: "{{LANGUAGE}}"
highlight_sentence:
  sentence_order: 3 # 예시값 - 1단계에서 가장 핵심적인 문장의 순서 번호(정수)
  korean_text: "[가장 핵심적인 한글 문장 1개 - 순수 텍스트만, **볼드** 마킹 절대 금지]"
  foreign_text: "[핵심 문장의 외국어 번역 - 순수 텍스트만]"
  reason: "[이 문장이 핵심인 이유를 한글로 설명]"
---

# 1단계: 한글 스크립트

5-8문장의 자연스러운 한글 대화. 학습 포인트는 **한글표현**{외국어 번역} 형식. 화자 구분(A:, B:) 사용 금지.

예시:
```
안녕하세요, 무엇을 드릴까요?
저는 **아이스 아메리카노 한 잔**{one iced americano}을 원합니다.
**미디엄 사이즈**{medium size}로 주세요.
```

# 2단계: 외국어 스크립트

1단계를 자연스럽게 외국어로 번역.

예시:
```
Hello, what can I get for you?
I would like one iced americano.
Medium size, please.
```

# 2단계: 끊어읽기 버전

| 기호로 의미 단위 구분.

예시:
```
Hello, | what can I get for you?
I would like | one iced americano.
Medium size, | please.
```

# 3단계: 사용자 자유 연습

다음 고정 텍스트를 그대로 사용:

```
1 ~ 2단계에서 구성한 콘텐츠 기반으로 한→영 스피킹 연습 진행
```

# 4단계: 키워드 스피치

각 레벨별로 한글 키워드 → 외국어 전체 문장 형식으로 작성. 2단계 외국어 스크립트의 모든 문장을 포함해야 함.

## 레벨 1: 상세한 키워드 (70% 정보)

핵심 단어들을 많이 포함하여 70% 정도의 정보를 제공.

예시:
```
무엇을, 드릴까요 → Hello, what can I get for you?
아이스 아메리카노, 한 잔, 원합니다 → I would like one iced americano.
미디엄 사이즈, 주세요 → Medium size, please.
```

## 레벨 2: 핵심 키워드 (50% 정보)

핵심 단어만 남겨서 50% 정도의 정보를 제공.

예시:
```
무엇을 → Hello, what can I get for you?
아메리카노, 원합니다 → I would like one iced americano.
미디엄, 주세요 → Medium size, please.
```

## 레벨 3: 최소한의 키워드 (30% 정보)

최소한의 키워드만 제공하여 30% 정도의 정보만 제공.

예시:
```
무엇을 → What can I get for you?
아메리카노 → I would like one iced americano.
미디엄 → Medium size, please.
```

## 레벨 4: 외국어 키워드

외국어 핵심 단어만 제공.

예시:
```
get → What can I get for you?
americano → I would like one iced americano.
medium → Medium size, please.
```
