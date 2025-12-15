#!/bin/bash

# 외국어 학습 콘텐츠 자동 생성 스크립트 (인덱스 기반)
# 사용법: ./create-content.sh [language] [difficulty]

set -e

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
PROMPT_FILE="$PROJECT_ROOT/.prompts/content-generation-v2.md"

# 매개변수
LANGUAGE="${1:-en}"
DIFFICULTY="${2:-초급}"
MAX_RETRIES=3

echo -e "${BLUE}=== 콘텐츠 자동 생성 ===${NC}"
echo "언어: $LANGUAGE"
echo "난이도: $DIFFICULTY"
echo ""

# 1. 환경 검증
if [ ! -f "$PROMPT_FILE" ]; then
  echo -e "${RED}❌ 프롬프트 파일 없음: $PROMPT_FILE${NC}"
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

# 2. 인덱스 파일 읽기
echo -e "${YELLOW}📋 인덱스 파일 로드 중...${NC}"
if [ ! -f "$INDEX_FILE" ]; then
  echo -e "${RED}❌ 인덱스 파일 없음: $INDEX_FILE${NC}"
  echo -e "${YELLOW}💡 먼저 인덱스를 초기화해야 합니다.${NC}"
  exit 1
fi

# slugs 배열을 쉼표로 연결된 문자열로 변환 (Python 사용)
EXISTING_SLUGS=$(python3 -c "
import json
with open('$INDEX_FILE', 'r') as f:
    data = json.load(f)
    print(', '.join(data['slugs']))
" 2>/dev/null || echo "")

if [ -z "$EXISTING_SLUGS" ]; then
  echo -e "${YELLOW}⚠️  기존 콘텐츠 없음 (첫 생성)${NC}"
  SLUG_COUNT=0
else
  SLUG_COUNT=$(python3 -c "
import json
with open('$INDEX_FILE', 'r') as f:
    print(json.load(f)['total_count'])
")
  echo -e "${BLUE}기존 콘텐츠: ${SLUG_COUNT}개${NC}"
fi

# 3. 재시도 루프 (중복 시 다른 주제로 재생성)
RETRY_COUNT=0
SUCCESS=false

while [ $RETRY_COUNT -lt $MAX_RETRIES ] && [ "$SUCCESS" = false ]; do
  if [ $RETRY_COUNT -gt 0 ]; then
    echo -e "${YELLOW}🔄 재시도 $RETRY_COUNT/$MAX_RETRIES${NC}"
  fi

  # UUID 생성
  UUID=$(node -e "console.log(require('crypto').randomUUID())")
  UUID_LAST_CHAR="${UUID: -1}"
  echo -e "${BLUE}생성 UUID: $UUID${NC}"

  # 프롬프트 생성 (파라미터 주입)
  TEMP_PROMPT=$(mktemp)
  cat "$PROMPT_FILE" > "$TEMP_PROMPT"

  cat >> "$TEMP_PROMPT" <<EOF

---

## 🎯 실행 파라미터

- **UUID**: $UUID
- **UUID 마지막 문자**: $UUID_LAST_CHAR (문장 수 결정용)
- **언어 코드**: $LANGUAGE
- **난이도**: $DIFFICULTY

**중요**: 위 파라미터를 frontmatter에 정확히 반영하세요.

---

## 🚫 사용 금지 slug 목록

다음 slug들은 이미 사용 중이므로 **절대 사용하지 마세요**:

$EXISTING_SLUGS

**필수**: 완전히 다른 주제로 고유한 slug를 생성하세요.

---

**지금 즉시 완전한 마크다운 콘텐츠를 생성하세요. 추가 질문 없이 즉시 생성해주세요.**
EOF

  # Gemini로 콘텐츠 생성
  echo -e "${YELLOW}🤖 Gemini로 콘텐츠 생성 중...${NC}"
  GENERATED_CONTENT=$(cat "$TEMP_PROMPT" | gemini --yolo 2>&1)
  EXIT_CODE=$?
  rm -f "$TEMP_PROMPT"

  if [ $EXIT_CODE -ne 0 ]; then
    echo -e "${RED}❌ Gemini 실행 실패${NC}"
    echo "$GENERATED_CONTENT"
    RETRY_COUNT=$((RETRY_COUNT + 1))
    continue
  fi

  if [ -z "$GENERATED_CONTENT" ]; then
    echo -e "${RED}❌ 생성된 콘텐츠 없음${NC}"
    RETRY_COUNT=$((RETRY_COUNT + 1))
    continue
  fi

  # 마크다운 정리
  CLEANED_CONTENT=$(echo "$GENERATED_CONTENT" | sed -e '/^```markdown$/d' -e '/^```$/d')
  CLEANED_CONTENT=$(echo "$CLEANED_CONTENT" | awk '/^[[:space:]]*---/{flag=1} flag')

  if [ -z "$CLEANED_CONTENT" ]; then
    echo -e "${RED}❌ 정리된 콘텐츠 없음${NC}"
    RETRY_COUNT=$((RETRY_COUNT + 1))
    continue
  fi

  # slug 추출
  SLUG=$(echo "$CLEANED_CONTENT" | awk '/^slug:/ {gsub(/^slug:[[:space:]]*"|"[[:space:]]*$/, ""); print; exit}' | xargs)

  if [ -z "$SLUG" ] || ! [[ "$SLUG" =~ ^[a-z0-9-]+$ ]]; then
    echo -e "${YELLOW}⚠️  유효하지 않은 slug: $SLUG${NC}"
    RETRY_COUNT=$((RETRY_COUNT + 1))
    continue
  fi

  # 중복 체크 (인덱스 기반)
  if echo "$EXISTING_SLUGS" | grep -qw "$SLUG"; then
    echo -e "${YELLOW}⚠️  중복 slug 감지: $SLUG${NC}"
    echo -e "${YELLOW}   다른 주제로 재생성합니다...${NC}"
    RETRY_COUNT=$((RETRY_COUNT + 1))
    continue
  fi

  # 파일 중복 체크 (이중 안전장치)
  FILENAME="${SLUG}.md"
  OUTPUT_FILE="$CONTENT_DIR/$FILENAME"
  if [ -f "$OUTPUT_FILE" ]; then
    echo -e "${YELLOW}⚠️  파일 이미 존재: $FILENAME${NC}"
    RETRY_COUNT=$((RETRY_COUNT + 1))
    continue
  fi

  # 성공: 파일 저장
  mkdir -p "$CONTENT_DIR"
  echo "$CLEANED_CONTENT" > "$OUTPUT_FILE"
  echo -e "${GREEN}✅ Slug 추출: $SLUG${NC}"
  echo -e "${GREEN}✅ 파일 저장: $OUTPUT_FILE${NC}"
  SUCCESS=true
done

# 재시도 실패 시 종료
if [ "$SUCCESS" = false ]; then
  echo -e "${RED}❌ $MAX_RETRIES번 시도 후에도 고유한 콘텐츠 생성 실패${NC}"
  exit 1
fi

# frontmatter 검증
echo -e "${BLUE}=== Frontmatter 확인 ===${NC}"
head -20 "$OUTPUT_FILE"
echo -e "${BLUE}========================${NC}"
echo ""

# content-parser 실행
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
if pnpm run parse "$FILENAME" 2>&1; then
  echo -e "${GREEN}✅ 파싱 및 Supabase 업로드 완료${NC}"
else
  echo -e "${RED}❌ 파싱 실패${NC}"
  echo -e "${YELLOW}⚠️  생성된 파일은 유지: $OUTPUT_FILE${NC}"
  exit 1
fi

# 인덱스 업데이트
echo -e "${YELLOW}📝 인덱스 업데이트 중...${NC}"
cd "$PROJECT_ROOT"

python3 <<EOF
import json
with open('$INDEX_FILE', 'r') as f:
    data = json.load(f)

data['slugs'].append('$SLUG')
data['total_count'] = len(data['slugs'])
data['generated_at'] = '$(date -u +"%Y-%m-%dT%H:%M:%SZ")'

with open('$INDEX_FILE', 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
EOF

echo -e "${GREEN}✅ 인덱스 업데이트 완료${NC}"

# 완료
echo ""
echo -e "${GREEN}=== 콘텐츠 생성 성공 ===${NC}"
echo "파일: $OUTPUT_FILE"
echo "Slug: $SLUG"
echo "언어: $LANGUAGE"
echo "난이도: $DIFFICULTY"
echo ""

# GitHub Actions output 저장
if [ -n "$GITHUB_OUTPUT" ]; then
  echo "filename=$FILENAME" >> "$GITHUB_OUTPUT"
  echo "filepath=$OUTPUT_FILE" >> "$GITHUB_OUTPUT"
  echo "slug=$SLUG" >> "$GITHUB_OUTPUT"
fi
