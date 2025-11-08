import type { User } from "@supabase/supabase-js";
import { useSuspenseQueries } from "@tanstack/react-query";
import {
	getKoreanScripts,
	getLearningPoints,
	getUserSelectedPoints,
} from "@/entities/topic";

export const getEmptyUserSelectedPoints = async (): Promise<never[]> => [];

export function useStageOnePublicData(topicId: string, user?: User | null) {
	return useSuspenseQueries({
		queries: [
			{
				queryKey: ["korean-scripts", topicId],
				queryFn: () => getKoreanScripts(topicId),
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
