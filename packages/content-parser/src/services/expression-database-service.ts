import type {
	Database,
	TablesInsert,
} from "@repo/typescript-config/supabase-types";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

// 환경 변수 로드
config({ path: ".env.local" });

// Supabase 클라이언트 생성
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export interface ParsedExpressionContent {
	expression: TablesInsert<"expressions">;
	blanks: TablesInsert<"expression_blanks">[];
	details: TablesInsert<"expression_details">[];
}

/**
 * 파싱된 Expression 콘텐츠를 Supabase에 업로드합니다.
 */
export async function uploadExpressionToSupabase(
	data: ParsedExpressionContent,
) {
	try {
		console.log("📤 Uploading expression data to Supabase...");

		// 1. Expression 업로드
		const expressionData = await uploadExpression(data.expression);
		const expressionId = expressionData.id;

		console.log(`✅ Expression uploaded: ${expressionData.title}`);

		// 2. Blanks 업로드
		const blanksData = await uploadBlanks(data.blanks, expressionId);
		console.log(`✅ ${blanksData.length} blanks uploaded`);

		// 3. Details 업로드 (blank_id 매핑 필요)
		await uploadDetails(data.details, blanksData, expressionId);
		console.log(`✅ ${data.details.length} details uploaded`);

		console.log("✅ All expression data uploaded successfully!");
		return expressionData;
	} catch (error) {
		console.error("❌ Upload failed:", error);
		throw error;
	}
}

/**
 * Expression을 업로드합니다.
 */
async function uploadExpression(expression: TablesInsert<"expressions">) {
	const { data, error } = await supabase
		.from("expressions")
		.upsert(expression)
		.select()
		.single();

	if (error) throw error;
	return data;
}

/**
 * Expression Blanks를 업로드합니다.
 */
async function uploadBlanks(
	blanks: TablesInsert<"expression_blanks">[],
	expressionId: string,
) {
	const blanksWithExpression = blanks.map((blank) => ({
		...blank,
		expression_id: expressionId,
	}));

	const { data, error } = await supabase
		.from("expression_blanks")
		.upsert(blanksWithExpression, {
			onConflict: "expression_id,sequence_order",
		})
		.select();

	if (error) throw error;
	return data;
}

/**
 * Expression Details를 업로드합니다.
 */
async function uploadDetails(
	details: TablesInsert<"expression_details">[],
	blanksData: { id: string; sequence_order: number; blank_text: string }[],
	expressionId: string,
) {
	// details의 blank_id를 실제 DB에서 생성된 ID로 매핑
	const detailsWithBlankIds = details.map((detail, index) => {
		// blanks 배열의 순서대로 매핑 (sequence_order 기준 정렬 필요)
		const blank = blanksData[index];
		if (!blank) {
			throw new Error(`Blank not found for detail at index ${index}`);
		}

		return {
			...detail,
			expression_id: expressionId,
			blank_id: blank.id,
		};
	});

	const { data, error } = await supabase
		.from("expression_details")
		.upsert(detailsWithBlankIds, {
			onConflict: "blank_id",
		})
		.select();

	if (error) throw error;
	return data;
}
