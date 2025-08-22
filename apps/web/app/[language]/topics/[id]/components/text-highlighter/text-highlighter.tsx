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
	highlightClassName = "bg-orange-200 px-1 rounded",
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
