import type { User } from "@supabase/supabase-js";
import { useSuspenseQueries } from "@tanstack/react-query";
import {
	getForeignScripts,
	getKoreanScripts,
	getLearningPoints,
	getUserSelectedPoints,
} from "@/entities/topic";

export const getEmptyUserSelectedPoints = async (): Promise<never[]> => [];

export function useStageTwoPublicData(
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
				queryKey: ["foreign-scripts", topicId, language],
				queryFn: () => getForeignScripts(topicId, language),
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
