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
export type UserTopicCompletionStatus = Tables<"user_topic_completion_status">;

export interface TopicWithHighlight extends Topic {
	highlight_sentences: HighlightSentence | null;
}

export interface TopicWithProgress extends TopicWithHighlight {
	user_progress: UserProgress | null;
}

// 난이도 레벨
export type DifficultyLevel = "초급" | "중급" | "고급";

// 완료 상태
export type CompletionStatus =
	| "all"
	| "completed"
	| "in_progress"
	| "not_started";

// 정렬 옵션
export type TopicSortOption =
	| "latest" // 최신순 (created_at desc)
	| "oldest" // 오래된순 (created_at asc)
	| "most_sentences" // 문항수 많은순
	| "least_sentences"; // 문항수 적은순

// 필터 옵션
export interface TopicFilterOptions {
	difficulties?: DifficultyLevel[];
	completionStatus?: CompletionStatus;
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

	// 완료 상태 필터가 있고 사용자가 인증된 경우 뷰 사용
	if (filters.completionStatus && filters.completionStatus !== "all" && user) {
		return getTopicsWithCompletionFilter(params, user);
	}

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
	const filteredTopics = (topics || []).map((topic) => ({
		...topic,
		user_progress: user
			? Array.isArray(topic.user_progress)
				? topic.user_progress.find((up) => up.user_id === user.id) || null
				: topic.user_progress
			: null,
	}));

	const totalCount = count || 0;
	const totalPages = Math.ceil(totalCount / limit);

	// 완료 상태 필터 사용 시: 필터링 결과가 없으면 hasMore = false
	// 일반 필터 사용 시: 기존 로직 유지
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

/**
 * 완료 상태 필터를 적용한 주제 목록 조회
 * user_topic_completion_status 뷰를 사용하여 서버 측에서 필터링
 */
async function getTopicsWithCompletionFilter(
	params: TopicsQueryParams,
	user: User,
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

	// user_topic_completion_status 뷰에서 조회
	let query = client
		.from("user_topic_completion_status")
		.select("*", { count: "exact" })
		.eq("language_code", language)
		.eq("user_id", user.id);

	// 완료 상태 필터 적용
	if (filters.completionStatus && filters.completionStatus !== "all") {
		query = query.eq("completion_status", filters.completionStatus);
	}

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

	const { data: viewData, error, count } = await query;

	if (error) {
		throw new Error(`Failed to fetch topics: ${error.message}`);
	}

	// 뷰 데이터를 TopicWithProgress 형식으로 변환
	const topicIds = (viewData || [])
		.map((v) => v.topic_id)
		.filter((id): id is string => id !== null);

	if (topicIds.length === 0) {
		return {
			topics: [],
			totalCount: count || 0,
			hasMore: false,
			currentPage: page,
			totalPages: 0,
		};
	}

	// topics와 highlight_sentences 조회
	const { data: topicsData, error: topicsError } = await client
		.from("topics")
		.select("*, highlight_sentences(*)")
		.in("id", topicIds);

	if (topicsError) {
		throw new Error(`Failed to fetch topic details: ${topicsError.message}`);
	}

	// 뷰 데이터와 topics 데이터를 결합
	const topics: TopicWithProgress[] = (viewData || []).map((viewRow) => {
		const topic = topicsData?.find((t) => t.id === viewRow.topic_id);
		if (!topic) {
			throw new Error(`Topic ${viewRow.topic_id} not found`);
		}

		return {
			...topic,
			user_progress: viewRow.user_id
				? {
						user_id: viewRow.user_id,
						topic_id: viewRow.topic_id || "",
						completed_sentences: viewRow.completed_sentences || [],
						current_stage: null,
						id: "",
						last_updated: new Date().toISOString(),
						practice_count: null,
					}
				: null,
		};
	});

	const totalCount = count || 0;
	const totalPages = Math.ceil(totalCount / limit);
	const hasMore = page + 1 < totalPages;

	return {
		topics,
		totalCount,
		hasMore,
		currentPage: page,
		totalPages,
	};
}
