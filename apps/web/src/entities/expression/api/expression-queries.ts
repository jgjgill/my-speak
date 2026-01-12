import type { Tables } from "@repo/typescript-config/supabase-types";
import type { SupabaseClient } from "@supabase/supabase-js";

export type Expression = Tables<"expressions">;
export type ExpressionBlank = Tables<"expression_blanks">;
export type ExpressionDetail = Tables<"expression_details">;

export interface ExpressionWithBlanks extends Expression {
	blanks: ExpressionBlank[];
}

export interface ExpressionComplete extends ExpressionWithBlanks {
	details: ExpressionDetail[];
}

/**
 * 모든 Expression 목록을 조회합니다.
 */
export async function getExpressions(
	supabase: SupabaseClient,
	languageCode = "en",
): Promise<ExpressionWithBlanks[]> {
	const { data, error } = await supabase
		.from("expressions")
		.select(
			`
			*,
			blanks:expression_blanks(*)
		`,
		)
		.eq("language_code", languageCode)
		.order("created_at", { ascending: false });

	if (error) throw error;
	return data || [];
}

/**
 * 특정 Expression의 상세 정보를 조회합니다.
 */
export async function getExpressionBySlug(
	supabase: SupabaseClient,
	slug: string,
	languageCode: string,
): Promise<ExpressionComplete | null> {
	const { data, error } = await supabase
		.from("expressions")
		.select(
			`
			*,
			blanks:expression_blanks(*),
			details:expression_details(*)
		`,
		)
		.eq("slug", slug)
		.eq("language_code", languageCode)
		.single();

	if (error) throw error;
	return data;
}
