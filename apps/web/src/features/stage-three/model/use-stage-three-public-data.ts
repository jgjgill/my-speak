import type { User } from "@supabase/supabase-js";
import { useSuspenseQueries } from "@tanstack/react-query";
import {
	getForeignScripts,
	getKoreanScripts,
	getLearningPoints,
	getUserSelectedPoints,
} from "@/entities/topic";
import { topicContentKeys, userDataKeys } from "@/shared/api/query-keys";

export const getEmptyUserSelectedPoints = async (): Promise<never[]> => [];

export function useStageThreePublicData(
	topicId: string,
	language: string,
	user?: User | null,
) {
	return useSuspenseQueries({
		queries: [
			{
				queryKey: topicContentKeys.koreanScripts(topicId, language),
				queryFn: () => getKoreanScripts(topicId, language),
			},
			{
				queryKey: topicContentKeys.foreignScripts(topicId, language),
				queryFn: () => getForeignScripts(topicId, language),
			},
			{
				queryKey: topicContentKeys.learningPoints(topicId, language),
				queryFn: () => getLearningPoints(topicId, language),
			},
			{
				queryKey: userDataKeys.selectedPoints(
					topicId,
					language,
					user?.id ?? null,
				),
				queryFn: user
					? () => getUserSelectedPoints(topicId, language, user)
					: getEmptyUserSelectedPoints,
			},
		],
	});
}
