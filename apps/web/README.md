# Web App

Next.js 기반 언어 학습 웹 애플리케이션. 4단계 학습 시스템과 Supabase 연동 인증을 제공합니다.

## 기술 스택

- **Next.js 15** + React 19 (App Router)
- **Tailwind CSS v4** - 스타일링
- **Supabase** - 인증 및 데이터베이스
- **TanStack Query 5** - 서버 상태 관리
- **TypeScript 5.8** - 타입 안정성

## 주요 기능

- 4단계 학습 시스템 (한글→외국어→자유연습→키워드 스피치)
- Google OAuth 인증
- 학습 진행도 추적
- TTS(Text-to-Speech) 음성 재생
- 음성 녹음 및 평가

## 개발 환경 설정

### 환경 변수

`.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 개발 서버 실행

```bash
# 루트에서 실행 (권장)
pnpm dev --filter=web

# 또는 apps/web 디렉토리에서
pnpm dev
```

개발 서버: http://localhost:3000

## 명령어

```bash
# 개발
pnpm dev

# 빌드
pnpm build

# 프로덕션 실행
pnpm start

# 린트 및 타입 체크
pnpm lint
pnpm check-types

# 테스트
pnpm test
```

## 아키텍처 문서

- [TanStack Query 아키텍처](./docs/development/tanstack-query-architecture.md)
- [WebView 연동 아키텍처](../../docs/development/webview-integration-architecture.md)
- [인증 아키텍처](../../docs/development/authentication-architecture.md)
