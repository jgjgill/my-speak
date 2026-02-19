import type { ExpressionBlank } from "@/entities/expression/api/expression-queries";

type TextSegment = { type: "text"; value: string };
type BlankSegment = { type: "blank"; blank: ExpressionBlank };
export type ScriptSegment = TextSegment | BlankSegment;

const toPattern = (blank: ExpressionBlank) =>
	`**${blank.blank_text}**{${blank.sequence_order}}`;

/**
 * 영어 스크립트 문자열을 일반 텍스트와 빈칸 구간으로 분리합니다.
 *
 * 빈칸 패턴: **blank_text**{sequence_order}
 */
export function parseScript(
	script: string,
	blanks: ExpressionBlank[],
): ScriptSegment[] {
	const sortedBlanks = [...blanks].sort(
		(a, b) => a.sequence_order - b.sequence_order,
	);

	const { segments, remaining } = sortedBlanks.reduce(
		(acc, blank) => {
			const pattern = toPattern(blank);
			const index = acc.remaining.indexOf(pattern);

			if (index === -1) return acc;

			const before =
				index > 0
					? [
							...acc.segments,
							{ type: "text" as const, value: acc.remaining.slice(0, index) },
						]
					: acc.segments;

			return {
				segments: [...before, { type: "blank" as const, blank }],
				remaining: acc.remaining.slice(index + pattern.length),
			};
		},
		{ segments: [] as ScriptSegment[], remaining: script },
	);

	return remaining
		? [...segments, { type: "text" as const, value: remaining }]
		: segments;
}
