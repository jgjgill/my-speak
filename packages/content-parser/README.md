# Content Parser

마크다운 학습 콘텐츠를 파싱하여 Supabase 데이터베이스로 자동 업로드하는 도구입니다.

## 주요 기능

- 마크다운 frontmatter 파싱 (topic_id, highlight_sentence 등)
- 4단계 학습 시스템 구조 변환
- Supabase DB 자동 업로드
- Zod 스키마 검증

## 기술 스택

- **remark** - 마크다운 파서
- **gray-matter** - frontmatter 파싱
- **Supabase JS** - 데이터베이스 클라이언트
- **Zod** - 스키마 검증

## 환경 변수 설정

`.env` 파일을 생성하고 다음 변수를 설정하세요:

```bash
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 사용법

### 단일 파일 파싱

```bash
# 루트에서 실행 (권장)
pnpm --filter=content-parser parse -- path/to/content.md

# 또는 packages/content-parser 디렉토리에서
pnpm parse path/to/content.md
```

### 전체 파일 파싱

```bash
pnpm --filter=content-parser parse:all
```

## 명령어

```bash
# 단일 파일 파싱 및 업로드
pnpm parse <file-path>

# 전체 파일 파싱 및 업로드
pnpm parse:all

# 테스트 실행
pnpm test

# 커버리지 포함 테스트
pnpm test:coverage
```

## 콘텐츠 작성 가이드

콘텐츠 마크다운 작성 규칙은 다음 문서를 참조하세요:

- [콘텐츠 제작 워크플로우](../../docs/content/content-creation-flow.md)
- [외국어 학습 콘텐츠 시스템](../../docs/content/foreign-language-content-system.md)
