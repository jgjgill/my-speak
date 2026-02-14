#!/bin/bash

# 외국어 학습 콘텐츠 일간 생성 스크립트 (REST API 버전)
# 사용법: ./generate-daily-content-rest.sh [language] [difficulty]
# Gemini CLI 대신 REST API를 직접 호출하여 외부 CLI 의존성 제거

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

echo -e "${BLUE}=== 일간 콘텐츠 생성 (REST API) ===${NC}"
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

if ! command -v jq &> /dev/null; then
  echo -e "${RED}❌ jq가 설치되어 있지 않습니다${NC}"
  exit 1
fi

if ! command -v curl &> /dev/null; then
  echo -e "${RED}❌ curl이 설치되어 있지 않습니다${NC}"
  exit 1
fi

# 2. 주간 계획에서 미사용 항목 선택
echo -e "${YELLOW}📋 주간 계획 확인 중...${NC}"

PLAN_ITEM=$(jq -r '.weekly_plan.planned_slugs[] | select(.used == false) | @json' \
  "$INDEX_FILE" | head -1)

if [ -z "$PLAN_ITEM" ]; then
  echo -e "${RED}❌ 사용 가능한 주간 계획이 없습니다${NC}"
  echo -e "${YELLOW}🔍 디버깅 정보:${NC}"

  # 전체 계획 개수 확인
  TOTAL_PLANNED=$(jq '[.weekly_plan.planned_slugs[] // empty] | length' "$INDEX_FILE" 2>/dev/null || echo "0")
  USED_COUNT=$(jq '[.weekly_plan.planned_slugs[] | select(.used == true)] | length' "$INDEX_FILE" 2>/dev/null || echo "0")

  echo "  - 전체 주간 계획: ${TOTAL_PLANNED}개"
  echo "  - 이미 사용됨: ${USED_COUNT}개"
  echo "  - 남은 계획: $((TOTAL_PLANNED - USED_COUNT))개"
  echo ""

  if [ "$TOTAL_PLANNED" -eq 0 ]; then
    echo -e "${YELLOW}💡 주간 계획이 없습니다. generate-weekly-plan.sh를 실행하세요${NC}"
  else
    echo -e "${YELLOW}💡 모든 주간 계획을 소진했습니다. 다음 주 계획을 생성하세요${NC}"
  fi
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

# 5. Gemini REST API로 콘텐츠 생성
echo -e "${YELLOW}🤖 Gemini REST API로 콘텐츠 생성 중...${NC}"
PROMPT_CONTENT=$(cat "$TEMP_PROMPT")
rm -f "$TEMP_PROMPT"

GEMINI_API_URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent"

# 프롬프트를 JSON 안전한 문자열로 변환
PROMPT_JSON=$(echo "$PROMPT_CONTENT" | jq -Rs .)

# API 요청 본문 생성
REQUEST_BODY=$(cat <<EOF
{
  "contents": [
    {
      "parts": [
        {
          "text": ${PROMPT_JSON}
        }
      ]
    }
  ]
}
EOF
)

# REST API 호출
RESPONSE=$(curl -s -w "\n%{http_code}" \
  "${GEMINI_API_URL}" \
  -H "x-goog-api-key: ${GEMINI_API_KEY}" \
  -H "Content-Type: application/json" \
  -X POST \
  -d "${REQUEST_BODY}")

# HTTP 상태 코드와 응답 본문 분리
HTTP_CODE=$(echo "$RESPONSE" | tail -1)
RESPONSE_BODY=$(echo "$RESPONSE" | sed '$d')

echo -e "${BLUE}HTTP 상태 코드: ${HTTP_CODE}${NC}"

