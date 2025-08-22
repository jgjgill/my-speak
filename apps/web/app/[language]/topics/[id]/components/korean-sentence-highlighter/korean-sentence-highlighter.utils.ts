import { fx } from "@fxts/core";
import type { Tables } from "@repo/typescript-config/supabase-types";

type LearningPoint = Tables<"learning_points">;

export interface TextSegment {
	text: string;
	isKeyword: boolean;
	learningPoint?: LearningPoint;
	isSelected: boolean;
}

/**
 * @description 학습 포인트 배열에서 한국어 키워드들을 추출하는 함수
 */

export const getLearningPointKeywords = (
	learningPoints: LearningPoint[],
): string[] => {
	return fx(learningPoints)
		.map((point) => point.korean_phrase)
		.filter((phrase) => phrase !== null && phrase !== undefined)
		.toArray();
};

/**
 * @description 주어진 텍스트에 해당하는 학습 포인트 정보를 조회하는 함수
 */

export const getLearningPointInfo = (
	text: string,
	learningPoints: LearningPoint[],
): LearningPoint => {
	const learningPoint = fx(learningPoints).find(
		(point) => point.korean_phrase === text,
	);

	if (!learningPoint) {
		throw new Error(`Learning point not found for text: "${text}"`);
	}

	return learningPoint;
};

/**
 * @description 특정 학습 포인트가 선택된 상태인지 확인하는 함수
 */

export const isSelectedLearningPoint = (
	pointInfo: LearningPoint,
	sentenceOrder: number,
	selectedPoints: Set<string>,
): boolean => {
	const pointKey = `${sentenceOrder}-${pointInfo.id}`;
	return selectedPoints.has(pointKey);
};

/**
 * @description 텍스트 세그먼트 객체를 생성하는 팩토리 함수
 */

export const createTextSegment = (
	text: string,
	isKeyword: boolean,
	learningPoint?: LearningPoint,
	isSelected = false,
): TextSegment => {
	return {
		text,
		isKeyword,
		learningPoint,
		isSelected: isSelected ?? false,
	};
};

/**
 * @description 특정 위치에서 시작하는 키워드를 찾는 함수 (가장 긴 키워드 우선)
 */

export const findKeywordAtPosition = (
	text: string,
	position: number,
	keywords: string[],
): string | undefined => {
	const filteredKeywords = fx(keywords)
		.filter((keyword) => text.substring(position).startsWith(keyword))
		.toArray();

	return filteredKeywords.sort((a, b) => b.length - a.length)[0];
};

/**
 * @description 텍스트를 키워드와 일반 텍스트로 분리하여 세그먼트 배열을 생성하는 함수
 */

export const parseTextSegments = (
	text: string,
	sentenceOrder: number,
	learningPoints: LearningPoint[],
	selectedPoints: Set<string>,
): TextSegment[] => {
	const keywords = getLearningPointKeywords(learningPoints);

	if (keywords.length === 0) {
		return [createTextSegment(text, false)];
	}

	const segments: TextSegment[] = [];
	const processedKeywords = new Set<string>();
	let currentIndex = 0;

	while (currentIndex < text.length) {
		const foundKeyword = findKeywordAtPosition(text, currentIndex, keywords);

		if (foundKeyword && !processedKeywords.has(foundKeyword)) {
			const learningPoint = getLearningPointInfo(foundKeyword, learningPoints);
			const isSelected = isSelectedLearningPoint(
				learningPoint,
				sentenceOrder,
				selectedPoints,
			);

			segments.push(
				createTextSegment(foundKeyword, true, learningPoint, isSelected),
			);
			processedKeywords.add(foundKeyword);
			currentIndex += foundKeyword.length;
		} else {
			const nextChar = text[currentIndex];
			if (nextChar) {
				const lastSegment = segments[segments.length - 1];

				if (lastSegment && !lastSegment.isKeyword) {
					lastSegment.text += nextChar;
				} else {
					segments.push(createTextSegment(nextChar, false));
				}
			}
			currentIndex += 1;
		}
	}

	return segments;
};
