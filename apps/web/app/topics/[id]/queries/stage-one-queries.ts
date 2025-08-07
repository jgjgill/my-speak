import type { Tables } from "@repo/typescript-config/supabase-types";
import type { User } from "@supabase/supabase-js";
import { createClient } from "../../../utils/supabase/client";

export type KoreanScript = Tables<"korean_scripts">;
export type LearningPoint = Tables<"learning_points">;
export type UserTranslation = Tables<"user_translations">;
export type UserSelectedPoint = Tables<"user_selected_points">;

export async function getKoreanScripts(
	topicId: string,
): Promise<KoreanScript[]> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("korean_scripts")
		.select("*")
		.eq("topic_id", topicId)
		.order("sentence_order");

	if (error) throw error;
	return data || [];
}

export async function getLearningPoints(
	topicId: string,
): Promise<LearningPoint[]> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("learning_points")
		.select("*")
		.eq("topic_id", topicId)
		.order("sentence_order");

	if (error) throw error;
	return data || [];
}

export async function getUserTranslations(
	topicId: string,
	user: User,
): Promise<UserTranslation[]> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("user_translations")
		.select("*")
		.eq("user_id", user.id)
		.eq("topic_id", topicId);

	if (error) throw error;
	return data || [];
}

export async function getUserSelectedPoints(
	topicId: string,
	user: User,
): Promise<UserSelectedPoint[]> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("user_selected_points")
		.select("*")
		.eq("user_id", user.id)
		.eq("topic_id", topicId);

	if (error) throw error;
	return data || [];
}
