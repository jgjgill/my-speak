#!/bin/bash

# 외국어 학습 콘텐츠 자동 생성 스크립트 (GitHub Actions 전용)
# 사용법: ./.github/scripts/generate-content.sh [language] [difficulty]
# 예시: ./.github/scripts/generate-content.sh en 초급

set -e

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 프로젝트 루트 디렉토리 확인
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# 매개변수 처리
LANGUAGE="${1:-en}"
DIFFICULTY="${2:-초급}"

echo -e "${BLUE}=== 외국어 학습 콘텐츠 자동 생성 ===${NC}"
echo "언어: $LANGUAGE"
echo "난이도: $DIFFICULTY"
echo ""

# 프롬프트 파일 경로
PROMPT_FILE="$PROJECT_ROOT/.prompts/content-generation.md"

if [ ! -f "$PROMPT_FILE" ]; then
  echo -e "${RED}❌ 프롬프트 파일을 찾을 수 없습니다: $PROMPT_FILE${NC}"
  exit 1
fi

# gemini-cli 설치 확인
if ! command -v gemini &> /dev/null; then
  echo -e "${YELLOW}⚠️  gemini-cli가 설치되어 있지 않습니다.${NC}"
  echo "설치 중: npm install -g @google/gemini-cli"
  npm install -g @google/gemini-cli

  # PATH 설정 (npm global bin 디렉토리 추가)
  export PATH="$(npm root -g)/../bin:$PATH"
fi

# GEMINI_API_KEY 환경변수 확인
if [ -z "$GEMINI_API_KEY" ]; then
  echo -e "${RED}❌ GEMINI_API_KEY 환경변수가 설정되어 있지 않습니다.${NC}"
  echo "GitHub Secrets에 GEMINI_API_KEY를 추가해주세요."
  exit 1
fi

# 임시 프롬프트 파일 생성 (파라미터 추가)
TEMP_PROMPT=$(mktemp)
cat "$PROMPT_FILE" > "$TEMP_PROMPT"

# 실제 파라미터를 프롬프트 끝에 추가
cat >> "$TEMP_PROMPT" <<EOF

---

## 🎯 실행 파라미터

**이번 생성 요청에 사용할 파라미터**:
- **언어 코드**: $LANGUAGE
- **난이도**: $DIFFICULTY

**중요**: 위 파라미터를 frontmatter의 language_code와 difficulty 필드에 정확히 반영하세요.

---

**지금 즉시 위 파라미터에 맞춰 완전한 마크다운 콘텐츠를 생성하세요. 추가 질문이나 확인 없이 즉시 생성해주세요.**
EOF

echo -e "${YELLOW}📝 Gemini AI가 콘텐츠를 생성하고 있습니다...${NC}"
echo ""

# gemini-cli 실행하여 콘텐츠 생성 (비대화형 모드)
GENERATED_CONTENT=$(gemini --yolo -p "$(cat "$TEMP_PROMPT")" 2>&1)
EXIT_CODE=$?

# 임시 파일 정리
rm -f "$TEMP_PROMPT"

# 생성 실패 확인
if [ $EXIT_CODE -ne 0 ]; then
  echo -e "${RED}❌ gemini-cli 실행 실패 (Exit Code: $EXIT_CODE)${NC}"
  echo -e "${RED}에러 내용:${NC}"
  echo "$GENERATED_CONTENT"

  # 디버깅: gemini 명령어 경로 출력
  echo -e "${YELLOW}디버깅 정보:${NC}"
  echo "PATH: $PATH"
  echo "which gemini: $(which gemini 2>&1 || echo 'not found')"
  echo "npm root -g: $(npm root -g 2>&1 || echo 'failed')"

  exit 1
fi

# 생성된 콘텐츠가 비어있는지 확인
if [ -z "$GENERATED_CONTENT" ]; then
  echo -e "${RED}❌ 콘텐츠 생성에 실패했습니다.${NC}"
  exit 1
fi

# 마크다운 코드 블록 제거 및 불필요한 텍스트 제거
CLEANED_CONTENT=$(echo "$GENERATED_CONTENT" | sed -e '/^```markdown$/d' -e '/^```$/d')

# Gemini가 추가한 "Suggested filename:" 같은 불필요한 텍스트 제거
# frontmatter 시작(---) 이전의 모든 텍스트 제거
CLEANED_CONTENT=$(echo "$CLEANED_CONTENT" | awk '/^---/{flag=1} flag')

