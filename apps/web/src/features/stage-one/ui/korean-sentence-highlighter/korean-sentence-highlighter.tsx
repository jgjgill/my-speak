"use client";

import type { Tables } from "@repo/typescript-config/supabase-types";
import { useIsMounted } from "@/shared/lib";
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
	isLoading: boolean;
}

export default function KoreanSentenceHighlighter({
	sentenceOrder,
	koreanText,
	learningPoints,
	selectedPoints,
	onLearningPointClick,
	isLoading,
}: KoreanSentenceHighlighterProps) {
	const isMounted = useIsMounted();

	const segments = parseTextSegments(
		koreanText,
		sentenceOrder,
		learningPoints,
		selectedPoints,
	);

	const handleKeywordClick = (segment: TextSegment) => {
		if (segment.isKeyword && !isLoading) {
			onLearningPointClick(sentenceOrder, segment.text);
		}
	};

	const highlightVariants = {
		default:
			"bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 active:bg-gray-300",
		selected:
			"bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200 active:bg-amber-300",
		loading:
			"bg-gray-100 text-gray-400 border border-gray-200 cursor-wait opacity-60",
	};

	return (
		<div className="text-lg leading-relaxed">
			{segments.map((segment, index) => {
				if (segment.isKeyword) {
					const highlightClass = isMounted
						? isLoading
							? highlightVariants.loading
							: segment.isSelected
								? highlightVariants.selected
								: highlightVariants.default
						: highlightVariants.default;

					const keywordKey = segment.learningPoint
						? `keyword-${segment.learningPoint.id}-${index}`
						: `keyword-${index}`;

					return (
						<button
							key={keywordKey}
							type="button"
							className={`${highlightClass} px-1 rounded transition-all duration-200 ease-out ${isLoading ? "" : "cursor-pointer active:scale-95 active:opacity-70"} inline font-inherit`}
							onClick={() => handleKeywordClick(segment)}
							disabled={isLoading}
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