if [ "$HTTP_CODE" -ne 200 ]; then
  echo -e "${RED}❌ Gemini API 호출 실패 (HTTP ${HTTP_CODE})${NC}"
  echo -e "${YELLOW}🔍 에러 응답:${NC}"
  echo "$RESPONSE_BODY" | jq . 2>/dev/null || echo "$RESPONSE_BODY"
  echo ""

  # 알려진 에러 패턴 감지
  ERROR_MESSAGE=$(echo "$RESPONSE_BODY" | jq -r '.error.message // empty' 2>/dev/null)
  if [ -n "$ERROR_MESSAGE" ]; then
    echo -e "${RED}에러 메시지: ${ERROR_MESSAGE}${NC}"
  fi

  if [ "$HTTP_CODE" -eq 429 ]; then
    echo -e "${RED}🚨 API 할당량 초과 (Rate Limit)${NC}"
  elif [ "$HTTP_CODE" -eq 503 ]; then
    echo -e "${RED}🚨 서비스 일시 불가 (Service Unavailable)${NC}"
  elif [ "$HTTP_CODE" -eq 400 ]; then
    echo -e "${RED}🚨 잘못된 요청 (Bad Request) - 프롬프트 확인 필요${NC}"
  fi
  exit 1
fi

# 응답에서 텍스트 추출
CONTENT=$(echo "$RESPONSE_BODY" | jq -r '.candidates[0].content.parts[0].text // empty')

if [ -z "$CONTENT" ]; then
  echo -e "${RED}❌ API 응답에서 콘텐츠 추출 실패${NC}"
  echo -e "${YELLOW}🔍 응답 구조:${NC}"
  echo "$RESPONSE_BODY" | jq '.candidates[0]' 2>/dev/null || echo "$RESPONSE_BODY"

  # finish_reason 확인
  FINISH_REASON=$(echo "$RESPONSE_BODY" | jq -r '.candidates[0].finishReason // empty' 2>/dev/null)
  if [ -n "$FINISH_REASON" ]; then
    echo -e "${YELLOW}finishReason: ${FINISH_REASON}${NC}"
  fi
  exit 1
fi

echo -e "${GREEN}✅ 콘텐츠 생성 완료 (${#CONTENT} 문자)${NC}"
echo ""

# 6. 마크다운 정리
echo -e "${YELLOW}🔍 원본 콘텐츠 (처음 10줄):${NC}"
echo "$CONTENT" | head -10
echo ""

CLEANED_CONTENT=$(echo "$CONTENT" | sed -e '/^```markdown$/d' -e '/^```$/d')
echo -e "${YELLOW}🔍 코드 블록 제거 후 (처음 10줄):${NC}"
echo "$CLEANED_CONTENT" | head -10
echo ""

CLEANED_CONTENT=$(echo "$CLEANED_CONTENT" | awk '/^[[:space:]]*---/{flag=1} flag')

if [ -z "$CLEANED_CONTENT" ]; then
  echo -e "${RED}❌ 정리된 콘텐츠 없음${NC}"
  echo -e "${YELLOW}🔍 디버깅 정보:${NC}"
  echo "  - 원본 콘텐츠 길이: ${#CONTENT} 문자"
  echo "  - 코드 블록 제거 후 길이: $(echo "$CONTENT" | sed -e '/^```markdown$/d' -e '/^```$/d' | wc -c) 문자"
  echo ""
  echo -e "${YELLOW}🔍 원본 콘텐츠 전체:${NC}"
  echo "=========================================="
  echo "$CONTENT"
  echo "=========================================="
  echo ""
  echo -e "${RED}❓ 가능한 원인:${NC}"
  echo "  1. Gemini가 frontmatter(---로 시작)를 포함하지 않음"
  echo "  2. 콘텐츠 형식이 예상과 다름"
  echo "  3. awk 패턴 매칭 실패"
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
PARSE_OUTPUT=$(pnpm run parse "${SLUG}.md" 2>&1)
PARSE_EXIT_CODE=$?

if [ $PARSE_EXIT_CODE -eq 0 ]; then
  echo -e "${GREEN}✅ 파싱 및 Supabase 업로드 완료${NC}"
else
  echo -e "${RED}❌ 파싱 실패 (exit code: $PARSE_EXIT_CODE)${NC}"
  echo -e "${YELLOW}🔍 파싱 에러 로그:${NC}"
  echo "=========================================="
  echo "$PARSE_OUTPUT"
  echo "=========================================="
  echo ""
  echo -e "${YELLOW}⚠️  생성된 파일은 유지: $OUTPUT_FILE${NC}"
  echo -e "${YELLOW}💡 파일을 확인하고 수동으로 파싱을 재시도하세요${NC}"
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
echo -e "${GREEN}=== 콘텐츠 생성 성공 (REST API) ===${NC}"
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
