import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { QueryClient } from "@tanstack/react-query";
import { getGuestProgress, getUserProgress } from "@/entities/progress";
import {
	getForeignScripts,
	getKeywordSpeeches,
	getKoreanScripts,
	getLearningPoints,
	getTopic,
	getUserSelectedPoints,
	getUserTranslations,
} from "@/entities/topic";

export async function prefetchTopicData(
	queryClient: QueryClient,
	topicId: string,
	language: string,
	user: User | null,
	supabase: SupabaseClient,
) {
	const userId = user ? user.id : "guest";

	await Promise.all([
		// 공개 데이터
		queryClient.prefetchQuery({
			queryKey: ["topic", topicId, language],
			queryFn: () => getTopic(topicId, language, supabase),
		}),
		queryClient.prefetchQuery({
			queryKey: ["korean-scripts", topicId, language],
			queryFn: () => getKoreanScripts(topicId, language, supabase),
		}),
		queryClient.prefetchQuery({
			queryKey: ["learning-points", topicId, language],
			queryFn: () => getLearningPoints(topicId, language, supabase),
		}),
		queryClient.prefetchQuery({
			queryKey: ["foreign-scripts", topicId, language],
			queryFn: () => getForeignScripts(topicId, language, supabase),
		}),
		queryClient.prefetchQuery({
			queryKey: ["keyword-speeches", topicId, language],
			queryFn: () => getKeywordSpeeches(topicId, language, supabase),
		}),

		// 유저 데이터
		queryClient.prefetchQuery({
			queryKey: ["user-progress", topicId, language, userId],
			queryFn: user
				? async () => {
						const progress = await getUserProgress(
							topicId,
							language,
							user,
							supabase,
						);
						return progress?.current_stage || 1;
					}
				: getGuestProgress,
		}),
		queryClient.prefetchQuery({
			queryKey: ["user-selected-points", topicId, language, userId],
			queryFn: user
				? () => getUserSelectedPoints(topicId, language, user, supabase)
				: async () => [],
		}),
		queryClient.prefetchQuery({
			queryKey: ["user-translations", topicId, language, userId],
			queryFn: user
				? () => getUserTranslations(topicId, language, user, supabase)
				: async () => [],
		}),
	]);
}
