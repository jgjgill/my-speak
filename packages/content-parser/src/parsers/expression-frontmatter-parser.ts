import type { TablesInsert } from "@repo/typescript-config/supabase-types";
import matter from "gray-matter";

export interface ExpressionFrontmatter {
	expression_id: string;
	title: string;
	slug: string;
	language_code?: string;
	highlight_sentence: string;
	thumbnail_url?: string | null;
}

/**
 * Expression frontmatter를 파싱하고 검증합니다.
 */
export function parseExpressionFrontmatter(fileContent: string): {
	frontmatter: ExpressionFrontmatter;
	content: string;
	expression: TablesInsert<"expressions">;
} {
	const { data: frontmatter, content } = matter(fileContent);

	// UUID 검증 함수
	function isValidUUID(uuid: string): boolean {
		const uuidRegex =
			/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		return uuidRegex.test(uuid);
	}

	// expression_id 필수 검증
	const expressionId = frontmatter.expression_id;

	if (!expressionId) {
		throw new Error("expression_id is required in frontmatter");
	}

	if (typeof expressionId !== "string") {
		throw new Error("expression_id must be a string");
	}

	if (!isValidUUID(expressionId)) {
		throw new Error(`Invalid UUID format: ${expressionId}`);
	}

	// 필수 필드 검증
	if (!frontmatter.title) {
		throw new Error("title is required in frontmatter");
	}

	if (!frontmatter.slug) {
		throw new Error("slug is required in frontmatter");
	}

	if (!frontmatter.highlight_sentence) {
		throw new Error("highlight_sentence is required in frontmatter");
	}

	// expression 객체 생성 (Supabase Insert 타입 사용)
	const expression: TablesInsert<"expressions"> = {
		id: expressionId,
		title: frontmatter.title,
		slug: frontmatter.slug,
		language_code: frontmatter.language_code || "en",
		highlight_sentence: frontmatter.highlight_sentence,
		thumbnail_url: frontmatter.thumbnail_url || null,
		// english_script와 korean_translation은 나중에 채워짐
		english_script: "",
		korean_translation: "",
		total_blanks: 0,
	};

	return {
		frontmatter: frontmatter as ExpressionFrontmatter,
		content,
		expression,
	};
}
