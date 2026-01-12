import { findSection, parseSections } from "./section-parser";

export interface ParsedScripts {
	englishScript: string;
	koreanTranslation: string;
}

/**
 * English Script와 Korean Translation 섹션을 파싱합니다.
 */
export function parseExpressionScripts(content: string): ParsedScripts {
	const sections = parseSections(content);

	// English Script 섹션 찾기
	const englishSection = findSection(["English Script"])(sections);
	if (!englishSection) {
		throw new Error("English Script section not found");
	}

	// Korean Translation 섹션 찾기
	const koreanSection = findSection(["Korean Translation"])(sections);
	if (!koreanSection) {
		throw new Error("Korean Translation section not found");
	}

	// 섹션 제목 제외한 내용 추출
	const englishScript = englishSection.lines.slice(1).join("\n").trim();
	const koreanTranslation = koreanSection.lines.slice(1).join("\n").trim();

	if (!englishScript) {
		throw new Error("English Script content is empty");
	}

	if (!koreanTranslation) {
		throw new Error("Korean Translation content is empty");
	}

	return {
		englishScript,
		koreanTranslation,
	};
}
