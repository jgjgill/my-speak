#!/bin/bash

# 외국어 학습 콘텐츠 주간 계획 생성 스크립트
# 사용법: ./generate-weekly-plan.sh

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 디렉토리 설정
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
INDEX_FILE="$PROJECT_ROOT/content/.content-index.json"
PROMPT_FILE="$PROJECT_ROOT/.prompts/weekly-plan.md"

echo -e "${BLUE}=== 주간 콘텐츠 계획 생성 ===${NC}"
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

# 2. 기존 slug 정보 수집
echo -e "${YELLOW}📋 기존 콘텐츠 분석 중...${NC}"
SLUG_COUNT=$(jq '.total_count' "$INDEX_FILE")
WEEK_NUM=$(date +%U)
YEAR_MONTH=$(date +%Y%m)

echo -e "${BLUE}기존 콘텐츠: ${SLUG_COUNT}개${NC}"
echo -e "${BLUE}주차: Week ${WEEK_NUM}${NC}"

# 카테고리별 개수 집계 (간단한 요약)
CATEGORY_SUMMARY=$(jq -r '
  .slugs |
  map(split("-")[0]) |
  group_by(.) |
  map("\(.[0]): \(length)개") |
  join(", ")
' "$INDEX_FILE")

echo -e "${BLUE}카테고리: ${CATEGORY_SUMMARY}${NC}"
echo ""

# 3. 프롬프트 생성
TEMP_PROMPT=$(mktemp)
sed "s|{{EXISTING_SLUGS_SUMMARY}}|${SLUG_COUNT}개 생성됨 (${CATEGORY_SUMMARY})|g" \
  "$PROMPT_FILE" > "$TEMP_PROMPT"

# YYYYMM 형식 치환 (크로스 플랫폼 호환)
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' "s/YYYYMM/${YEAR_MONTH}/g" "$TEMP_PROMPT"
else
  sed -i "s/YYYYMM/${YEAR_MONTH}/g" "$TEMP_PROMPT"
fi

# 4. Gemini로 주간 계획 생성
echo -e "${YELLOW}🤖 Gemini로 7개 주제 생성 중...${NC}"
RESPONSE=$(cat "$TEMP_PROMPT" | gemini --model gemini-2.-flash-lite --yolo 2>&1)
EXIT_CODE=$?
rm -f "$TEMP_PROMPT"

if [ $EXIT_CODE -ne 0 ]; then
  echo -e "${RED}❌ Gemini 실행 실패 (exit code: $EXIT_CODE)${NC}"
  echo -e "${RED}출력:${NC}"
  echo "$RESPONSE"
  exit 1
fi

if [ -z "$RESPONSE" ]; then
  echo -e "${RED}❌ 생성된 응답 없음${NC}"
  exit 1
fi

# 5. JSON 정리 (코드 블록 및 STARTUP 로그 제거)
CLEANED_RESPONSE=$(echo "$RESPONSE" | sed -e '/^```json$/d' -e '/^```$/d' -e '/^\[STARTUP\]/d')

# JSON 배열 추출 (첫 [ 부터 마지막 ] 까지)
JSON_ARRAY=$(echo "$CLEANED_RESPONSE" | awk '/^\[/,/^\]/')

if [ -z "$JSON_ARRAY" ]; then
  echo -e "${RED}❌ JSON 배열을 찾을 수 없습니다${NC}"
  echo -e "${RED}응답:${NC}"
  echo "$RESPONSE"
  exit 1
fi

# 6. JSON 유효성 검사
if ! echo "$JSON_ARRAY" | jq empty 2>/dev/null; then
  echo -e "${RED}❌ 유효하지 않은 JSON${NC}"
  echo "$JSON_ARRAY"
  exit 1
fi

# 7개 항목 확인
ITEM_COUNT=$(echo "$JSON_ARRAY" | jq 'length')
if [ "$ITEM_COUNT" -ne 7 ]; then
  echo -e "${YELLOW}⚠️  7개가 아닌 ${ITEM_COUNT}개 생성됨${NC}"
fi

echo -e "${GREEN}✅ ${ITEM_COUNT}개 주제 생성 완료${NC}"
echo ""

# 6. weekly_plan 구조 생성
WEEKLY_PLAN=$(echo "$JSON_ARRAY" | jq \
  --arg week "$WEEK_NUM" \
  --arg generated "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" \
  '{
    generated_at: $generated,
    week_number: ($week | tonumber),
    planned_slugs: map(. + {used: false})
  }')

# 7. content-index.json 업데이트
jq --argjson plan "$WEEKLY_PLAN" \
  '.weekly_plan = $plan' \
  "$INDEX_FILE" > "${INDEX_FILE}.tmp"

mv "${INDEX_FILE}.tmp" "$INDEX_FILE"

echo -e "${GREEN}✅ 인덱스 파일 업데이트 완료${NC}"
echo ""

# 8. 생성된 주제 미리보기
echo -e "${BLUE}=== 생성된 7개 주제 ===${NC}"
jq -r '.weekly_plan.planned_slugs[] | "- \(.title) (\(.slug))"' "$INDEX_FILE"
echo ""

echo -e "${GREEN}=== 주간 계획 생성 완료 ===${NC}"
echo "주차: Week $WEEK_NUM"
echo "파일: $INDEX_FILE"
echo ""

# GitHub Actions output 저장
if [ -n "$GITHUB_OUTPUT" ]; then
  echo "week_number=$WEEK_NUM" >> "$GITHUB_OUTPUT"
  echo "plan_count=$ITEM_COUNT" >> "$GITHUB_OUTPUT"
fi
