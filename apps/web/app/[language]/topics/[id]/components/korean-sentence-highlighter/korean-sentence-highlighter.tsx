"use client";

import type { Tables } from "@repo/typescript-config/supabase-types";
import {
	parseTextSegments,
	type TextSegment,
} from "./korean-sentence-highlighter.utils";

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
	const segments = parseTextSegments(
		koreanText,
		sentenceOrder,
		learningPoints,
		selectedPoints,
	);

	const handleKeywordClick = (segment: TextSegment) => {
		if (segment.isKeyword) {
			onLearningPointClick(sentenceOrder, segment.text);
		}
	};

	const highlightVariants = {
		default: "bg-gray-100 text-gray-700 border border-gray-200",
		selected: "bg-amber-100 text-amber-800 border border-amber-300",
	};

	return (
		<div className="text-lg leading-relaxed">
			{segments.map((segment, index) => {
				if (segment.isKeyword) {
					const highlightClass = segment.isSelected
						? highlightVariants.selected
						: highlightVariants.default;

					const keywordKey = segment.learningPoint
						? `keyword-${segment.learningPoint.id}-${index}`
						: `keyword-${index}`;

					return (
						<button
							key={keywordKey}
							type="button"
							className={`${highlightClass} px-1 rounded cursor-pointer hover:bg-gray-200 transition-colors inline font-inherit`}
							onClick={() => handleKeywordClick(segment)}
						>
							{segment.text}
						</button>
					);
				}

				const textKey = `text-${sentenceOrder}-${index}-${segment.text.slice(0, 10)}`;
				return <span key={textKey}>{segment.text}</span>;
			})}
		</div>
	);
}
