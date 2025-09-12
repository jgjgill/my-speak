import type { Tables } from "@repo/typescript-config/supabase-types";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "../../../../utils/supabase/client";

export type KoreanScript = Tables<"korean_scripts">;
export type ForeignScript = Tables<"foreign_scripts">;
export type LearningPoint = Tables<"learning_points">;
export type UserTranslation = Tables<"user_translations">;
export type UserSelectedPoint = Tables<"user_selected_points">;
export type KeywordSpeech = Tables<"keyword_speeches">;

export async function getKoreanScripts(
	topicId: string,
	supabase?: SupabaseClient,
): Promise<KoreanScript[]> {
	const client = supabase || createClient();
	const { data, error } = await client
		.from("korean_scripts")
		.select("*")
		.eq("topic_id", topicId)
		.order("sentence_order");

	if (error) throw error;
	return data || [];
}

export async function getForeignScripts(
	topicId: string,
	supabase?: SupabaseClient,
): Promise<ForeignScript[]> {
	const client = supabase || createClient();

	const { data, error } = await client
		.from("foreign_scripts")
		.select("*")
		.eq("topic_id", topicId)
		.order("sentence_order");

	if (error) throw error;
	return data || [];
}

export async function getLearningPoints(
	topicId: string,
	supabase?: SupabaseClient,
): Promise<LearningPoint[]> {
	const client = supabase || createClient();
	const { data, error } = await client
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
	supabase?: SupabaseClient,
): Promise<UserTranslation[]> {
	const client = supabase || createClient();
	const { data, error } = await client
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
	supabase?: SupabaseClient,
): Promise<UserSelectedPoint[]> {
	const client = supabase || createClient();
	const { data, error } = await client
		.from("user_selected_points")
		.select("*")
		.eq("user_id", user.id)
		.eq("topic_id", topicId);

	if (error) throw error;
	return data || [];
}

export async function getKeywordSpeeches(
	topicId: string,
	supabase?: SupabaseClient,
): Promise<KeywordSpeech[]> {
	const client = supabase || createClient();

	const { data, error } = await client
		.from("keyword_speeches")
		.select("*")
		.eq("topic_id", topicId)
		.order("sequence_order");

	if (error) throw error;
	return data || [];
}
