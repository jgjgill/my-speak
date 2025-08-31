# 오디오 녹음 기능 구현 가이드

## 프로젝트 개요

영어 스피킹 학습 플랫폼 `my-speak`에서 2단계(끊어읽기 연습) 완료를 위한 녹음 기능을 구현합니다.

### 핵심 요구사항

- **진행 조건**: 2단계에서 전체 끊어읽기 스크립트를 최소 1회 이상 녹음
- **크로스 플랫폼**: 웹브라우저, React Native WebView 모두 지원
- **데이터 저장**: Supabase Storage에 오디오 파일 저장

## 플랫폼별 구현 전략

### 1. 브라우저 환경 (MediaRecorder API)
- **Chrome/Firefox**: WebM/Opus 형식 사용
- **Safari/iOS**: MP4/AAC 형식 사용
- 브라우저별 MIME 타입 자동 감지

### 2. WebView 환경 (expo-audio 연동)
- **문제**: WebView에서 MediaRecorder API 제한적 지원
- **해결**: React Native의 expo-audio + 메시지 브릿지 연동
- **장점**: 모든 플랫폼에서 안정적인 오디오 품질

## WebView - Native App 연동 구조

### 메시지 브릿지 설계

#### 1. WebView → Native (녹음 요청)
```typescript
// 웹에서 네이티브로 녹음 시작 요청
window.ReactNativeWebView?.postMessage(JSON.stringify({
  type: 'AUDIO_RECORDING_START',
  payload: { 
    maxDuration: 300, // 5분
    quality: 'high'
  }
}));

// 녹음 중지 요청
window.ReactNativeWebView?.postMessage(JSON.stringify({
  type: 'AUDIO_RECORDING_STOP'
}));
```

#### 2. Native → WebView (녹음 결과)
```typescript
// 네이티브에서 웹으로 녹음 완료 알림
{
  type: 'AUDIO_RECORDING_COMPLETE',
  payload: {
    audioUri: 'file://path/to/recording.m4a',
    duration: 45.2,
    fileSize: 1024000
  }
}

// 녹음 에러 알림
{
  type: 'AUDIO_RECORDING_ERROR',
  payload: { 
    error: 'PERMISSION_DENIED' | 'RECORDING_FAILED' 
  }
}
```

### React Native 구현 (expo-audio 사용)

```javascript
// apps/native/hooks/useAudioRecorder.js
import { useAudioRecorder } from 'expo-audio';

export function useWebViewAudioRecorder(webViewRef) {
  const recorder = useAudioRecorder({
    android: { extension: '.m4a', outputFormat: 'MPEG_4', audioEncoder: 'AAC' },
    ios: { extension: '.m4a', outputFormat: 'MPEG4AAC' }
  });

  const handleWebViewMessage = async (event) => {
    const message = JSON.parse(event.nativeEvent.data);
    
    switch (message.type) {
      case 'AUDIO_RECORDING_START':
        try {
          await recorder.record();
          // 녹음 상태를 웹뷰로 전달
        } catch (error) {
          webViewRef.current?.postMessage(JSON.stringify({
            type: 'AUDIO_RECORDING_ERROR',
            payload: { error: 'RECORDING_FAILED' }
          }));
        }
        break;
        
      case 'AUDIO_RECORDING_STOP':
        const uri = await recorder.stop();
        webViewRef.current?.postMessage(JSON.stringify({
          type: 'AUDIO_RECORDING_COMPLETE',
          payload: { audioUri: uri, duration: recorder.duration }
        }));
        break;
    }
  };

  return { handleWebViewMessage };
}
```

## 기술 구현 방안

### 1. 오디오 녹음 컴포넌트

#### AudioRecorder 컴포넌트
```typescript
interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob, duration: number) => void;
  onError: (error: string) => void;
  maxDuration?: number; // 초 단위
  disabled?: boolean;
}

export function AudioRecorder({ 
  onRecordingComplete, 
  onError, 
  maxDuration = 300, // 5분 제한
  disabled = false 
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  // 구현 세부사항...
}
```

#### useAudioRecording 훅
```typescript
interface UseAudioRecordingOptions {
  topicId: string;
  recordingType: 'stage_two_complete' | 'stage_three_practice';
  onUploadSuccess?: (url: string) => void;
  onUploadError?: (error: string) => void;
}

export function useAudioRecording({
  topicId,
  recordingType,
  onUploadSuccess,
  onUploadError
}: UseAudioRecordingOptions) {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const uploadRecording = async (blob: Blob, duration: number) => {
    if (!user) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Supabase Storage 업로드 로직
      const fileName = `recordings/${user.id}/${topicId}/${recordingType}_${Date.now()}`;
      const { data, error } = await supabase.storage
        .from('audio-recordings')
        .upload(fileName, blob, {
          onUploadProgress: (progress) => {
            setUploadProgress(Math.round((progress.loaded / progress.total) * 100));
          }
        });
        
      if (error) throw error;
      
      // 데이터베이스에 녹음 정보 저장
      await saveRecordingInfo({
        audio_blob_url: data.path,
        file_size_bytes: blob.size,
        duration_seconds: duration,
        mime_type: blob.type
      });
      
      onUploadSuccess?.(data.path);
    } catch (error) {
      onUploadError?.(error.message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  return {
    uploadRecording,
    isUploading,
    uploadProgress
  };
}
```
