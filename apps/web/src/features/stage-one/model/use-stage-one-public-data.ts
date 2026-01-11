import type { User } from "@supabase/supabase-js";
import { useSuspenseQueries } from "@tanstack/react-query";
import {
	getKoreanScripts,
	getLearningPoints,
	getUserSelectedPoints,
} from "@/entities/topic";

export const getEmptyUserSelectedPoints = async (): Promise<never[]> => [];

export function useStageOnePublicData(
	topicId: string,
	language: string,
	user?: User | null,
) {
	return useSuspenseQueries({
		queries: [
			{
				queryKey: ["korean-scripts", topicId, language],
				queryFn: () => getKoreanScripts(topicId, language),
			},
			{
				queryKey: ["learning-points", topicId, language],
				queryFn: () => getLearningPoints(topicId, language),
			},
			{
				queryKey: [
					"user-selected-points",
					topicId,
					language,
					user ? user.id : "guest",
				],
				queryFn: user
					? () => getUserSelectedPoints(topicId, language, user)
					: getEmptyUserSelectedPoints,
			},
		],
	});
}
