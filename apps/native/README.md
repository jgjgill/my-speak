# Native App

Expo 기반 React Native 모바일 애플리케이션. WebView 연동과 네이티브 기능(음성, 인증)을 제공합니다.

## 기술 스택

- **Expo 53** + React Native 0.79
- **NativeWind** - Tailwind CSS for React Native
- **Supabase OAuth** - Google, Apple 로그인
- **TanStack Query 5** - 서버 상태 관리
- **React Native WebView** - 웹 앱 연동
- **Expo Speech & Audio** - 음성 재생 및 녹음

## 주요 기능

- 네이티브 Google/Apple 로그인
- WebView로 웹 앱 임베딩 (세션 동기화)
- 음성 재생 (TTS)
- 음성 녹음 및 평가
- Safe Area 자동 처리

## 개발 환경 설정

### 환경 변수

`.env` 파일을 생성하고 다음 변수를 설정하세요:

```bash
# Supabase 설정
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 앱 URL 설정
EXPO_PUBLIC_BASE_URL=your_base_url
EXPO_PUBLIC_WEB_APP_URL=your_web_app_url
EXPO_PUBLIC_SCHEME=myspeaknative://

# OAuth 설정 (Google)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# OAuth 설정 (Apple)
APPLE_CLIENT_ID_WEB=your_apple_client_id
APPLE_CLIENT_SECRET_WEB=your_apple_client_secret

# JWT 설정
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
```

### 개발 서버 실행

```bash
# 루트에서 실행 (권장)
pnpm dev --filter=native

# 또는 apps/native 디렉토리에서
pnpm start
```

### 플랫폼별 실행

```bash
# iOS 시뮬레이터
pnpm ios

# Android 에뮬레이터
pnpm android

# 웹 (개발용)
pnpm web
```

## 명령어

```bash
# 개발 서버 시작
pnpm start

# 린트
pnpm lint
pnpm lint:fix

# 프로젝트 초기화 (새 시작 시)
pnpm reset-project
```

## 아키텍처 문서

- [WebView 연동 아키텍처](../../docs/development/webview-integration-architecture.md)
- [인증 아키텍처](../../docs/development/authentication-architecture.md)

## 빌드 및 배포

Expo 앱 빌드는 [Expo 공식 문서](https://docs.expo.dev/build/introduction/)를 참조하세요.
