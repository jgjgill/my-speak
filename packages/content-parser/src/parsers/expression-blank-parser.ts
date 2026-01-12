import type { TablesInsert } from "@repo/typescript-config/supabase-types";

export interface ParsedBlank {
	sequenceOrder: number;
	blankText: string;
}

/**
 * 영어 지문에서 빈칸 **표현**{순서} 패턴을 추출합니다.
 */
export function parseExpressionBlanks(
	englishScript: string,
	expressionId: string,
): TablesInsert<"expression_blanks">[] {
	// 정규식: **표현**{순서} 패턴 매칭
	const blankPattern = /\*\*(.+?)\*\*\{(\d+)\}/g;
	const blanks: TablesInsert<"expression_blanks">[] = [];
	const seenOrders = new Set<number>();

	let match: RegExpExecArray | null;
	// biome-ignore lint/suspicious/noAssignInExpressions: 정규식 매칭을 위한 패턴
	while ((match = blankPattern.exec(englishScript)) !== null) {
		const blankText = match[1];
		const sequenceOrderStr = match[2];

		if (!blankText) {
			throw new Error(`Empty blank text found at position ${match.index}`);
		}

		if (!sequenceOrderStr) {
			throw new Error(
				`Empty sequence order found for blank "${blankText}" at position ${match.index}`,
			);
		}

		const sequenceOrder = Number.parseInt(sequenceOrderStr, 10);

		if (Number.isNaN(sequenceOrder)) {
			throw new Error(
				`Invalid sequence order "${sequenceOrderStr}" for blank "${blankText}"`,
			);
		}

		// 순서 번호 중복 검증
		if (seenOrders.has(sequenceOrder)) {
			throw new Error(
				`Duplicate sequence_order found: ${sequenceOrder} for blank "${blankText}"`,
			);
		}

		seenOrders.add(sequenceOrder);

		blanks.push({
			expression_id: expressionId,
			sequence_order: sequenceOrder,
			blank_text: blankText,
		});
	}

	if (blanks.length === 0) {
		throw new Error("No blanks found in English Script");
	}

	// sequence_order 기준 정렬
	blanks.sort((a, b) => a.sequence_order - b.sequence_order);

	return blanks;
}
