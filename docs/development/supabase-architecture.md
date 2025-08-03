# Supabase 아키텍처 설계

## 개요

영어 학습 5단계 시스템을 위한 Supabase 데이터베이스 설계 문서입니다.
이 문서는 모노레포의 `@repo/typescript-config` 패키지에서 관리되며, 모든 앱에서 일관된 타입 정의를 사용할 수 있도록 합니다.

## Auth 시스템

### Google OAuth 연동

#### 설정 과정

1. **Google Cloud Console 설정**

- OAuth 2.0 클라이언트 ID 생성
- 승인된 리디렉션 URI: `https://[PROJECT_ID].supabase.co/auth/v1/callback`

2. **Supabase 설정**

- Authentication > Providers > Google 활성화
- Google Client ID와 Client Secret 입력

3. **Next.js 구현**


```typescript
// AuthProvider 컨텍스트 사용
const { signInWithGoogle, signOut, user } = useAuth();

// 로그인
await signInWithGoogle();

// 로그아웃  
await signOut();
  ```

4. **Next.js 서버사이드 인증 (Middleware)**

```typescript
// middleware.ts - 서버사이드 세션 관리
export async function middleware(request: NextRequest) {
  const supabase = createServerClient(/* config */);
  const { data: { user } } = await supabase.auth.getUser();
  
  // 인증 필요 라우트 보호
  if (!user && request.nextUrl.pathname.startsWith('/protected')) {
    return NextResponse.redirect('/login');
  }
  
  return response;
}
```

#### 인증 플로우

1. 사용자가 "구글로 로그인" 클릭
2. Google OAuth 페이지로 리디렉션
3. 사용자 동의 후 Supabase callback URL로 복귀
4. 자동 프로필 생성 (트리거 실행)
5. RLS 정책 적용으로 개인 데이터 보호

## 핵심 테이블 구조

### 1. topics (학습 주제 관리)

```sql
CREATE TABLE topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 일상생활, 업무/학업, 사회/문화, 개인성장
  difficulty TEXT NOT NULL CHECK (difficulty IN ('초급', '중급', '고급')),
  description TEXT,
  total_sentences INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

**역할**: 각 학습 주제의 메타데이터를 관리합니다.

- `category`: 콘텐츠 분류를 위한 카테고리
- `difficulty`: 학습 난이도 (초급/중급/고급)
- `total_sentences`: 해당 주제의 총 문장 수

### 2. korean_scripts (1단계: 한글 스크립트)

```sql
CREATE TABLE korean_scripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  sentence_order INTEGER NOT NULL,
  korean_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(topic_id, sentence_order)
);
```

**역할**: 1단계에서 사용할 한글 스크립트를 저장합니다.
- `sentence_order`: 문장 순서 (1부터 시작)
- `korean_text`: 번역할 한글 문장

### 3. english_scripts (2-3단계: 영어 번역 + 읽기 연습)

```sql
CREATE TABLE english_scripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  sentence_order INTEGER NOT NULL,
  english_text TEXT NOT NULL,
  chunked_text TEXT NOT NULL, -- 끊어읽기 버전 (| || 포함)
  grammar_notes TEXT, -- 문법 설명
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(topic_id, sentence_order)
);
```

**역할**: 2-3단계에서 사용할 영어 스크립트와 학습 자료를 저장합니다.
- `english_text`: 완성된 영어 문장
- `chunked_text`: 끊어읽기 기호가 포함된 버전 (`|` = 짧은 pause, `||` = 긴 pause)
- `grammar_notes`: 문법 설명 및 학습 포인트

### 4. keyword_speeches (4-5단계: 키워드 스피치)

```sql
CREATE TABLE keyword_speeches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  stage INTEGER NOT NULL CHECK (stage IN (4, 5)), -- 4단계 또는 5단계
  level INTEGER NOT NULL CHECK (level >= 1 AND level <= 4), -- 1(70%) ~ 4(영어키워드)
  sequence_order INTEGER NOT NULL,
  keywords TEXT[] NOT NULL, -- 키워드 배열
  target_sentence TEXT NOT NULL,
  difficulty_percentage INTEGER, -- 70, 50, 30, null(영어)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(topic_id, stage, level, sequence_order)
);
```

**역할**: 4-5단계 키워드 스피치 연습 데이터를 저장합니다.
- `stage`: 4단계(한→영 스피킹) 또는 5단계(키워드 스피치)
- `level`: 난이도 레벨 (1=70% 정보 → 4=영어 키워드)
- `keywords`: 키워드 배열
- `difficulty_percentage`: 정보 제공 비율 (70%, 50%, 30%, null)

### 5. profiles (사용자 프로필)

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**역할**: 사용자 프로필 정보를 관리합니다.
- `id`: Supabase Auth users 테이블과 연결
- `display_name`: 사용자 표시 이름 (구글 OAuth에서 자동 설정)
- `avatar_url`: 프로필 이미지 URL

### 6. user_progress (학습 진도 추적)

```sql
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  current_stage INTEGER DEFAULT 1 CHECK (current_stage >= 1 AND current_stage <= 5),
  completed_sentences INTEGER[] DEFAULT '{}', -- 완료한 문장 번호들
  practice_count INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, topic_id)
);
```

**역할**: 사용자별 학습 진도를 추적합니다.
- `user_id`: Supabase Auth 사용자 참조
- `current_stage`: 현재 진행 중인 학습 단계
- `completed_sentences`: 완료한 문장들의 순서 번호 배열
- `practice_count`: 연습 횟수

### 7. learning_points (학습 포인트 관리)

```sql
CREATE TABLE learning_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  sentence_order INTEGER NOT NULL,
  korean_phrase TEXT NOT NULL,
  english_phrase TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**역할**: 콘텐츠 제작자가 미리 선별한 학습 포인트를 저장합니다.