# 파일명 추출 시도 (여러 패턴 시도)
FILENAME=""

# 패턴 1: "파일명: xxx.md" 형식
FILENAME=$(echo "$CLEANED_CONTENT" | grep -i "파일명:" | sed 's/.*파일명:\s*//i' | sed 's/[^a-z0-9.-]//g' | head -1)

# 패턴 2: "Filename: xxx.md" 형식
if [ -z "$FILENAME" ]; then
  FILENAME=$(echo "$CLEANED_CONTENT" | grep -i "filename:" | sed 's/.*filename:\s*//i' | sed 's/[^a-z0-9.-]//g' | head -1)
fi

# 파일명이 없거나 .md로 끝나지 않으면 기본값 생성
if [ -z "$FILENAME" ] || [[ ! "$FILENAME" =~ \.md$ ]]; then
  TIMESTAMP=$(date +%Y%m%d-%H%M%S)
  FILENAME="content-${LANGUAGE}-${TIMESTAMP}.md"
  echo -e "${YELLOW}⚠️  파일명 제안이 없어 기본 파일명 사용: $FILENAME${NC}"
fi

# 콘텐츠 파일 저장
CONTENT_DIR="$PROJECT_ROOT/content/source"
OUTPUT_FILE="$CONTENT_DIR/$FILENAME"

mkdir -p "$CONTENT_DIR"
echo "$CLEANED_CONTENT" > "$OUTPUT_FILE"

echo -e "${GREEN}✅ 마크다운 파일 생성 완료: $OUTPUT_FILE${NC}"
echo ""

# 생성된 파일의 frontmatter 미리보기 (디버깅용)
echo -e "${BLUE}=== 생성된 Frontmatter 확인 ===${NC}"
head -20 "$OUTPUT_FILE"
echo -e "${BLUE}==============================${NC}"
echo ""

# content-parser 실행
echo -e "${YELLOW}🔄 content-parser로 파싱 중...${NC}"
cd "$PROJECT_ROOT/packages/content-parser"

# Supabase 환경변수 확인
if [ -z "$PUBLIC_SUPABASE_URL" ] || [ -z "$PUBLIC_SUPABASE_ANON_KEY" ]; then
  echo -e "${RED}❌ Supabase 환경변수가 설정되어 있지 않습니다.${NC}"
  echo "필수 환경변수: PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY"
  exit 1
fi

# .env.local 파일 동적 생성 (GitHub Actions 환경)
cat > .env.local <<EOF
PUBLIC_SUPABASE_URL=$PUBLIC_SUPABASE_URL
PUBLIC_SUPABASE_ANON_KEY=$PUBLIC_SUPABASE_ANON_KEY
EOF

# 파싱 실행
if pnpm run parse "$FILENAME" 2>&1; then
  echo -e "${GREEN}✅ 파싱 및 Supabase 업로드 완료${NC}"
else
  echo -e "${RED}❌ 파싱 실패${NC}"
  echo -e "${YELLOW}⚠️  생성된 파일은 유지됩니다: $OUTPUT_FILE${NC}"
  echo -e "${YELLOW}💡 파일을 직접 확인하여 frontmatter를 수정하세요.${NC}"

  # 생성된 파일의 frontmatter 미리보기
  echo ""
  echo -e "${BLUE}=== 생성된 파일 Frontmatter ===${NC}"
  head -20 "$OUTPUT_FILE"
  echo ""

  exit 1
fi

echo ""
echo -e "${GREEN}=== 콘텐츠 생성 완료 ===${NC}"
echo "파일: $OUTPUT_FILE"
echo "언어: $LANGUAGE"
echo "난이도: $DIFFICULTY"
echo ""

# 생성된 파일 정보를 GitHub Actions output으로 저장
if [ -n "$GITHUB_OUTPUT" ]; then
  echo "filename=$FILENAME" >> "$GITHUB_OUTPUT"
  echo "filepath=$OUTPUT_FILE" >> "$GITHUB_OUTPUT"
  echo "language=$LANGUAGE" >> "$GITHUB_OUTPUT"
  echo "difficulty=$DIFFICULTY" >> "$GITHUB_OUTPUT"
fi
