import type { Tables } from "@repo/typescript-config/supabase-types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "../../utils/supabase/client";

export type Topic = Tables<"topics">;

export interface TopicsQueryParams {
	limit?: number;
	page?: number;
}

export interface TopicsResponse {
	topics: Topic[];
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

	const { limit = 5, page = 0 } = params;

	const offset = page * limit;

	const {
		data: topics,
		error,
		count,
	} = await client
		.from("topics")
		.select("*", { count: "exact" })
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