- `sentence_order`: 해당 학습 포인트가 포함된 문장 순서
- `korean_phrase`: 한글 핵심 표현
- `english_phrase`: 대응하는 영어 표현 (영어 스크립트와 정확히 일치)

### 8. user_selected_points (사용자 선택 학습 포인트)

```sql
CREATE TABLE user_selected_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  learning_point_id UUID REFERENCES learning_points(id) ON DELETE CASCADE,
  selected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT unique_user_learning_point UNIQUE(user_id, learning_point_id)
);
```

**역할**: 사용자가 1단계에서 어려워한 표현들을 추적합니다.
- `user_id`: Supabase Auth 사용자 참조
- `learning_point_id`: 사용자가 선택한 학습 포인트
- `selected_at`: 선택한 시점
- **중복 방지**: 같은 사용자가 같은 학습 포인트를 중복 선택하지 않도록 제약

**upsert 사용 예시**:
```typescript
// 학습 포인트 선택/해제 토글
const { error } = await supabase.from("user_selected_points").upsert({
  user_id: user.id,
  topic_id: topicId,
  learning_point_id: pointId,
}, {
  onConflict: 'user_id,learning_point_id'
});
```

### 9. user_translations (사용자 번역 저장)

```sql
CREATE TABLE user_translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  sentence_order INTEGER NOT NULL,
  korean_text TEXT NOT NULL,
  user_translation TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT unique_user_sentence_translation UNIQUE(user_id, topic_id, sentence_order)
);
```

**역할**: 사용자가 입력한 번역을 저장하고 학습 이력을 관리합니다.
- `user_id`: Supabase Auth 사용자 참조
- `sentence_order`: 번역한 문장의 순서
- `korean_text`: 원본 한글 문장
- `user_translation`: 사용자가 입력한 영어 번역
- `is_completed`: 번역 완료 여부 (1단계 토글 기능)
- `updated_at`: 수정 시점 (트리거로 자동 업데이트)
- **중복 방지**: 같은 사용자가 같은 문장을 중복 번역하지 않도록 제약

**중요: 데이터 무결성을 위한 필수 제약조건**

```sql
-- 반드시 추가해야 하는 unique 제약조건
ALTER TABLE user_translations 
ADD CONSTRAINT unique_user_topic_sentence 
UNIQUE (user_id, topic_id, sentence_order);
```

**upsert 사용 예시**:

```typescript
// 번역 저장/업데이트 (onConflict 필수)
const { error } = await supabase.from("user_translations").upsert({
  user_id: user.id,
  topic_id: topicId,
  sentence_order: sentenceOrder,
  korean_text: koreanText,
  user_translation: translation,
  is_completed: isCompleted,
}, {
  onConflict: 'user_id,topic_id,sentence_order'
});
```

**주의사항**:

- `onConflict` 없이 upsert를 사용하면 Primary Key(`id`)만 체크하여 항상 새 레코드가 생성됨
- unique 제약조건이 있어도 `onConflict`를 명시하지 않으면 중복 생성 시도 후 에러 발생

## 보안 정책 (RLS - Row Level Security)

### 사용자 데이터 보호

모든 사용자 관련 테이블에 RLS가 활성화되어 있어 각 사용자는 자신의 데이터만 접근할 수 있습니다.

```sql
-- profiles 테이블 보안 정책
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- user_translations 테이블 보안 정책
ALTER TABLE user_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own translations" ON user_translations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own translations" ON user_translations
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own translations" ON user_translations
  FOR UPDATE USING (auth.uid() = user_id);

-- user_selected_points 테이블 보안 정책
ALTER TABLE user_selected_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own selected points" ON user_selected_points
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own selected points" ON user_selected_points
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own selected points" ON user_selected_points
  FOR DELETE USING (auth.uid() = user_id);
```

### 자동 프로필 생성

새 사용자가 OAuth로 가입하면 자동으로 프로필이 생성됩니다.

