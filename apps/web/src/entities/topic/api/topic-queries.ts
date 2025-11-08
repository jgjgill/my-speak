import type { Tables } from "@repo/typescript-config/supabase-types";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createBrowserClient } from "@/shared/api/supabase";

export type Topic = Tables<"topics">;
export type HighlightSentence = Tables<"highlight_sentences">;
export type KoreanScript = Tables<"korean_scripts">;
export type ForeignScript = Tables<"foreign_scripts">;
export type LearningPoint = Tables<"learning_points">;
export type UserTranslation = Tables<"user_translations">;
export type UserSelectedPoint = Tables<"user_selected_points">;
export type KeywordSpeech = Tables<"keyword_speeches">;

export interface TopicWithHighlight extends Topic {
	highlight_sentences: HighlightSentence | null;
}

export interface TopicsQueryParams {
	limit?: number;
	page?: number;
	language?: string;
}

export interface TopicsResponse {
	topics: TopicWithHighlight[];
	totalCount: number;
	hasMore: boolean;
	currentPage: number;
	totalPages: number;
}

export async function getTopic(
	topicId: string,
	supabase?: SupabaseClient,
): Promise<Topic> {
	const client = supabase || createBrowserClient();
	const { data, error } = await client
		.from("topics")
		.select("*")
		.eq("id", topicId)
		.single();

	if (error) throw error;
	return data;
}

export async function getTopics(
	params: TopicsQueryParams = {},
): Promise<TopicsResponse> {
	const client = createBrowserClient();

	const { limit = 5, page = 0, language = "en" } = params;

	const offset = page * limit;

	const {
		data: topics,
		error,
		count,
	} = await client
		.from("topics")
		.select("*, highlight_sentences(*)", { count: "exact" })
		.eq("language_code", language)
		.order("created_at", { ascending: false })
		.range(offset, offset + limit - 1);

	if (error) {
		throw new Error(`Failed to fetch topics: ${error.message}`);
	}

	const totalCount = count || 0;
	const totalPages = Math.ceil(totalCount / limit);
	const hasMore = page + 1 < totalPages;

	return {
		topics: topics || [],
		totalCount,
		hasMore,
		currentPage: page,
		totalPages,
	};
}

export async function getKoreanScripts(
	topicId: string,
	supabase?: SupabaseClient,
): Promise<KoreanScript[]> {
	const client = supabase || createBrowserClient();
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
	const client = supabase || createBrowserClient();

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
	const client = supabase || createBrowserClient();
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
	const client = supabase || createBrowserClient();
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
	const client = supabase || createBrowserClient();
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
	const client = supabase || createBrowserClient();

	const { data, error } = await client
		.from("keyword_speeches")
		.select("*")
		.eq("topic_id", topicId)
		.order("sequence_order");

	if (error) throw error;
	return data || [];
}
