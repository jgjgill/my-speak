import type { User } from "@supabase/supabase-js";
import { useSuspenseQueries } from "@tanstack/react-query";
import {
	getEnglishScripts,
	getKoreanScripts,
	getLearningPoints,
	getUserSelectedPoints,
} from "../queries/stage-queries";

export const getEmptyUserSelectedPoints = async (): Promise<never[]> => [];

export function useStageTwoPublicData(topicId: string, user?: User | null) {
	return useSuspenseQueries({
		queries: [
			{
				queryKey: ["korean-scripts", topicId],
				queryFn: () => getKoreanScripts(topicId),
			},
			{
				queryKey: ["english-scripts", topicId],
				queryFn: () => getEnglishScripts(topicId),
			},
			{
				queryKey: ["learning-points", topicId],
				queryFn: () => getLearningPoints(topicId),
			},
			{
				queryKey: ["user-selected-points", topicId, user ? user.id : "guest"],
				queryFn: user
					? () => getUserSelectedPoints(topicId, user)
					: getEmptyUserSelectedPoints,
			},
		],
	});
}
