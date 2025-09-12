import { filter, pipe } from "@fxts/core";
import type { ParsedContent } from "../types/content-types";

/**
 * 영어 스크립트를 파싱합니다.
 */
export function parseForeignScripts(
	lines: string[],
): ParsedContent["foreign_scripts"] {
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
			foreign_text: sentence.trim(),
			chunked_text: sentence.trim(), // 기본값으로 동일하게 설정
		}));
}

/**
 * 끊어읽기 텍스트를 기존 영어 스크립트에 업데이트합니다.
 */
export function updateChunkedText(
	lines: string[],
	foreign_scripts: ParsedContent["foreign_scripts"],
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
			if (foreign_scripts[index]) {
				foreign_scripts[index].chunked_text = sentence.trim();
			}
		});
}
