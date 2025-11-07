# TypeScript Config

모노레포 전체에서 공유하는 TypeScript 설정 패키지입니다.

## 포함된 설정

- **base.json** - 기본 TypeScript 설정
- **nextjs.json** - Next.js 프로젝트용 설정
- **react-library.json** - React 라이브러리용 설정

## 사용법

각 패키지의 `tsconfig.json`에서 확장하여 사용:

```json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    // 프로젝트별 추가 설정
  }
}
```

## Supabase 타입 자동 생성

Supabase 데이터베이스 스키마의 TypeScript 타입을 자동으로 생성합니다.

### 환경 변수 설정

루트 `.env` 파일에 다음 변수를 설정하세요:

```bash
SUPABASE_PROJECT_ID=your_project_id
SUPABASE_ACCESS_TOKEN=your_access_token
```

### 타입 생성 명령어

```bash
# 루트에서 실행
pnpm --filter=typescript-config update-types

# 또는 packages/typescript-config 디렉토리에서
pnpm update-types
```

생성된 타입은 `types/supabase.ts`에 저장됩니다.

## 사용 예시

### Web App (Next.js)

```json
{
  "extends": "@repo/typescript-config/nextjs.json"
}
```

### Content Parser

```json
{
  "extends": "@repo/typescript-config/base.json"
}
```
