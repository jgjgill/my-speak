# 오디오 녹음 기능 구현 가이드

## 프로젝트 개요

영어 스피킹 학습 플랫폼 `my-speak`에서 2단계(끊어읽기 연습)에서 3단계로 진행하기 위한 녹음 기능을 구현합니다. 

### 핵심 요구사항

- **진행 조건**: 2단계에서 전체 끊어읽기 스크립트를 최소 1회 이상 녹음
- **크로스 플랫폼**: 웹브라우저, 웹뷰(Android), Safari(iOS) 모두 지원
- **데이터 저장**: Supabase Storage에 오디오 파일 저장 및 진행상황 추적

## 브라우저 호환성 분석

### MediaRecorder API 지원 현황 (2025년 기준)

| 플랫폼 | 지원 여부 | 제약사항 | 권장 형식 |
|--------|-----------|----------|-----------|
| Chrome/Android | ✅ 완전 지원 | 없음 | WebM/Opus |
| Firefox | ✅ 완전 지원 | 없음 | WebM/Opus |
| Safari/iOS | ⚠️ 제한적 지원 | WebM 미지원, 일부 기능 제한 | MP4/AAC |
| Edge | ✅ 완전 지원 | 없음 | WebM/Opus |

### 크로스 플랫폼 대응 전략

#### 1. 형식 감지 및 선택
```typescript
function getSupportedMimeType(): string {
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/mp4;codecs=mp4a.40.2'
  ];
  
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  
  return 'audio/webm'; // 기본값
}
```

#### 2. iOS Safari 특별 처리
- MP4/AAC 형식 사용
- 짧은 녹음 세션으로 분할
- 파일 크기 제한 강화 (2MB 이하)

## 데이터베이스 스키마 설계

### 1. user_recordings 테이블

```sql
CREATE TABLE user_recordings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  recording_type TEXT NOT NULL CHECK (recording_type IN ('stage_two_complete', 'stage_three_practice')),
  audio_blob_url TEXT, -- Supabase Storage에 저장된 오디오 파일 URL
  file_size_bytes INTEGER,
  duration_seconds REAL,
  mime_type TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT unique_user_topic_recording_type UNIQUE(user_id, topic_id, recording_type)
);

-- RLS 정책
ALTER TABLE user_recordings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recordings" ON user_recordings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recordings" ON user_recordings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own recordings" ON user_recordings
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own recordings" ON user_recordings
  FOR DELETE USING (auth.uid() = user_id);
```

### 2. user_stage_completions 테이블

```sql
CREATE TABLE user_stage_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  stage INTEGER NOT NULL CHECK (stage >= 1 AND stage <= 5),
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  completion_requirements JSONB DEFAULT '{}', -- 완료 조건 상세 정보
  CONSTRAINT unique_user_topic_stage UNIQUE(user_id, topic_id, stage)
);

-- RLS 정책
ALTER TABLE user_stage_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stage completions" ON user_stage_completions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stage completions" ON user_stage_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own stage completions" ON user_stage_completions
  FOR UPDATE USING (auth.uid() = user_id);
```

### 3. TypeScript 타입 정의

```typescript
// packages/typescript-config/supabase-types.ts에 추가될 타입들
export interface UserRecording {
  id: string;
  user_id: string;
  topic_id: string;
  recording_type: 'stage_two_complete' | 'stage_three_practice';
  audio_blob_url?: string;
  file_size_bytes?: number;
  duration_seconds?: number;
  mime_type?: string;
  recorded_at: string;
}

export interface UserStageCompletion {
  id: string;
  user_id: string;
  topic_id: string;
  stage: number;
  is_completed: boolean;
  completed_at?: string;
  completion_requirements: Record<string, any>;
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

### 2. 단계 진행 조건 검증

#### useStageProgression 훅
```typescript
interface UseStageProgressionOptions {
  topicId: string;
  currentStage: number;
}

