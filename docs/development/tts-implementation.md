# TTS (Text-to-Speech) 기능 구현 가이드

## 프로젝트 개요

언어 스피킹 학습 플랫폼 `my-speak`에서 2단계 끊어읽기 발음 연습을 위한 TTS 기능을 구현합니다.

### 핵심 요구사항

- **학습 지원**: 각 문장별 원어민 발음 재생으로 학습 효과 향상
- **크로스 플랫폼**: 웹브라우저, React Native WebView 모두 지원
- **다국어 확장**: 현재 영어, 향후 일본어 등 다국어 확장 가능
- **사용자 가이드**: 언어팩 설치 및 설정 방법 친절한 안내 (추후 구현)

## 작업 방향성

### 1단계: 웹 환경 구현 (Web Speech API)
- `stage-two-container.tsx`의 끊어읽기 발음 연습 구간에 TTS 버튼 추가
- 각 문장별 개별 재생 버튼 구현
- 재생 상태 시각적 피드백 제공

### 2단계: 매니저 패턴 적용
- 기존 `AudioRecorderManager` 패턴 참고하여 `TTSManager` 구현
- 환경별 컴포넌트 분리 (`BrowserTTS`, `WebViewTTS`, `UnsupportedTTS`)

### 3단계: 웹뷰 브릿지 통신 확장
- 기존 브릿지 메시지에 TTS 관련 타입 추가
- 네이티브 앱에 Expo Speech 연동

### 4단계: 언어팩 가이드 시스템
- 사용자 친화적인 언어팩 설치 안내 (세부 기획 필요)

## 플랫폼별 구현 전략

### 웹 브라우저 (Web Speech API)
- **API**: `speechSynthesis.speak()` 사용
- **언어 설정**: 동적 라우트 `[language]` 값 활용
- **음성 선택**: 브라우저 기본 음성 사용 (초기 구현)
- **재생 속도**: 자연스러운 실제 속도 유지

### React Native WebView (expo-speech)
- **브릿지 통신**: 기존 패턴 확장
- **메시지 타입**: `TTS_SPEAK`, `TTS_STOP`, `TTS_STATUS` 등
- **언어팩 확인**: 네이티브에서 언어팩 설치 상태 체크

## 핵심 구현 아키텍처

### TTSManager 컴포넌트 (AudioRecorderManager 패턴 참고)
```typescript
interface TTSManagerProps {
  text: string;
  language?: string;
  onSpeakStart?: () => void;
  onSpeakEnd?: () => void;
}

export default function TTSManager({ text, language, onSpeakStart, onSpeakEnd }: TTSManagerProps) {
  const ttsMode = useTTSMode(); // webview | browser | unsupported

  return (
    <>
      {ttsMode === "browser" && <BrowserTTS {...props} />}
      {ttsMode === "webview" && <WebViewTTS {...props} />}
      {ttsMode === "unsupported" && <UnsupportedTTS />}
    </>
  );
}
```

### 브릿지 메시지 확장
```typescript
// 기존 NativeMessage에 추가
type TTSMessage =
  | { type: "TTS_SPEAK"; text: string; language: string }
  | { type: "TTS_STOP" }
  | { type: "TTS_STATUS"; status: "speaking" | "stopped" | "error" };
```

### stage-two-container 통합 포인트
- **위치**: `stage-two-container.tsx:194-208` (끊어읽기 발음 연습 구간)
- **적용 방식**: 각 `foreignScripts` 문장에 TTS 버튼 추가
- **UI**: 🔊 재생 버튼, 재생 중 ⏸️ 일시정지 버튼

## 1단계 웹 구현 현황 (✅ 완료)

### 구현된 컴포넌트 구조
- ✅ **BrowserTTS**: Web Speech API 기반 TTS 구현
- ✅ **TTSManager**: 환경별 컴포넌트 매니저 (Browser/WebView/Unsupported)
- ✅ **UnsupportedTTS**: 미지원 환경용 UI 컴포넌트
- ✅ **WebViewTTS**: WebView 환경용 컴포넌트 (expo-speech 연동 준비)
- ✅ **useTTSMode**: 환경 감지 훅 (useWebView 활용)

### BrowserTTS 주요 기능
```typescript
// 핵심 기능
- Web Speech API 지원 여부 자동 감지
- 재생/정지 상태 관리 (react-simplikit useBooleanState)
- 언어별 최적 설정 (rate: 1.0, pitch: 1.0, volume: 1.0)
- 에러 핸들링 및 콜백 지원
- 정리 작업 (cleanup on unmount)

// UI 특징
- 🔊 재생 버튼 / ⏸️ 일시정지 버튼
- Tailwind CSS 스타일링 (green theme)
- 미지원 환경에서 적절한 안내 UI
```

### stage-two-container 통합 현황
- ✅ 각 외국어 스크립트별 TTS 버튼 추가
- ✅ 동적 라우트 `[language]` 파라미터 활용

## 다국어 확장성 고려사항

### 언어 코드 사용
- 동적 라우트 `[language]` 파라미터를 직접 사용
- `en`, `ja`, `ko` 등 단순한 언어 코드로 구성
- 브라우저가 자동으로 적절한 지역별 음성 선택

## 개발 순서

1. ✅ **웹 환경 TTS 기능** - `BrowserTTS` 컴포넌트 구현
2. ✅ **stage-two-container 통합** - 각 문장별 TTS 버튼 추가
3. ✅ **매니저 패턴 적용** - `TTSManager` 및 환경 감지 훅
4. 🚧 **브릿지 통신 확장** - 웹뷰 환경 지원 (다음 단계)
5. 📋 **언어팩 가이드** - 사용자 친화적 안내 시스템 (향후 계획)

## 2단계: WebView TTS 구현 현황 (🚧 진행 중)

### 구현된 브릿지 통신 구조
- ✅ **NativeBridge**: TTS 메시지 타입 추가 (`TTS_SPEAK`, `TTS_STOP`, `TTS_STATUS`)
- ✅ **tts-bridge.ts**: WebView → Native 메시지 전송 유틸리티
- ✅ **WebViewTTS**: expo-speech 브릿지 통신 컴포넌트

### 브릿지 메시지 타입
```typescript
// WebView → Native 메시지
interface NativeTTSSpeakMessage {
  type: "TTS_SPEAK";
  text: string;
  language: string;
}

interface NativeTTSStopMessage {
  type: "TTS_STOP";
}

// Native → WebView 응답
interface NativeTTSStatusMessage {
  type: "TTS_STATUS";
  status: "speaking" | "stopped" | "error";
}
```

### WebViewTTS 주요 기능
```typescript
// 핵심 기능
- 브릿지 통신을 통한 네이티브 TTS 제어
- 재생/정지 상태 관리 (useBooleanState)
- TTS_STATUS 메시지 수신 및 콜백 처리
- 환경 감지 불필요 (TTSManager에서 처리)

// UI 특징
- 🔊 재생 버튼 / ⏸️ 일시정지 버튼
- 파란색 테마 (브라우저 TTS와 구분)
- 브릿지 통신 실패시 적절한 에러 처리
```

### 다음 구현 필요사항
- 📋 **네이티브 앱**: expo-speech 연동 및 브릿지 메시지 처리
- 📋 **TTS_STATUS_REQUEST**: 초기 상태 확인 메시지 (필요시)

## 관련 문서

- [WebView 연동 아키텍처](webview-integration-architecture.md) - 브릿지 통신 구조 참고
- [오디오 녹음 구현 가이드](audio-recording-implementation.md) - 매니저 패턴 참고