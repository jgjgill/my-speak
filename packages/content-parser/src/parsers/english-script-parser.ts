import { filter, pipe } from "@fxts/core";
import type { ParsedContent } from "../types/content-types.js";

/**
 * 영어 스크립트를 파싱합니다.
 */
export function parseEnglishScripts(
	lines: string[],
): ParsedContent["english_scripts"] {
	const sentences = pipe(
		lines,
		(lines) => lines.slice(1), // 제목 제외
		filter(
			(line: string) =>
				line.trim() && !line.startsWith("#") && !line.startsWith("**"),
		),
	);

	const sentencesArray = Array.from(sentences);

	return sentencesArray
		.filter((sentence) => sentence.trim())
		.map((sentence, index) => ({
			sentence_order: index + 1,
			english_text: sentence.trim(),
			chunked_text: sentence.trim(), // 기본값으로 동일하게 설정
		}));
}

/**
 * 끊어읽기 텍스트를 기존 영어 스크립트에 업데이트합니다.
 */
export function updateChunkedText(
	lines: string[],
	english_scripts: ParsedContent["english_scripts"],
): void {
	const sentences = pipe(
		lines,
		(lines) => lines.slice(1), // 제목 제외
		filter(
			(line: string) =>
				line.trim() && !line.startsWith("#") && !line.startsWith("**"),
		),
	);

	const sentencesArray = Array.from(sentences);

	sentencesArray
		.filter((sentence) => sentence.trim())
		.forEach((sentence, index) => {
			if (english_scripts[index]) {
				english_scripts[index].chunked_text = sentence.trim();
			}
		});
}
