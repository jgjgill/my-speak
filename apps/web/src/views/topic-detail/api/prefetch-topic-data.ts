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
import {
	topicContentKeys,
	topicKeys,
	userDataKeys,
} from "@/shared/api/query-keys";

export async function prefetchTopicData(
	queryClient: QueryClient,
	topicId: string,
	language: string,
	user: User | null,
	supabase: SupabaseClient,
) {
	await Promise.all([
		// 공개 데이터
		queryClient.prefetchQuery({
			queryKey: topicKeys.detail(topicId, language),
			queryFn: () => getTopic(topicId, language, supabase),
		}),
		queryClient.prefetchQuery({
			queryKey: topicContentKeys.koreanScripts(topicId, language),
			queryFn: () => getKoreanScripts(topicId, language, supabase),
		}),
		queryClient.prefetchQuery({
			queryKey: topicContentKeys.learningPoints(topicId, language),
			queryFn: () => getLearningPoints(topicId, language, supabase),
		}),
		queryClient.prefetchQuery({
			queryKey: topicContentKeys.foreignScripts(topicId, language),
			queryFn: () => getForeignScripts(topicId, language, supabase),
		}),
		queryClient.prefetchQuery({
			queryKey: topicContentKeys.keywordSpeeches(topicId, language),
			queryFn: () => getKeywordSpeeches(topicId, language, supabase),
		}),

		// 유저 데이터
		queryClient.prefetchQuery({
			queryKey: userDataKeys.progress(topicId, language, user?.id ?? null),
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
			queryKey: userDataKeys.selectedPoints(
				topicId,
				language,
				user?.id ?? null,
			),
			queryFn: user
				? () => getUserSelectedPoints(topicId, language, user, supabase)
				: async () => [],
		}),
		queryClient.prefetchQuery({
			queryKey: userDataKeys.translations(topicId, language, user?.id ?? null),
			queryFn: user
				? () => getUserTranslations(topicId, language, user, supabase)
				: async () => [],
		}),
	]);
}
