# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

영어 스피킹 학습 플랫폼 `my-speak`는 한→영 번역과 키워드 스피치를 통한 5단계 학습 시스템을 제공합니다. Turborepo 기반 모노레포 구조로 웹 앱과 네이티브 앱, 그리고 공유 패키지들을 관리합니다.

## 개발 명령어

### 기본 개발 워크플로우
```bash
# 전체 프로젝트 개발 서버 실행
pnpm dev

# 웹 앱만 개발 서버 실행
pnpm dev --filter=web

# 전체 빌드
pnpm build

# 린트 및 타입 체크
pnpm format-and-lint
pnpm check-types

# 특정 앱만 빌드
turbo build --filter=web
```

### 코드 품질 관리
- **Linting**: Biome 사용 (탭 인덴트, 더블 쿼트)
- **타입 체크**: TypeScript strict 모드
- **자동 수정**: `pnpm format-and-lint:fix`

## 아키텍처 구조

### 모노레포 구성
```
apps/
├── web/           # Next.js 웹 애플리케이션 (Supabase 연동)
└── native/        # React Native 모바일 앱

packages/
├── content-parser/  # 학습 콘텐츠 파싱 및 변환 도구
└── typescript-config/ # 공유 TypeScript 설정
```

### 웹 애플리케이션 (apps/web/)
- **프레임워크**: Next.js 15 + React 19
- **스타일링**: Tailwind CSS v4
- **데이터베이스**: Supabase (SSR 패키지 사용)
- **환경 변수**: `.env.local`에 Supabase 연결 정보

### 콘텐츠 관리 시스템 (packages/content-parser/)
학습 콘텐츠는 다음 워크플로우로 관리됩니다:

1. **콘텐츠 작성**: `content/source/` - 마크다운 파일로 작성
2. **자동 변환**: MD → 구조화된 JSON 변환
3. **검증 및 배포**: `content/json/` - 앱에서 사용할 JSON
4. **DB 시드**: Supabase 테이블에 데이터 삽입

### 학습 시스템 구조
5단계 영어 학습 플로우:
1. **한글 스크립트** - 일상적 주제의 쉬운 문장들
2. **한→영 번역** - 모범 답안과 비교, 문법/어휘 학습
3. **읽기 연습** - 끊어읽기와 발음 가이드
4. **한→영 스피킹** - 접기/펼치기 형태의 단계별 연습
5. **키워드 스피치** - 4레벨 점진적 난이도 (70%→30%→영어키워드)

## Supabase 연동

### 연결 설정
- 클라이언트: `apps/web/app/utils/supabase/client.ts`
- 서버: `apps/web/app/utils/supabase/server.ts`
- 환경 변수: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 데이터베이스 스키마
핵심 테이블 구조:
- `topics` - 학습 주제 (난이도, 카테고리)
- `korean_scripts` - 1단계 한글 스크립트
- `english_scripts` - 2단계 영어 스크립트 + 문법 노트
- `keyword_speeches` - 4-5단계 키워드 연습
- `user_progress` - 사용자 학습 진도 추적

## 중요 파일 위치

### 설정 파일
- `turbo.json` - Turborepo 태스크 설정
- `biome.json` - 코드 포맷팅 및 린팅 규칙
- `pnpm-workspace.yaml` - 워크스페이스 정의

### 핵심 문서
- `packages/content-parser/docs/english-speak-content-system.md` - 학습 시스템 상세 가이드
- `apps/web/docs/development/supabase-setup.md` - Supabase 설정 가이드

### 개발 시 주의사항
- 콘텐츠 작성은 반드시 마크다운으로 하고 자동 변환 스크립트 사용
- Supabase 마이그레이션은 `supabase/migrations/` 폴더에서 관리
- 각 앱은 독립적으로 개발 가능하나 공유 패키지 변경 시 전체 빌드 필요