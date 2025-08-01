# 🗄️ Supabase 초기 설정 가이드

## 1️⃣ Supabase 프로젝트 생성

### 계정 생성 및 프로젝트 설정

1. **Supabase 웹사이트 접속**: https://supabase.com
2. **계정 생성**: GitHub 계정으로 로그인 권장
3. **새 프로젝트 생성**:
   - Project name: `english-speaking-app`
   - Database Password: 안전한 비밀번호 생성
   - Region: `Northeast Asia (Seoul)` 선택
   - Pricing plan: `Free tier` 선택

### 프로젝트 정보 확인

프로젝트 생성 후 다음 정보를 확인하고 저장:
```
Project URL: https://your-project-ref.supabase.co
Anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Service role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (비밀!)
```

## 2️⃣ 로컬 개발 환경 설정

### Supabase CLI 설치
```bash
# npm으로 설치
npm install -g supabase

# 또는 Homebrew (macOS)
brew install supabase/tap/supabase

# 설치 확인
supabase --version
```

### 프로젝트 초기화
```bash
# 프로젝트 루트에서 실행
cd my-project
supabase init

# 폴더 구조 확인
ls supabase/
# 출력: config.toml  functions/  migrations/  seed.sql
```

### Supabase 로그인 및 연결
```bash
# Supabase 로그인
supabase login

# 원격 프로젝트와 연결
supabase link --project-ref your-project-ref

# 연결 확인
supabase status
```