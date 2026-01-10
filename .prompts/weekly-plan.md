# 외국어 학습 주제 7개 생성

다음 규칙으로 **7개의 주제만** JSON 배열로 출력하세요:

1. **기존 주제 회피**: {{EXISTING_SLUGS_SUMMARY}}
2. **다양한 카테고리**: 회화, 여행, 비즈니스, 일상, 레저, 쇼핑, 의료, 금융
3. **slug 형식**: `주제-영문` (예: `coffee-shop-ordering`, `airport-checkin`)
4. **고유성**: 기존 slug와 중복되지 않도록 주의

**출력 형식** (다른 텍스트 없이 JSON만):
```json
[
  {"slug": "coffee-shop-ordering", "title": "한글 제목", "category": "회화"},
  {"slug": "airport-checkin", "title": "한글 제목", "category": "여행"}
]
```

즉시 7개 주제를 JSON 배열로 출력하세요.
