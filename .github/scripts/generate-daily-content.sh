#!/bin/bash

# 외국어 학습 콘텐츠 일간 생성 스크립트
# 사용법: ./generate-daily-content.sh [language] [difficulty]

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 디렉토리 설정
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
CONTENT_DIR="$PROJECT_ROOT/content/source"
INDEX_FILE="$PROJECT_ROOT/content/.content-index.json"
PROMPT_FILE="$PROJECT_ROOT/.prompts/daily-content.md"

# 매개변수
LANGUAGE="${1:-en}"
DIFFICULTY="${2:-초급}"

echo -e "${BLUE}=== 일간 콘텐츠 생성 ===${NC}"
echo "언어: $LANGUAGE"
echo "난이도: $DIFFICULTY"
echo ""

# 1. 환경 검증
if [ ! -f "$PROMPT_FILE" ]; then
  echo -e "${RED}❌ 프롬프트 파일 없음: $PROMPT_FILE${NC}"
  exit 1
fi

if [ ! -f "$INDEX_FILE" ]; then
  echo -e "${RED}❌ 인덱스 파일 없음: $INDEX_FILE${NC}"
  exit 1
fi

if [ -z "$GEMINI_API_KEY" ]; then
  echo -e "${RED}❌ GEMINI_API_KEY 환경변수 필요${NC}"
  exit 1
fi

if ! command -v gemini &> /dev/null; then
  echo -e "${YELLOW}⚠️  gemini-cli 설치 중...${NC}"
  npm install -g @google/gemini-cli
  export PATH="$(npm root -g)/../bin:$PATH"
fi

if ! command -v jq &> /dev/null; then
  echo -e "${RED}❌ jq가 설치되어 있지 않습니다${NC}"
  exit 1
fi

# 2. 주간 계획에서 미사용 항목 선택
echo -e "${YELLOW}📋 주간 계획 확인 중...${NC}"

PLAN_ITEM=$(jq -r '.weekly_plan.planned_slugs[] | select(.used == false) | @json' \
  "$INDEX_FILE" | head -1)

if [ -z "$PLAN_ITEM" ]; then
  echo -e "${RED}❌ 사용 가능한 주간 계획이 없습니다${NC}"
  echo -e "${YELLOW}💡 먼저 generate-weekly-plan.sh를 실행하세요${NC}"
  exit 1
fi

SLUG=$(echo "$PLAN_ITEM" | jq -r '.slug')
TITLE=$(echo "$PLAN_ITEM" | jq -r '.title')
CATEGORY=$(echo "$PLAN_ITEM" | jq -r '.category')

echo -e "${GREEN}✅ 선택된 주제: ${TITLE}${NC}"
echo -e "${BLUE}   Slug: ${SLUG}${NC}"
echo -e "${BLUE}   Category: ${CATEGORY}${NC}"
echo ""

# 3. UUID 생성
UUID=$(node -e "console.log(require('crypto').randomUUID())")
echo -e "${BLUE}생성 UUID: $UUID${NC}"
echo ""

# 4. 프롬프트 생성 (변수 치환)
TEMP_PROMPT=$(mktemp)
sed -e "s|{{TITLE}}|${TITLE}|g" \
    -e "s|{{SLUG}}|${SLUG}|g" \
    -e "s|{{CATEGORY}}|${CATEGORY}|g" \
    -e "s|{{LANGUAGE}}|${LANGUAGE}|g" \
    -e "s|{{DIFFICULTY}}|${DIFFICULTY}|g" \
    -e "s|{{UUID}}|${UUID}|g" \
    "$PROMPT_FILE" > "$TEMP_PROMPT"

# 5. Gemini로 콘텐츠 생성
echo -e "${YELLOW}🤖 Gemini로 콘텐츠 생성 중...${NC}"
CONTENT=$(cat "$TEMP_PROMPT" | gemini --yolo 2>&1)
EXIT_CODE=$?
rm -f "$TEMP_PROMPT"

if [ $EXIT_CODE -ne 0 ]; then
  echo -e "${RED}❌ Gemini 실행 실패 (exit code: $EXIT_CODE)${NC}"
  echo -e "${RED}출력:${NC}"
  echo "$CONTENT"
  exit 1
fi

if [ -z "$CONTENT" ]; then
  echo -e "${RED}❌ 생성된 콘텐츠 없음${NC}"
  exit 1
fi

