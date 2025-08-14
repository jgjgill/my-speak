"use client";

import type { Tables } from "@repo/typescript-config/supabase-types";
import Highlighter from "react-highlight-words";

type LearningPoint = Tables<"learning_points">;

interface KoreanSentenceHighlighterProps {
	sentenceOrder: number;
	koreanText: string;
	learningPoints: LearningPoint[];
	selectedPoints: Set<string>;
	onLearningPointClick: (sentenceOrder: number, text: string) => void;
}

export default function KoreanSentenceHighlighter({
	sentenceOrder,
	koreanText,
	learningPoints,
	selectedPoints,
	onLearningPointClick,
}: KoreanSentenceHighlighterProps) {
	const getLearningPointKeywords = () => {
		return learningPoints
			.map((point) => point.korean_phrase)
			.filter((phrase) => phrase !== null && phrase !== undefined) as string[];
	};

	const getLearningPointInfo = (highlightedText: string) => {
		return learningPoints.find(
			(point) => point.korean_phrase === highlightedText,
		);
	};

	const isSelectedLearningPoint = (text: string) => {
		const pointInfo = getLearningPointInfo(text);
		if (!pointInfo) return false;
		const pointKey = `${sentenceOrder}-${pointInfo.id}`;
		return selectedPoints.has(pointKey);
	};

	const keywords = getLearningPointKeywords();
	const isSelectedHighlight = keywords.some((keyword) =>
		isSelectedLearningPoint(keyword),
	);

	const highlightVariants = {
		default: "bg-yellow-200",
		selected: "bg-orange-200",
	};

	return (
		<div className="text-lg leading-relaxed">
			<Highlighter
				searchWords={keywords}
				textToHighlight={koreanText}
				highlightClassName={`${highlightVariants[isSelectedHighlight ? "selected" : "default"]} px-1 rounded cursor-pointer hover:bg-yellow-300 transition-colors`}
				highlightTag="mark"
				onClick={(e: React.MouseEvent<HTMLElement>) => {
					const target = e.target as HTMLElement;

					if (!target.textContent) {
						throw new Error("구문 강조 과정에서 에러 발생");
					}

					onLearningPointClick(sentenceOrder, target.textContent);
				}}
			/>
		</div>
	);
}
