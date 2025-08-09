import type { Tables } from "@repo/typescript-config/supabase-types";
import { createClient } from "../../../../utils/supabase/client";

type UserTranslation = Tables<"user_translations">;

export interface UpsertTranslationParams {
	userId: string;
	topicId: string;
	sentenceOrder: number;
	koreanText: string;
	userTranslation: string;
	isCompleted: boolean;
}

export async function updateTranslation(
	params: UpsertTranslationParams,
): Promise<UserTranslation> {
	const supabase = createClient();

	const { data, error } = await supabase
		.from("user_translations")
		.upsert(
			{
				user_id: params.userId,
				topic_id: params.topicId,
				sentence_order: params.sentenceOrder,
				korean_text: params.koreanText,
				user_translation: params.userTranslation,
				is_completed: params.isCompleted,
			},
			{ onConflict: "user_id,topic_id,sentence_order" },
		)
		.select()
		.single();

	if (error) throw error;
	return data;
}
