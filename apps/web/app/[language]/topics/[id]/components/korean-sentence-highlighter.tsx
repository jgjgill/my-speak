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
		default: "bg-yellow-200",
		selected: "bg-orange-200",
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
							className={`${highlightClass} px-1 rounded cursor-pointer hover:bg-yellow-300 transition-colors inline font-inherit text-inherit border-none`}
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
