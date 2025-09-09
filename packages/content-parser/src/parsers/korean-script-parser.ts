import { filter, pipe } from "@fxts/core";
import type {
	LearningPointMatch,
	ParsedContent,
} from "../types/content-types.js";

/**
 * 학습 포인트를 추출합니다 (**phrase**{translation} 형태)
 */
function extractLearningPoints(sentence: string): LearningPointMatch[] {
	const learningPointRegex = /\*\*(.*?)\*\*\{(.*?)\}/g;
	const matches: LearningPointMatch[] = [];

	const allMatches = Array.from(sentence.matchAll(learningPointRegex));

	for (const match of allMatches) {
		const koreanPhrase = match[1];
		const englishPhrase = match[2];

		if (koreanPhrase && englishPhrase) {
			matches.push({
				koreanPhrase,
				englishPhrase,
				fullMatch: match[0],
			});
		}
	}

	return matches;
}

/**
 * 학습 포인트 마크업을 제거하여 깔끔한 텍스트로 변환합니다.
 */
function cleanSentence(
	sentence: string,
	learningPoints: LearningPointMatch[],
): string {
	return pipe(learningPoints, (points) =>
		points.reduce(
			(cleanedSentence, point) =>
				cleanedSentence.replace(point.fullMatch, point.koreanPhrase),
			sentence,
		),
	);
}

/**
 * 한글 스크립트를 파싱합니다.
 */
export function parseKoreanScripts(lines: string[]): {
	korean_scripts: ParsedContent["korean_scripts"];
	learning_points: ParsedContent["learning_points"];
} {
	const sentences = pipe(
		lines,
		(lines) => lines.slice(1), // 제목 제외
		filter((line: string) => line.trim() && !line.startsWith("#")),
		filter(
			(line: string) => !line.includes("연습용") && !line.includes("미션"),
		),
	);

	const korean_scripts: ParsedContent["korean_scripts"] = [];
	const learning_points: ParsedContent["learning_points"] = [];

	const sentencesArray = Array.from(sentences);

	sentencesArray.forEach((sentence, index) => {
		if (sentence.trim()) {
			const sentenceOrder = index + 1;
			const learningPointMatches = extractLearningPoints(sentence);

			// 학습 포인트 추가
			learningPointMatches.forEach((match) => {
				learning_points.push({
					sentence_order: sentenceOrder,
					korean_phrase: match.koreanPhrase,
					english_phrase: match.englishPhrase,
				});
			});

			// 깔끔한 한글 텍스트 추가
			const cleanedSentence = cleanSentence(sentence, learningPointMatches);
			korean_scripts.push({
				sentence_order: sentenceOrder,
				korean_text: cleanedSentence.trim(),
			});
		}
	});

	return {
		korean_scripts,
		learning_points,
	};
}
