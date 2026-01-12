import type { TablesInsert } from "@repo/typescript-config/supabase-types";
import { findSections, parseSections } from "./section-parser";

export interface ParsedDetail {
	blankText: string;
	sequenceOrder: number;
	meaning: string;
	usageExamples: string[];
	usageTips: string | null;
}

/**
 * Expression Details 섹션을 파싱합니다.
 */
export function parseExpressionDetails(
	content: string,
	expressionId: string,
	blanks: TablesInsert<"expression_blanks">[],
): TablesInsert<"expression_details">[] {
	const sections = parseSections(content);

	// Expression Details 섹션 찾기
	const detailsSections = Array.from(
		findSections(["Expression Details"])(sections),
	);

	if (detailsSections.length === 0) {
		throw new Error("Expression Details section not found");
	}

	const details: TablesInsert<"expression_details">[] = [];

	// 각 ## **표현**{순서} 하위 섹션 파싱
	for (const section of detailsSections) {
		// ## 제목 추출 (예: "## **Can I get**{1}")
		const subSections = section.content.split(/^## /m).filter(Boolean);

		for (const subSection of subSections) {
			const lines = subSection.trim().split("\n");
			const titleLine = lines[0];

			if (!titleLine) continue;

			// **표현**{순서} 패턴 매칭
			const titleMatch = titleLine.match(/\*\*(.+?)\*\*\{(\d+)\}/);
			if (!titleMatch) continue;

			const blankText = titleMatch[1];
			const sequenceOrderStr = titleMatch[2];

			if (!blankText || !sequenceOrderStr) {
				throw new Error(
					`Invalid title format in Expression Details: ${titleLine}`,
				);
			}

			const sequenceOrder = Number.parseInt(sequenceOrderStr, 10);

			// 해당 blank 찾기
			const blank = blanks.find(
				(b) =>
					b.sequence_order === sequenceOrder && b.blank_text === blankText,
			);
			if (!blank) {
				throw new Error(
					`Blank not found for detail: ${blankText} (order: ${sequenceOrder})`,
				);
			}

			// 내용 파싱
			let meaning = "";
			const usageExamples: string[] = [];
			let usageTips: string | null = null;

			let currentSection: "meaning" | "examples" | "tips" | null = null;

			for (let i = 1; i < lines.length; i++) {
				const currentLine = lines[i];
				if (!currentLine) continue;
				const line = currentLine.trim();

				if (line.startsWith("- **의미**:")) {
					currentSection = "meaning";
					meaning = line.replace("- **의미**:", "").trim();
				} else if (line.startsWith("- **활용 예시**:")) {
					currentSection = "examples";
				} else if (line.startsWith("- **사용 팁**:")) {
					currentSection = "tips";
					usageTips = line.replace("- **사용 팁**:", "").trim();
				} else if (currentLine.startsWith("  - ")) {
					// 예시 항목
					if (currentSection === "examples") {
						usageExamples.push(currentLine.replace("  - ", "").trim());
					}
				}
			}

			if (!meaning) {
				throw new Error(
					`Meaning not found for blank: ${blankText} (order: ${sequenceOrder})`,
				);
			}

			if (usageExamples.length === 0) {
				throw new Error(
					`Usage examples not found for blank: ${blankText} (order: ${sequenceOrder})`,
				);
			}

			details.push({
				expression_id: expressionId,
				blank_id: blank.id, // 나중에 DB에서 생성된 ID로 업데이트 필요
				meaning,
				usage_examples: usageExamples,
				usage_tips: usageTips,
			});
		}
	}

	if (details.length === 0) {
		throw new Error("No expression details found");
	}

	return details;
}