export function useStageProgression({ topicId, currentStage }: UseStageProgressionOptions) {
  const { user } = useAuth();
  const [canProceedToNext, setCanProceedToNext] = useState(false);
  const [completionStatus, setCompletionStatus] = useState<Record<number, boolean>>({});
  
  // 2단계 완료 조건 확인 (녹음 완료 여부)
  const checkStage2Completion = useCallback(async () => {
    if (!user || currentStage !== 2) return false;
    
    const { data, error } = await supabase
      .from('user_recordings')
      .select('id')
      .eq('user_id', user.id)
      .eq('topic_id', topicId)
      .eq('recording_type', 'stage_two_complete')
      .single();
      
    return !error && data;
  }, [user, topicId, currentStage]);
  
  // 단계 완료 상태 업데이트
  const markStageComplete = async (stage: number) => {
    if (!user) return;
    
    const requirements = stage === 2 
      ? { recording_completed: true }
      : {};
    
    const { error } = await supabase.from('user_stage_completions').upsert({
      user_id: user.id,
      topic_id: topicId,
      stage,
      is_completed: true,
      completed_at: new Date().toISOString(),
      completion_requirements: requirements
    }, {
      onConflict: 'user_id,topic_id,stage'
    });
    
    if (!error) {
      setCompletionStatus(prev => ({ ...prev, [stage]: true }));
    }
  };
  
  return {
    canProceedToNext,
    completionStatus,
    checkStage2Completion,
    markStageComplete
  };
}
```

### 3. Supabase Storage 설정

#### Storage 버킷 생성
```sql
-- Supabase 대시보드에서 실행
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio-recordings', 'audio-recordings', false);
```

#### Storage RLS 정책
```sql
-- 사용자는 자신의 녹음 파일만 업로드 가능
CREATE POLICY "Users can upload own recordings" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'audio-recordings' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- 사용자는 자신의 녹음 파일만 조회 가능
CREATE POLICY "Users can view own recordings" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'audio-recordings' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- 사용자는 자신의 녹음 파일만 삭제 가능
CREATE POLICY "Users can delete own recordings" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'audio-recordings' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

## 컴포넌트 통합 예시

### StageTwoContainer 수정
```typescript
// apps/web/app/[language]/topics/[id]/components/stage-two-container.tsx

export default function StageTwoContainer({ topicId }: StageTwoContainerProps) {
  const { user } = useAuth();
  const { markStageComplete, completionStatus } = useStageProgression({ 
    topicId, 
    currentStage: 2 
  });
  
  const handleRecordingComplete = async (blob: Blob, duration: number) => {
    // 녹음 업로드 및 단계 완료 처리
    await uploadRecording(blob, duration);
    await markStageComplete(2);
  };

  return (
    <div className="border p-4 mb-6">
      <h2 className="text-xl font-bold mb-4">2단계: 영어 스크립트</h2>
      
      {/* 기존 내용... */}
      
      <div className="mt-6 p-3 border">
        <h4 className="font-bold mb-3">전체 끊어읽기 스크립트</h4>
        <p className="text-sm mb-3">이제 전체를 한 번에 따라 읽어보세요.</p>
        
        <div className="mb-4">
          {englishScripts.map((script, index) => (
            <span key={script.id}>
              {script.chunked_text}
              {index < englishScripts.length - 1 && " || "}
            </span>
          ))}
        </div>
        
        {/* 녹음 기능 추가 */}
        <RecordingSection
          topicId={topicId}
          onRecordingComplete={handleRecordingComplete}
          isCompleted={completionStatus[2]}
        />
        
        {completionStatus[2] && (
          <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded">
            <p className="text-green-700 text-sm">
              ✅ 2단계 완료! 이제 3단계로 진행할 수 있습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

### RecordingSection 컴포넌트
```typescript
interface RecordingSectionProps {
  topicId: string;
  onRecordingComplete: (blob: Blob, duration: number) => void;
  isCompleted: boolean;
}