```sql
-- 새 사용자 프로필 자동 생성 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 설정
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## 인덱스 설계

```sql
-- 성능 최적화를 위한 인덱스
CREATE INDEX idx_korean_scripts_topic_order ON korean_scripts(topic_id, sentence_order);
CREATE INDEX idx_english_scripts_topic_order ON english_scripts(topic_id, sentence_order);
CREATE INDEX idx_keyword_speeches_topic_stage_level ON keyword_speeches(topic_id, stage, level, sequence_order);
CREATE INDEX idx_user_progress_user_topic ON user_progress(user_id, topic_id);

-- 개인화 학습 기능을 위한 인덱스
CREATE INDEX idx_learning_points_topic_id ON learning_points(topic_id);
CREATE INDEX idx_learning_points_sentence_order ON learning_points(sentence_order);
CREATE INDEX idx_user_selected_points_user_topic ON user_selected_points(user_id, topic_id);
CREATE INDEX idx_user_translations_user_topic ON user_translations(user_id, topic_id);
CREATE INDEX idx_profiles_email ON profiles(email);
```

## 데이터 플로우

### 1. 콘텐츠 생성 플로우

```
MD 파일 작성 → content-parser → JSON 변환 → Supabase 테이블 삽입
```

### 2. 학습 플로우

```
topics 조회 → 단계별 데이터 로드 → 사용자 인터랙션 → progress 업데이트
```

### 3. 단계별 데이터 사용

- **1단계**: `topics` + `korean_scripts` + `learning_points` (사용자 선택 → `user_selected_points`)
- **2단계**: `topics` + `korean_scripts` + `english_scripts` + `learning_points` (하이라이트 표시)
- **3단계**: `topics` + `english_scripts` (chunked_text 활용) + `learning_points` (하이라이트)
- **4단계**: `topics` + `korean_scripts` + `english_scripts` + `keyword_speeches`(stage=4) + `learning_points`
- **5단계**: `topics` + `keyword_speeches`(stage=5)

### 4. 개인화 학습 플로우

```
1단계: 사용자가 어려운 표현 선택 → user_selected_points 저장
2-4단계: 선택된 학습 포인트를 하이라이트 표시
번역 입력: user_translations에 저장 (수정 가능)
```

## 모노레포 타입 관리

### 타입 생성 및 관리

#### 설정 파일

`packages/typescript-config/.env.local`:
```bash
# Supabase Configuration for TypeScript Types Generation
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
PROJECT_REF=your-project-ref
```

#### 자동화된 타입 생성

```bash
# typescript-config 패키지에서 실행
cd packages/typescript-config
pnpm update-types

# 또는 루트에서 실행
turbo run update-types --filter=@repo/typescript-config
```

#### 수동 타입 생성 (backup)

```bash
cd packages/typescript-config
npx supabase gen types typescript --project-id "your-project-ref" --schema public > supabase-types.ts
```

### 패키지 구조

```
packages/typescript-config/
├── .env.local                  # Supabase 연결 설정 (타입 생성용)
├── base.json                   # 기본 TS 설정
├── nextjs.json                 # Next.js 설정
├── react-library.json          # React 라이브러리 설정
├── supabase-types.ts           # Supabase 자동 생성 타입
├── docs/
│   └── supabase-architecture.md
├── package.json                # update-types 스크립트 포함
└── README.md
```

### 개발 워크플로우

#### 스키마 변경 시

1. **마이그레이션 적용**: Supabase 대시보드 또는 CLI로 적용
2. **타입 업데이트**: `pnpm update-types` 실행
3. **코드 수정**: 새로운 타입에 맞게 코드 업데이트
4. **테스트**: 전체 프로젝트 빌드 및 타입 체크

#### 자동화 권장사항

- Git hooks에 `update-types` 추가 고려
- CI/CD에서 타입 일관성 검증
- 스키마 변경 시 자동 PR 생성

### 사용 예시

#### apps/web에서

```typescript
import { Database, Tables } from "@repo/typescript-config/supabase-types";
import { LearningStage, TopicWithProgress } from "@repo/typescript-config/learning-types";

type Topic = Tables<'topics'>;
```

#### packages/content-parser에서

```typescript
import { Database } from "@repo/typescript-config/supabase-types";
import { ParsedLearningContent } from "@repo/typescript-config/learning-types";
```

#### apps/native에서

```typescript
import { Tables } from "@repo/typescript-config/supabase-types";
import { UserProgressData } from "@repo/typescript-config/learning-types";
```

## 확장 고려사항

### 향후 추가 가능한 테이블

- `vocabulary_notes`: 막힌 단어 상세 해설
- `audio_files`: 발음 가이드 오디오
- `user_recordings`: 사용자 연습 녹음
- `feedback_data`: AI 피드백 데이터

### 타입 안전성 보장

- Supabase CLI로 자동 타입 생성
- 모노레포 전체에서 일관된 타입 사용
- 빌드 시점에 타입 검증

### 성능 최적화

- 적절한 인덱스 설정으로 조회 성능 보장
- CASCADE DELETE로 데이터 일관성 유지
- UNIQUE 제약조건으로 중복 방지