# 6. 마크다운 정리
CLEANED_CONTENT=$(echo "$CONTENT" | sed -e '/^```markdown$/d' -e '/^```$/d')
CLEANED_CONTENT=$(echo "$CLEANED_CONTENT" | awk '/^[[:space:]]*---/{flag=1} flag')

if [ -z "$CLEANED_CONTENT" ]; then
  echo -e "${RED}❌ 정리된 콘텐츠 없음${NC}"
  exit 1
fi

# 7. 파일 저장
OUTPUT_FILE="$CONTENT_DIR/${SLUG}.md"

if [ -f "$OUTPUT_FILE" ]; then
  echo -e "${RED}❌ 파일이 이미 존재합니다: $OUTPUT_FILE${NC}"
  exit 1
fi

mkdir -p "$CONTENT_DIR"
echo "$CLEANED_CONTENT" > "$OUTPUT_FILE"

echo -e "${GREEN}✅ 파일 저장: $OUTPUT_FILE${NC}"
echo ""

# frontmatter 미리보기
echo -e "${BLUE}=== Frontmatter 확인 ===${NC}"
head -20 "$OUTPUT_FILE"
echo -e "${BLUE}========================${NC}"
echo ""

# 8. content-parser 실행
echo -e "${YELLOW}🔄 content-parser 실행 중...${NC}"
cd "$PROJECT_ROOT/packages/content-parser"

# Supabase 환경변수 확인
if [ -z "$PUBLIC_SUPABASE_URL" ] || [ -z "$PUBLIC_SUPABASE_ANON_KEY" ]; then
  echo -e "${RED}❌ Supabase 환경변수 필요${NC}"
  echo "필수: PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY"
  exit 1
fi

# .env.local 생성
cat > .env.local <<EOF
PUBLIC_SUPABASE_URL=$PUBLIC_SUPABASE_URL
PUBLIC_SUPABASE_ANON_KEY=$PUBLIC_SUPABASE_ANON_KEY
EOF

# 파싱 실행
if pnpm run parse "${SLUG}.md" 2>&1; then
  echo -e "${GREEN}✅ 파싱 및 Supabase 업로드 완료${NC}"
else
  echo -e "${RED}❌ 파싱 실패${NC}"
  echo -e "${YELLOW}⚠️  생성된 파일은 유지: $OUTPUT_FILE${NC}"
  exit 1
fi

cd "$PROJECT_ROOT"
echo ""

# 9. content-index.json 업데이트
echo -e "${YELLOW}📝 인덱스 업데이트 중...${NC}"

jq --arg slug "$SLUG" \
  '.slugs += [$slug] |
   .total_count = (.slugs | length) |
   .weekly_plan.planned_slugs = (.weekly_plan.planned_slugs |
     map(if .slug == $slug then .used = true else . end)) |
   .generated_at = (now | strftime("%Y-%m-%dT%H:%M:%SZ"))' \
  "$INDEX_FILE" > "${INDEX_FILE}.tmp"

mv "${INDEX_FILE}.tmp" "$INDEX_FILE"

echo -e "${GREEN}✅ 인덱스 업데이트 완료${NC}"
echo ""

# 10. 완료
echo -e "${GREEN}=== 콘텐츠 생성 성공 ===${NC}"
echo "파일: $OUTPUT_FILE"
echo "Slug: $SLUG"
echo "제목: $TITLE"
echo "언어: $LANGUAGE"
echo "난이도: $DIFFICULTY"
echo ""

# 남은 계획 확인
REMAINING=$(jq '[.weekly_plan.planned_slugs[] | select(.used == false)] | length' "$INDEX_FILE")
echo -e "${BLUE}남은 주간 계획: ${REMAINING}/7${NC}"

if [ "$REMAINING" -eq 0 ]; then
  echo -e "${YELLOW}⚠️  모든 주간 계획을 소진했습니다. 다음 주에 새 계획이 생성됩니다.${NC}"
fi

# GitHub Actions output 저장
if [ -n "$GITHUB_OUTPUT" ]; then
  echo "filename=${SLUG}.md" >> "$GITHUB_OUTPUT"
  echo "filepath=$OUTPUT_FILE" >> "$GITHUB_OUTPUT"
  echo "slug=$SLUG" >> "$GITHUB_OUTPUT"
  echo "title=$TITLE" >> "$GITHUB_OUTPUT"
fi
