# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

언어 스피킹 학습 플랫폼 `my-speak`는 한→영 번역과 키워드 스피치를 통한 4단계 학습 시스템을 제공합니다. Turborepo 기반 모노레포 구조로 웹 앱과 네이티브 앱, 그리고 공유 패키지들을 관리합니다.

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

#### 린트 명령어 사용법

**전체 프로젝트 (모노레포 루트에서)**:
```bash
# 전체 코드 베이스 검사
pnpm format-and-lint

# 전체 코드 베이스 자동 수정
pnpm format-and-lint:fix
```

**개별 앱 디렉토리에서**:
```bash
cd apps/web
pnpm lint        # 현재 앱만 검사
pnpm lint:fix    # 현재 앱만 자동 수정
```

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
- **데이터베이스**: Supabase
- **데이터 관리**: TanStack Query
- **환경 변수**: `.env.local`에 Supabase 연결 정보

#### 데이터 아키텍처

- [TanStack Query 아키텍처](apps/web/docs/development/tanstack-query-architecture.md)
- [WebView 연동 아키텍처](docs/development/webview-integration-architecture.md)

### 네이티브 애플리케이션 (apps/native/)

- **프레임워크**: React Native + Expo
- **인증**: Supabase OAuth (Google)
- **웹뷰 연동**: React Native WebView
- **Safe Area 처리**: react-native-safe-area-context

#### 네이티브-웹뷰 연동 아키텍처

- **인증 세션 동기화**: 네이티브 앱에서 웹뷰로 Supabase 세션 전달
- **상태 관리**: WebView Context + sessionStorage 패턴
- **깜빡임 방지**: Next.js 미들웨어 기반 서버 사이드 초기값 설정
- **메시지 브릿지**: postMessage API를 통한 양방향 통신

#### 환경 변수 설정

**네이티브 앱 (.env)**:
```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_BASE_URL=your_api_server_url
EXPO_PUBLIC_WEB_APP_URL=your_web_app_url  # 웹뷰에서 로드할 웹 앱 URL
```

### 콘텐츠 관리 시스템 (packages/content-parser/)

[콘텐츠 제작 워크플로우](packages/content-parser/docs/content-creation-flow.md)

### 영어 스피킹 콘텐츠

- [영어 스피킹 학습 시스템](docs/product/english-speak-content-system.md)

## Supabase 연동

### 연결 설정

- 환경 변수: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Google OAuth 인증 설정

- Supabase 대시보드에서 Google OAuth 설정
- Authentication > Providers > Google 활성화
- Google Cloud Console에서 OAuth 2.0 클라이언트 ID 생성
- 승인된 리디렉션 URI: `https://[PROJECT_ID].supabase.co/auth/v1/callback`

### 데이터베이스 관리

- [Supabase 아키텍처 설계](docs/development/supabase-architecture.md)

## 중요 파일 위치

### 설정 파일

- `turbo.json` - Turborepo 태스크 설정
- `biome.json` - 코드 포맷팅 및 린팅 규칙
- `pnpm-workspace.yaml` - 워크스페이스 정의

## Git 커밋 규율

### 커밋 원칙

- **단일 논리적 작업**: 각 커밋은 하나의 논리적 작업 단위를 나타내야 함
- **명확한 변경 유형**: 구조적 변경(리팩토링, 파일 이동)과 기능적 변경(동작 수정, 신규 기능)을 명시
- **작고 빈번한 커밋**: 대용량 커밋보다 작고 의미 있는 단위로 자주 커밋

### 커밋 메시지 형식

```
type: 간결한 요약 (50자 이내)

- 상세 설명이 필요한 경우 추가
- 변경 이유와 영향을 포함
```

### 커밋 타입

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `refactor`: 코드 리팩토링 (기능 변경 없음)
- `style`: 코드 포맷팅, 세미콜론 등 (로직 변경 없음)
- `docs`: 문서 수정
- `test`: 테스트 추가 또는 수정
- `chore`: 빌드 프로세스, 패키지 매니저 설정 등

### 예시

```bash
feat: 1단계 학습용 TanStack Query 도입

- 서버 컴포넌트에서 클라이언트 컴포넌트로 전환
- useSuspenseQueries로 데이터 페칭 최적화
- 로그인/비로그인 사용자별 캐시 키 분리
```

### 자동 커밋 정책

Claude는 논리적 작업 단위가 완료될 때마다 **자동으로 커밋을 생성**해야 합니다:

#### 자동 커밋 트리거 조건
- 새로운 기능 구현 완료 시
- 버그 수정 완료 시  
- 리팩토링 작업 완료 시
- 문서 업데이트 완료 시
- Todo 항목이 완료 상태로 변경될 때

#### 커밋 생성 프로세스
1. **변경사항 검토**: `git status`와 `git diff`로 변경사항 확인
2. **커밋 메시지 작성**: 위 커밋 규율에 따라 메시지 구성
3. **파일 스테이징**: 관련 파일들을 `git add`로 추가
4. **커밋 실행**: 적절한 커밋 메시지와 함께 커밋
5. **상태 확인**: `git status`로 커밋 성공 여부 확인

#### 필수 사항
- 각 논리적 작업 완료 후 **즉시 커밋** 수행
- 여러 작업을 한 번에 커밋하지 말고 **개별 커밋**으로 분리
- 커밋 전 **코드 품질 확인**: 린트 에러나 타입 에러 해결 후 커밋

#### 커밋 제안 정책
- **적극적 커밋 제안**: 논리적 작업 단위가 완료될 때마다 사용자에게 커밋 생성을 적극적으로 제안
- **즉시 제안**: Todo 완료, 기능 구현, 버그 수정 등이 끝나면 바로 커밋 제안
- **사용자 확인**: 커밋 메시지 제안과 함께 사용자 승인 대기

#### Git 파일 경로 처리 주의사항

**중요**: Next.js 동적 라우트로 인한 대괄호 `[language]`, `[id]` 등이 포함된 파일 경로는 bash에서 글로브 패턴으로 해석되므로 **반드시 따옴표로 감싸야** 합니다.

```bash
# ❌ 잘못된 방법 - "no matches found" 에러 발생
git add apps/web/app/[language]/topics/[id]/components/stage-one-practice.tsx

# ✅ 올바른 방법 - 따옴표로 전체 경로 감싸기
git add "apps/web/app/[language]/topics/[id]/components/stage-one-practice.tsx"
```

**적용 규칙**:
- 대괄호 `[]`가 포함된 모든 파일 경로는 처음부터 따옴표 사용
- `git add`, `git status`, 기타 bash 명령어에서 일관되게 적용
- 반복 실수 방지를 위해 대괄호 경로는 항상 따옴표 우선 적용