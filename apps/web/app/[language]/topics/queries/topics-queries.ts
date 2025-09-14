import type { Tables } from "@repo/typescript-config/supabase-types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "../../../utils/supabase/client";

export type Topic = Tables<"topics">;
export type HighlightSentence = Tables<"highlight_sentences">;

export interface TopicWithHighlight extends Topic {
	highlight_sentences: HighlightSentence | null;
}

export interface TopicsQueryParams {
	limit?: number;
	page?: number;
	languageCode?: string;
}

export interface TopicsResponse {
	topics: TopicWithHighlight[];
	totalCount: number;
	hasMore: boolean;
	currentPage: number;
	totalPages: number;
}

export async function getTopics(
	params: TopicsQueryParams = {},
	supabase?: SupabaseClient,
): Promise<TopicsResponse> {
	const client = supabase || createClient();

	const { limit = 5, page = 0, languageCode = "en" } = params;

	const offset = page * limit;

	const {
		data: topics,
		error,
		count,
	} = await client
		.from("topics")
		.select("*, highlight_sentences(*)", { count: "exact" })
		.eq("language_code", languageCode)
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
