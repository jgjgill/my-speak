# 콘텐츠 제작 워크플로우

# 1단계: MD 파일 작성 (콘텐츠 작성자 친화적)
content/source/beginner/cooking-hobby.md:
  - 자연스러운 마크다운 문법
  - 구조화된 헤딩과 섹션
  - 쉬운 편집과 검토

# 2단계: 자동 변환 (개발자 도구)
scripts/convert-content.ts:
  - MD 파일을 파싱
  - 구조화된 JSON으로 변환
  - 유효성 검사 및 오류 검출

# 3단계: JSON 검증 및 배포
content/json/:
  - 애플리케이션에서 사용할 JSON
  - 자동 생성되므로 수동 편집 금지
  - CI/CD에서 자동 검증

# 4단계: 데이터베이스 시드
supabase/seed.sql:
  - JSON 파일들을 DB에 삽입
  - 프로덕션 배포 시 자동 실행