import {
	parseTextWithKeywords,
	type TextHighlighterProps,
} from "./text-highlighter.utils";

/**
 * @description 텍스트에서 키워드를 강조하여 렌더링하는 컴포넌트
 */
export default function TextHighlighter({
	text,
	keywords,
	highlightClassName = "bg-amber-100 text-amber-800 px-1 rounded border border-amber-300",
}: TextHighlighterProps) {
	const segments = parseTextWithKeywords(text, keywords);

	return (
		<span>
			{segments.map((segment, index) => (
				<span
					key={`${index}-${segment.isKeyword}-${segment.text.slice(0, 10)}`}
					className={segment.isKeyword ? highlightClassName : undefined}
				>
					{segment.text}
				</span>
			))}
		</span>
	);
}
