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
export type UserProgress = Tables<"user_progress">;

export interface TopicWithHighlight extends Topic {
	highlight_sentences: HighlightSentence | null;
}

export interface TopicWithProgress extends TopicWithHighlight {
	user_progress: UserProgress | null;
}

// 정렬 옵션
export type TopicSortOption =
	| "latest" // 최신순 (created_at desc)
	| "oldest" // 오래된순 (created_at asc)
	| "most_sentences" // 문항수 많은순
	| "least_sentences"; // 문항수 적은순

// 필터 옵션
export interface TopicFilterOptions {
	difficulties?: string[]; // ["초급", "중급", "고급"]
	completionStatus?: "all" | "completed" | "in_progress" | "not_started";
}

export interface TopicsQueryParams {
	limit?: number;
	page?: number;
	language?: string;
	sortBy?: TopicSortOption;
	filters?: TopicFilterOptions;
}

export interface TopicsResponse {
	topics: TopicWithProgress[];
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

	const {
		limit = 5,
		page = 0,
		language = "en",
		sortBy = "latest",
		filters = {},
	} = params;

	const offset = page * limit;

	// 사용자 인증 확인
	const {
		data: { user },
	} = await client.auth.getUser();

	// 기본 쿼리 빌드
	let query = client
		.from("topics")
		.select("*, highlight_sentences(*), user_progress(*)", { count: "exact" })
		.eq("language_code", language);

	// 난이도 필터 적용
	if (filters.difficulties && filters.difficulties.length > 0) {
		query = query.in("difficulty", filters.difficulties);
	}

	// 정렬 적용
	switch (sortBy) {
		case "latest":
			query = query.order("created_at", { ascending: false });
			break;
		case "oldest":
			query = query.order("created_at", { ascending: true });
			break;
		case "most_sentences":
			query = query.order("total_sentences", {
				ascending: false,
				nullsFirst: false,
			});
			break;
		case "least_sentences":
			query = query.order("total_sentences", {
				ascending: true,
				nullsFirst: false,
			});
			break;
	}

	// 페이지네이션 적용
	query = query.range(offset, offset + limit - 1);

	const { data: topics, error, count } = await query;

	if (error) {
		throw new Error(`Failed to fetch topics: ${error.message}`);
	}

	// user_progress 필터링 (user_id로 필터링)
	let filteredTopics = (topics || []).map((topic) => ({
		...topic,
		user_progress: user
			? Array.isArray(topic.user_progress)
				? topic.user_progress.find((up) => up.user_id === user.id) || null
				: topic.user_progress
			: null,
	}));

	// 풀이 현황 필터 적용 (클라이언트 사이드)
	if (user && filters.completionStatus && filters.completionStatus !== "all") {
		filteredTopics = filteredTopics.filter((topic) => {
			const progress = topic.user_progress;
			const totalSentences = topic.total_sentences || 0;

			switch (filters.completionStatus) {
				case "completed":
					return (
						(progress?.completed_sentences?.length ?? 0) >= totalSentences &&
						totalSentences > 0
					);
				case "in_progress": {
					const completedCount = progress?.completed_sentences?.length ?? 0;
					return completedCount > 0 && completedCount < totalSentences;
				}
				case "not_started":
					return (progress?.completed_sentences?.length ?? 0) === 0;
				default:
					return true;
			}
		});
	}

	const totalCount = count || 0;
	const totalPages = Math.ceil(totalCount / limit);
	const hasMore = page + 1 < totalPages;

	return {
		topics: filteredTopics,
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
