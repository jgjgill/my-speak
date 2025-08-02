# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

영어 스피킹 학습 플랫폼 `my-speak`는 한→영 번역과 키워드 스피치를 통한 5단계 학습 시스템을 제공합니다. Turborepo 기반 모노레포 구조로 웹 앱과 네이티브 앱, 그리고 공유 패키지들을 관리합니다.

## 개발 환경

### 패키지 매니저
- **pnpm** 사용
- 워크스페이스 기반 모노레포 관리

### 의존성 설치
```bash
# 전체 프로젝트 의존성 설치
pnpm install

# 특정 워크스페이스에 의존성 추가
pnpm add [package] --filter=web
pnpm add [package] --filter=content-parser

# 개발 의존성 추가
pnpm add -D [package] --filter=web
```

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

[콘텐츠 제작 워크플로우](packages/content-parser/docs/content-creation-flow.md)

### 영어 스피킹 콘텐츠

- [영어 스피킹 학습 시스템](docs/product/english-speak-content-system.md)

## Supabase 연동

### 연결 설정

- 환경 변수: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 데이터베이스 스키마

- [Supabase 아키텍처 설계](docs/development/supabase-architecture.md)

## 중요 파일 위치

### 설정 파일
- `turbo.json` - Turborepo 태스크 설정
- `biome.json` - 코드 포맷팅 및 린팅 규칙
- `pnpm-workspace.yaml` - 워크스페이스 정의

