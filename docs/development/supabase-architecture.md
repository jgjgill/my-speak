# Supabase 아키텍처 설계

## 개요

외국어 학습 4단계 시스템을 위한 Supabase 데이터베이스 설계 문서입니다.
이 문서는 모노레포의 `@repo/typescript-config` 패키지에서 관리되며, 모든 앱에서 일관된 타입 정의를 사용할 수 있도록 합니다.


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

### 3. foreign_scripts (2-3단계: 외국어 번역 + 읽기 연습)

```sql
CREATE TABLE foreign_scripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  sentence_order INTEGER NOT NULL,
  foreign_text TEXT NOT NULL,
  chunked_text TEXT NOT NULL, -- 끊어읽기 버전 (| || 포함)
  grammar_notes TEXT, -- 문법 설명
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(topic_id, sentence_order)
);
```

**역할**: 2-3단계에서 사용할 외국어 스크립트와 학습 자료를 저장합니다.
- `foreign_text`: 완성된 외국어 문장
- `chunked_text`: 끊어읽기 기호가 포함된 버전 (`|` = 짧은 pause, `||` = 긴 pause)
- `grammar_notes`: 문법 설명 및 학습 포인트

### 4. keyword_speeches (4단계: 키워드 스피치)

```sql
CREATE TABLE keyword_speeches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  stage INTEGER NOT NULL CHECK (stage = 4), -- 4단계
  level INTEGER NOT NULL CHECK (level >= 1 AND level <= 4), -- 1(70%) ~ 4(영어키워드)
  sequence_order INTEGER NOT NULL,
  keywords TEXT[] NOT NULL, -- 키워드 배열
  target_sentence TEXT NOT NULL,
  difficulty_percentage INTEGER, -- 70, 50, 30, null(영어)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(topic_id, stage, level, sequence_order)
);
```

**역할**: 4단계 키워드 스피치 연습 데이터를 저장합니다.
- `stage`: 4단계 고정값
- `level`: 난이도 레벨 (1=70% 정보 → 4=외국어 키워드)
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
  current_stage INTEGER DEFAULT 1 CHECK (current_stage >= 1 AND current_stage <= 4),
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
  foreign_phrase TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**역할**: 콘텐츠 제작자가 미리 선별한 학습 포인트를 저장합니다.
- `sentence_order`: 해당 학습 포인트가 포함된 문장 순서
- `korean_phrase`: 한글 핵심 표현
- `foreign_phrase`: 대응하는 외국어 표현 (외국어 스크립트와 정확히 일치)

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

### 9. highlight_sentences (토픽별 핵심 문장)

```sql
CREATE TABLE highlight_sentences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  sentence_order INTEGER NOT NULL,
  korean_text TEXT NOT NULL,
  foreign_text TEXT NOT NULL,
  reason TEXT NOT NULL, -- 왜 이 문장이 핵심인지 설명
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(topic_id) -- 토픽당 하나의 핵심 문장만
);
```

**역할**: 각 토픽의 대표적인 핵심 문장을 관리합니다.
- `sentence_order`: 해당 토픽에서 몇 번째 문장인지
- `korean_text`: 핵심 한글 문장 
- `foreign_text`: 대응하는 외국어 문장
- `reason`: 왜 이 문장이 핵심인지에 대한 설명 (학습자의 호기심 유발)

**핵심 문장 선별 기준**:
- 한글로는 매우 자연스럽고 쉬운 표현
- 외국어로는 특정 구문이나 패턴을 알아야 자연스럽게 표현 가능
- 일상 회화에서 빈도가 높은 표현
- "아, 이렇게 표현하는구나!" 하는 깨달음을 주는 문장

### 10. user_translations (사용자 번역 저장)

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
- `user_translation`: 사용자가 입력한 외국어 번역
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

### 콘텐츠 테이블 (공개 접근)

콘텐츠 관련 테이블들은 모든 사용자에게 읽기/쓰기 권한을 부여합니다.

```sql
-- 콘텐츠 테이블들에 대한 전체 접근 권한
CREATE POLICY "content_parser_full_access" ON public.topics FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "content_parser_full_access" ON public.korean_scripts FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "content_parser_full_access" ON public.foreign_scripts FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "content_parser_full_access" ON public.keyword_speeches FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "content_parser_full_access" ON public.learning_points FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "highlight_sentences_full_access" ON public.highlight_sentences FOR ALL TO public USING (true) WITH CHECK (true);
```

### 사용자 데이터 보호

사용자 관련 테이블에 RLS가 활성화되어 각 사용자는 자신의 데이터만 접근할 수 있습니다.

```sql
-- profiles 테이블 보안 정책
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own profile" ON profiles FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- user_translations 테이블 보안 정책  
ALTER TABLE user_translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own translations" ON user_translations FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- user_selected_points 테이블 보안 정책
ALTER TABLE user_selected_points ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own selected points" ON user_selected_points FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- user_progress 테이블 보안 정책
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own progress" ON user_progress FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```


## 인덱스 설계

```sql
-- 성능 최적화를 위한 인덱스
CREATE INDEX idx_korean_scripts_topic_order ON korean_scripts(topic_id, sentence_order);
CREATE INDEX idx_foreign_scripts_topic_order ON foreign_scripts(topic_id, sentence_order);
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
- **2단계**: `topics` + `korean_scripts` + `foreign_scripts` + `learning_points` (하이라이트 표시)
- **3단계**: `topics` + `foreign_scripts` (chunked_text 활용) + `learning_points` (하이라이트)
- **4단계**: `topics` + `korean_scripts` + `foreign_scripts` + `keyword_speeches` + `learning_points`

### 4. 개인화 학습 플로우

```
1단계: 사용자가 어려운 표현 선택 → user_selected_points 저장
2-4단계: 선택된 학습 포인트를 하이라이트 표시
번역 입력: user_translations에 저장 (수정 가능)
```

## Content Parser 연동

### RLS 정책 설정 완료

모든 콘텐츠 테이블에 `content_parser_full_access` 정책이 적용되어 content-parser CLI에서 데이터를 성공적으로 업로드할 수 있습니다.

### 콘텐츠 생성 플로우

```
MD 파일 작성 → content-parser CLI → JSON 생성 → Supabase 업로드 → 웹앱에서 사용
```