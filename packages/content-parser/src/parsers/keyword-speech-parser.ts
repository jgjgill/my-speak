import { pipe } from "@fxts/core";
import type {
	KeywordSpeechLevel,
	ParsedContent,
} from "src/types/content-types";

/**
 * 레벨 정보를 매핑하는 함수
 */
function getLevelInfo(levelHeader: string): KeywordSpeechLevel {
	if (levelHeader.includes("레벨 1") || levelHeader.includes("70%")) {
		return { level: 1, difficultyPercentage: 70 };
	}
	if (levelHeader.includes("레벨 2") || levelHeader.includes("50%")) {
		return { level: 2, difficultyPercentage: 50 };
	}
	if (levelHeader.includes("레벨 3") || levelHeader.includes("30%")) {
		return { level: 3, difficultyPercentage: 30 };
	}
	if (levelHeader.includes("레벨 4") || levelHeader.includes("영어")) {
		return { level: 4, difficultyPercentage: 0 };
	}
	return { level: 1, difficultyPercentage: 70 }; // 기본값
}

/**
 * 키워드 스피치 라인을 파싱합니다.
 */
function parseKeywordLine(
	line: string,
	levelInfo: KeywordSpeechLevel,
	sequenceOrder: number,
): ParsedContent["keyword_speeches"][0] | null {
	if (!line.includes("→")) return null;

	const [keywordPart = "", targetSentence = ""] = line
		.split("→")
		.map((s) => s.trim());

	const keywords = pipe(keywordPart.split(","), (parts: string[]) =>
		parts.map((k) => k.trim()),
	);

	return {
		stage: 4,
		level: levelInfo.level,
		sequence_order: sequenceOrder,
		keywords,
		target_sentence: targetSentence,
		difficulty_percentage: levelInfo.difficultyPercentage,
	};
}

/**
 * 키워드 스피치를 파싱합니다.
 */
export function parseKeywordSpeeches(
	lines: string[],
): ParsedContent["keyword_speeches"] {
	const keyword_speeches: ParsedContent["keyword_speeches"] = [];
	let currentLevelInfo: KeywordSpeechLevel = {
		level: 1,
		difficultyPercentage: 70,
	};
	let sequenceOrder = 1;

	const processableLines = pipe(
		lines,
		(lines) => lines.slice(1), // 제목 제외
	);

	processableLines.forEach((line) => {
		const trimmedLine = line.trim();

		// 레벨 헤더 감지 및 업데이트
		if (trimmedLine.startsWith("## 레벨")) {
			currentLevelInfo = getLevelInfo(trimmedLine);
			return;
		}

		// 키워드 스피치 라인 처리
		const parsedKeyword = parseKeywordLine(
			trimmedLine,
			currentLevelInfo,
			sequenceOrder,
		);
		if (parsedKeyword) {
			keyword_speeches.push(parsedKeyword);
			sequenceOrder++;
		}
	});

	return keyword_speeches;
}
