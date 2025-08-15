"use client";

import type { User } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	type UpsertTranslationParams,
	updateTranslation,
} from "../mutations/translation-mutations";

export function useTranslationMutation(topicId: string, user: User | null) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (params: Omit<UpsertTranslationParams, "userId">) => {
			if (!user) throw new Error("User not authenticated");
			return updateTranslation({ ...params, userId: user.id });
		},
		onSuccess: () => {
			if (!user) throw new Error("User not authenticated");
			queryClient.invalidateQueries({
				queryKey: ["user-translations", topicId, user.id],
			});
		},
		onError: (error) => {
			console.error("번역 저장 중 오류:", error);
		},
	});
}
