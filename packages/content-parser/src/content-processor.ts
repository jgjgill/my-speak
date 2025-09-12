import { pipe } from "@fxts/core";
import {
	parseForeignScripts,
	updateChunkedText,
} from "./parsers/foreign-script-parser.js";
import { parseFrontmatter } from "./parsers/frontmatter-parser.js";
import { parseKeywordSpeeches } from "./parsers/keyword-speech-parser.js";
import { parseKoreanScripts } from "./parsers/korean-script-parser.js";
import { findSection, parseSections } from "./parsers/section-parser.js";
import { uploadToSupabase } from "./services/database-service.js";
import { readFile, saveToJsonFile } from "./services/file-service.js";
import type { ParsedContent } from "./types/content-types.js";

/**
 * 마크다운 콘텐츠를 파싱하여 구조화된 데이터로 변환합니다.
 */
export function parseMarkdownContent(filePath: string): ParsedContent {
	const fileContent = readFile(filePath);

	return pipe(fileContent, (content) => {
		// 1. frontmatter 및 기본 정보 파싱
		const {
			content: bodyContent,
			topic,
			highlight_sentences,
		} = parseFrontmatter(content);

		// 2. 섹션별로 분리
		const sections = parseSections(bodyContent);

		// 3. 각 섹션 파싱
		const koreanSection = findSection(["1단계", "korean"])(sections);
		const foreignSection = findSection(["2단계"])(sections)?.lines.some(
			(line) => !line.includes("끊어읽기"),
		)
			? findSection(["2단계"])(sections)
			: undefined;
		const chunkedSection = findSection(["끊어읽기"])(sections);
		const keywordSection = findSection(["4단계", "키워드"])(sections);

		// 4. 한글 스크립트 및 학습 포인트 파싱
		let korean_scripts: ParsedContent["korean_scripts"] = [];
		let learning_points: ParsedContent["learning_points"] = [];

		if (koreanSection) {
			const koreanResult = parseKoreanScripts(koreanSection.lines);
			korean_scripts = koreanResult.korean_scripts;
			learning_points = koreanResult.learning_points;
		}

		// 5. 영어 스크립트 파싱
		let foreign_scripts: ParsedContent["foreign_scripts"] = [];

		if (foreignSection) {
			foreign_scripts = parseForeignScripts(foreignSection.lines);
		}

		// 6. 끊어읽기 텍스트 업데이트
		if (chunkedSection && foreign_scripts.length > 0) {
			updateChunkedText(chunkedSection.lines, foreign_scripts);
		}

		// 7. 키워드 스피치 파싱
		let keyword_speeches: ParsedContent["keyword_speeches"] = [];

		if (keywordSection) {
			keyword_speeches = parseKeywordSpeeches(keywordSection.lines);
		}

		// 8. topic의 total_sentences 업데이트
		const updatedTopic = {
			...topic,
			total_sentences: korean_scripts.length,
		};

		return {
			topic: updatedTopic,
			korean_scripts,
			foreign_scripts,
			keyword_speeches,
			learning_points,
			highlight_sentences,
		};
	});
}

/**
 * 마크다운 파일을 처리하여 JSON 저장 및 Supabase 업로드를 수행합니다.
 */
export async function processMarkdownFile(
	inputPath: string,
	outputJsonPath: string,
) {
	try {
		console.log(`📖 Processing: ${inputPath}`);

		const data = parseMarkdownContent(inputPath);
		saveToJsonFile(data, outputJsonPath);

		const result = await uploadToSupabase(data);
		console.log("✅ Process completed:", result);

		return result;
	} catch (error) {
		console.error("❌ Process failed:", error);
		throw error;
	}
}
