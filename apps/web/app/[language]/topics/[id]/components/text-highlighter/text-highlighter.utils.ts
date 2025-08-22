import { fx } from "@fxts/core";

export interface TextSegment {
	text: string;
	isKeyword: boolean;
}

export interface TextHighlighterProps {
	text: string;
	keywords: string[];
	highlightClassName?: string;
}

/**
 * @description 키워드 배열을 길이순으로 정렬하여 긴 키워드를 우선 매칭
 */
export const sortKeywordsByLength = (keywords: string[]): string[] =>
	keywords.sort((a, b) => b.length - a.length);

/**
 * @description 텍스트에서 키워드 매칭 위치를 찾는 함수
 */
export const findKeywordMatches = (
	text: string,
	keywords: string[],
): Array<{ start: number; end: number; keyword: string }> => {
	const sortedKeywords = sortKeywordsByLength(keywords);
	const matches: Array<{ start: number; end: number; keyword: string }> = [];

	let currentIndex = 0;
	while (currentIndex < text.length) {
		let foundMatch = false;

		for (const keyword of sortedKeywords) {
			const remainingText = text.slice(currentIndex);
			if (remainingText.startsWith(keyword)) {
				matches.push({
					start: currentIndex,
					end: currentIndex + keyword.length,
					keyword,
				});
				currentIndex += keyword.length;
				foundMatch = true;
				break;
			}
		}

		if (!foundMatch) {
			currentIndex++;
		}
	}

	return matches;
};

/**
 * @description 매칭 위치 정보를 바탕으로 텍스트 세그먼트 배열 생성
 */
export const createSegmentsFromMatches = (
	text: string,
	matches: Array<{ start: number; end: number; keyword: string }>,
): TextSegment[] => {
	if (matches.length === 0) {
		return [{ text, isKeyword: false }];
	}

	const segments: TextSegment[] = [];
	let lastEnd = 0;

	for (const match of matches) {
		// 이전 매치와 현재 매치 사이의 일반 텍스트
		if (match.start > lastEnd) {
			const normalText = text.slice(lastEnd, match.start);
			segments.push({ text: normalText, isKeyword: false });
		}

		// 키워드 텍스트
		segments.push({ text: match.keyword, isKeyword: true });
		lastEnd = match.end;
	}

	// 마지막 매치 이후 남은 텍스트
	if (lastEnd < text.length) {
		const remainingText = text.slice(lastEnd);
		segments.push({ text: remainingText, isKeyword: false });
	}

	return fx(segments)
		.filter((segment) => segment.text.length > 0)
		.toArray();
};

/**
 * @description 주어진 텍스트에서 키워드들을 찾아 텍스트 세그먼트 배열로 분할. 긴 키워드를 우선하여 매칭하고, 완벽 일치만 강조
 */
export const parseTextWithKeywords = (
	text: string,
	keywords: string[],
): TextSegment[] => {
	if (!text) {
		return [{ text: "", isKeyword: false }];
	}

	const sortedKeywords = sortKeywordsByLength(keywords);
	if (sortedKeywords.length === 0) {
		return [{ text, isKeyword: false }];
	}

	const matches = findKeywordMatches(text, sortedKeywords);
	return createSegmentsFromMatches(text, matches);
};
