"use client";

import type { User } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { topicKeys, userDataKeys } from "@/shared/api/query-keys";
import {
	type UpsertTranslationParams,
	updateTranslation,
} from "../api/translation-mutations";

export function useTranslationMutation(
	topicId: string,
	language: string,
	user: User | null,
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (params: Omit<UpsertTranslationParams, "userId">) => {
			if (!user) throw new Error("User not authenticated");
			return updateTranslation({ ...params, userId: user.id });
		},
		onSuccess: () => {
			if (!user) throw new Error("User not authenticated");

			// Invalidate user translations cache
			queryClient.invalidateQueries({
				queryKey: userDataKeys.translations(topicId, language, user.id),
			});

			// Invalidate user progress cache (for current_stage and completed_sentences)
			queryClient.invalidateQueries({
				queryKey: userDataKeys.progress(topicId, language, user.id),
			});

			// Invalidate topics list cache (to update completion percentage in list view)
			queryClient.invalidateQueries({
				queryKey: topicKeys.infinite(),
			});
		},
		onError: (error) => {
			console.error("번역 저장 중 오류:", error);
		},
	});
}
