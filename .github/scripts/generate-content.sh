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

# UUID 생성 (Node.js 기반 - 크로스 플랫폼 호환)
UUID=$(node -e "console.log(require('crypto').randomUUID())")

# 최근 생성된 콘텐츠의 주제 추출 (블랙리스트)
echo -e "${YELLOW}📋 최근 생성된 주제 확인 중...${NC}"
CONTENT_DIR="$PROJECT_ROOT/content/source"
RECENT_TOPICS=""

if [ -d "$CONTENT_DIR" ] && [ "$(ls -A $CONTENT_DIR/*.md 2>/dev/null)" ]; then
  # 최근 20개 파일의 title 추출 (awk로 정확하게 파싱)
  RECENT_TOPICS=$(ls -t "$CONTENT_DIR"/*.md 2>/dev/null | head -20 | while read file; do
    awk '/^title:/ {gsub(/^title:[[:space:]]*"|"[[:space:]]*$/, ""); print}' "$file"
  done | paste -sd ", " -)

  if [ -n "$RECENT_TOPICS" ]; then
    echo -e "${BLUE}최근 생성된 주제 (20개):${NC}"
    echo -e "${BLUE}$RECENT_TOPICS${NC}"
  else
    echo -e "${YELLOW}⚠️  주제 추출 실패 - 디버깅 정보:${NC}"
    ls -t "$CONTENT_DIR"/*.md 2>/dev/null | head -3 | while read file; do
      echo "  파일: $(basename $file)"
      grep "^title:" "$file" || echo "    → title 필드 없음"
    done
  fi
fi

# UUID의 마지막 문자를 추출하여 문장 수 가이드 생성
UUID_LAST_CHAR="${UUID: -1}"
echo -e "${BLUE}UUID 마지막 문자: $UUID_LAST_CHAR${NC}"

# 임시 프롬프트 파일 생성 (파라미터 추가)
TEMP_PROMPT=$(mktemp)
cat "$PROMPT_FILE" > "$TEMP_PROMPT"

# 실제 파라미터를 프롬프트 끝에 추가
cat >> "$TEMP_PROMPT" <<EOF

---

## 🎯 실행 파라미터

**이번 생성 요청에 사용할 파라미터**:
- **UUID**: $UUID
- **UUID 마지막 문자**: $UUID_LAST_CHAR (문장 수 결정용)
- **언어 코드**: $LANGUAGE
- **난이도**: $DIFFICULTY

**중요**: 위 파라미터를 frontmatter의 topic_id, language_code, difficulty 필드에 정확히 반영하세요.

---

## 🚫 절대 사용 금지 주제 (최근 생성됨)

다음 주제들은 최근에 이미 생성되었으므로 **절대 사용하지 마세요**:

$RECENT_TOPICS

**필수**: 위 목록과 **완전히 다른 새로운 주제**를 만들어야 합니다. 비슷한 주제도 허용되지 않습니다.

---

## 📏 대화 길이 결정 (UUID 기반)

UUID 마지막 문자 '$UUID_LAST_CHAR'를 기준으로 문장 수를 결정하세요:
- 0-9: **5-6 문장** (최우선 - 70% 확률)
- a-c: **7-8 문장** (권장 - 25% 확률)
- d-e: **9-10 문장** (희박 - 4% 확률)
- f: **11-12 문장** (매우 드물게 - 1% 확률)

**이 가중치를 반드시 따라 대화를 생성하세요. 12문장 이상은 절대 금지입니다.**

---

**지금 즉시 위 파라미터에 맞춰 완전한 마크다운 콘텐츠를 생성하세요. 추가 질문이나 확인 없이 즉시 생성해주세요.**
EOF

echo -e "${YELLOW}📝 Gemini AI가 콘텐츠를 생성하고 있습니다...${NC}"
echo ""

# gemini-cli 실행하여 콘텐츠 생성 (비대화형 모드)
GENERATED_CONTENT=$(gemini --yolo -p "$(cat "$TEMP_PROMPT")" 2>&1)
EXIT_CODE=$?

echo -e "${BLUE}=== Gemini CLI Raw Output ===${NC}"
echo "$GENERATED_CONTENT"
echo -e "${BLUE}=============================${NC}"

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

echo -e "${BLUE}=== After removing code blocks ===${NC}"
echo "$CLEANED_CONTENT" | head -30
echo -e "${BLUE}=================================${NC}"

# Gemini가 추가한 "Suggested filename:" 같은 불필요한 텍스트 제거
# frontmatter 시작(---) 이전의 모든 텍스트 제거 (공백 허용)
CLEANED_CONTENT=$(echo "$CLEANED_CONTENT" | awk '/^[[:space:]]*---/{flag=1} flag')

echo -e "${BLUE}=== After frontmatter extraction ===${NC}"
echo "$CLEANED_CONTENT" | head -30
echo -e "${BLUE}====================================${NC}"

# CLEANED_CONTENT가 비어있는 경우 에러
if [ -z "$CLEANED_CONTENT" ]; then
  echo -e "${RED}❌ 정리된 콘텐츠가 비어있습니다${NC}"
  echo -e "${RED}원본 Gemini 출력:${NC}"
  echo "$GENERATED_CONTENT"
  exit 1
fi

# frontmatter에서 slug 추출하여 파일명 생성
SLUG=$(echo "$CLEANED_CONTENT" | grep -m 1 '^slug:' | sed 's/^slug:\s*"\?\(.*\)"\?$/\1/' | tr -d '"' | xargs)

if [ -n "$SLUG" ] && [[ "$SLUG" =~ ^[a-z0-9-]+$ ]]; then
  # slug가 유효한 형식이면 파일명으로 사용
  FILENAME="${SLUG}.md"
  echo -e "${GREEN}✅ Slug에서 파일명 생성: $SLUG → $FILENAME${NC}"
else
  # slug가 없거나 잘못된 형식이면 타임스탬프 사용
  TIMESTAMP=$(date +%Y%m%d-%H%M%S)
  FILENAME="content-${LANGUAGE}-${TIMESTAMP}.md"
  echo -e "${YELLOW}⚠️  Slug를 찾을 수 없어 기본 파일명 사용: $FILENAME${NC}"
  if [ -n "$SLUG" ]; then
    echo -e "${YELLOW}   (잘못된 slug 형식: '$SLUG')${NC}"
  fi
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
