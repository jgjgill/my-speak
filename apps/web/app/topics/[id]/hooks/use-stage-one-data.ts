import type { User } from "@supabase/supabase-js";
import { useSuspenseQueries } from "@tanstack/react-query";
import {
	getKoreanScripts,
	getLearningPoints,
	getUserSelectedPoints,
	getUserTranslations,
} from "../queries/stage-one-queries";

const getEmptyUserTranslations = async (): Promise<never[]> => [];
const getEmptyUserSelectedPoints = async (): Promise<never[]> => [];

export function useStageOneData(topicId: string, user: User | null) {
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
				queryKey: user
					? ["user-translations", topicId, user.id]
					: ["user-translations", topicId, "guest"],
				queryFn: user
					? () => getUserTranslations(topicId, user)
					: getEmptyUserTranslations,
			},
			{
				queryKey: user
					? ["user-selected-points", topicId, user.id]
					: ["user-selected-points", topicId, "guest"],
				queryFn: user
					? () => getUserSelectedPoints(topicId, user)
					: getEmptyUserSelectedPoints,
			},
		],
	});
}
