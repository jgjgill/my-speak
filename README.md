# my-speak

언어 스피킹 학습 플랫폼. 한글→외국어 번역과 키워드 스피치를 통한 4단계 학습 시스템을 제공합니다.

## 프로젝트 구조

```
apps/
├── web/              # Next.js 웹 애플리케이션
└── native/           # React Native 모바일 앱

packages/
├── content-parser/   # 학습 콘텐츠 파싱 및 DB 업로드 도구
└── typescript-config/ # 공유 TypeScript 설정
```

## 빠른 시작

### 요구사항
- Node.js >= 18 (v22.17.1)
- pnpm >= 9.0.0

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 전체 개발 서버 실행
pnpm dev

# 웹 앱만 실행
pnpm dev --filter=web

# 전체 빌드
pnpm build
```

## 주요 명령어

```bash
# 코드 포맷팅 및 린팅
pnpm format-and-lint
pnpm format-and-lint:fix

# 타입 체크
pnpm check-types

# 테스트 실행
vitest
```

## 기술 스택

- **모노레포**: Turborepo + pnpm workspace
- **웹**: Next.js 15, React 19, Tailwind CSS v4
- **모바일**: Expo, React Native, NativeWind
- **데이터베이스**: Supabase (PostgreSQL)
- **데이터 관리**: TanStack Query
- **테스트**: Vitest
- **코드 품질**: Biome

## 4단계 학습 시스템

1. **1단계**: 한글 학습 (번역 확인)
2. **2단계**: 외국어/끊어읽기 (문장 구조)
3. **3단계**: 자유 연습 (문장 조합)
4. **4단계**: 키워드 스피치 (실전 응용)

## 문서

- [콘텐츠 제작 워크플로우](docs/content/content-creation-flow.md)
- [Supabase 아키텍처](docs/development/supabase-architecture.md)
- [WebView 연동 아키텍처](docs/development/webview-integration-architecture.md)
- [TanStack Query 아키텍처](apps/web/docs/development/tanstack-query-architecture.md)

## 라이선스

MIT