function RecordingSection({ topicId, onRecordingComplete, isCompleted }: RecordingSectionProps) {
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'completed'>('idle');
  const { uploadRecording, isUploading, uploadProgress } = useAudioRecording({
    topicId,
    recordingType: 'stage_two_complete',
    onUploadSuccess: () => setRecordingState('completed'),
    onUploadError: (error) => console.error('Upload failed:', error)
  });

  const handleRecordingFinish = async (blob: Blob, duration: number) => {
    await uploadRecording(blob, duration);
    onRecordingComplete(blob, duration);
  };

  if (isCompleted) {
    return (
      <div className="p-3 bg-green-50 border border-green-200 rounded">
        <p className="text-green-700">✅ 녹음이 완료되었습니다!</p>
      </div>
    );
  }

  return (
    <div className="border rounded p-4">
      <h5 className="font-semibold mb-2">🎤 끊어읽기 연습 녹음</h5>
      <p className="text-sm text-gray-600 mb-3">
        위의 스크립트를 읽으며 녹음해주세요. 3단계로 진행하려면 최소 1회 녹음이 필요합니다.
      </p>
      
      <AudioRecorder
        onRecordingComplete={handleRecordingFinish}
        onError={(error) => console.error('Recording error:', error)}
        maxDuration={180} // 3분 제한
        disabled={isUploading}
      />
      
      {isUploading && (
        <div className="mt-3">
          <div className="text-sm text-blue-600 mb-1">업로드 중... {uploadProgress}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
```

## 테스트 및 배포 고려사항

### 1. 브라우저별 테스트 매트릭스

| 기능 | Chrome | Safari | Firefox | Edge | Android WebView |
|------|--------|--------|---------|------|-----------------|
| 기본 녹음 | ✅ | ✅ | ✅ | ✅ | ✅ |
| WebM 형식 | ✅ | ❌ | ✅ | ✅ | ✅ |
| MP4 형식 | ✅ | ✅ | ❌ | ✅ | ✅ |
| 장시간 녹음 | ✅ | ⚠️ | ✅ | ✅ | ⚠️ |

### 2. 성능 최적화

#### 파일 크기 최적화
```typescript
const RECORDING_CONFIG = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    sampleRate: 22050, // CD 품질의 절반으로 용량 절약
    channelCount: 1 // 모노 녹음
  }
};
```

#### 메모리 관리
```typescript
// 녹음 후 스트림 정리
const cleanup = () => {
  if (streamRef.current) {
    streamRef.current.getTracks().forEach(track => track.stop());
    streamRef.current = null;
  }
  if (mediaRecorderRef.current) {
    mediaRecorderRef.current = null;
  }
  chunksRef.current = [];
};
```

### 3. 에러 핸들링

#### 권한 요청 실패
```typescript
const requestMicrophonePermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop()); // 즉시 정리
    return true;
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      throw new Error('마이크 권한이 필요합니다. 브라우저 설정에서 마이크 접근을 허용해주세요.');
    } else if (error.name === 'NotFoundError') {
      throw new Error('마이크를 찾을 수 없습니다. 마이크가 연결되어 있는지 확인해주세요.');
    }
    throw new Error('마이크 접근 중 오류가 발생했습니다.');
  }
};
```

#### 네트워크 오류 처리
```typescript
const uploadWithRetry = async (blob: Blob, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await supabase.storage.from('audio-recordings').upload(fileName, blob);
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      // 지수 백오프로 재시도
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
};
```

## 마이그레이션 가이드

### 1. 데이터베이스 마이그레이션 순서

1. **Storage 버킷 생성**
2. **새 테이블 생성** (`user_recordings`, `user_stage_completions`)
3. **RLS 정책 적용**
4. **기존 `user_progress` 테이블과 연동**

### 2. 코드 배포 순서

1. **백엔드 스키마 업데이트**
2. **TypeScript 타입 재생성**
3. **녹음 컴포넌트 개발 및 테스트**
4. **단계별 통합 테스트**
5. **프로덕션 배포**

이 가이드를 따라 구현하면 크로스 플랫폼 호환성을 보장하면서도 안정적인 녹음 기능을 제공할 수 있습니다.