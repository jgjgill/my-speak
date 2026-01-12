import { readFile, writeFile } from "node:fs/promises";
import { parseExpressionBlanks } from "./parsers/expression-blank-parser";
import { parseExpressionDetails } from "./parsers/expression-detail-parser";
import { parseExpressionFrontmatter } from "./parsers/expression-frontmatter-parser";
import { parseExpressionScripts } from "./parsers/expression-script-parser";
import {
	type ParsedExpressionContent,
	uploadExpressionToSupabase,
} from "./services/expression-database-service";

/**
 * Expression 마크다운 파일을 처리합니다.
 */
export async function processExpressionMarkdownFile(
	inputPath: string,
	outputPath: string,
) {
	console.log(`📖 Reading file: ${inputPath}`);

	// 1. 파일 읽기
	const fileContent = await readFile(inputPath, "utf-8");

	// 2. Frontmatter 파싱
	const { frontmatter, content, expression } =
		parseExpressionFrontmatter(fileContent);
	console.log(`✅ Parsed frontmatter: ${expression.title}`);

	// 3. 영어/한글 스크립트 파싱
	const { englishScript, koreanTranslation } =
		parseExpressionScripts(content);
	console.log("✅ Parsed scripts (English & Korean)");

	// 4. 빈칸 파싱
	const blanks = parseExpressionBlanks(englishScript, expression.id!);
	console.log(`✅ Parsed ${blanks.length} blanks`);

	// 5. Expression Details 파싱
	const details = parseExpressionDetails(content, expression.id!, blanks);
	console.log(`✅ Parsed ${details.length} expression details`);

	// 6. Expression 객체 업데이트 (스크립트 추가)
	expression.english_script = englishScript;
	expression.korean_translation = koreanTranslation;
	expression.total_blanks = blanks.length;

	// 7. 결과 객체 생성
	const parsedData: ParsedExpressionContent = {
		expression,
		blanks,
		details,
	};

	// 8. JSON 파일 저장
	await writeFile(outputPath, JSON.stringify(parsedData, null, 2));
	console.log(`💾 JSON saved: ${outputPath}`);

	// 9. Supabase 업로드
	const uploadedExpression = await uploadExpressionToSupabase(parsedData);

	return uploadedExpression;
}
