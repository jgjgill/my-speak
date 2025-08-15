"use client";

import type { User } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	addLearningPoint,
	removeLearningPoint,
	type ToggleLearningPointParams,
} from "../mutations/learning-point-mutations";

export function useLearningPointMutations(topicId: string, user: User | null) {
	const queryClient = useQueryClient();

	const addMutation = useMutation({
		mutationFn: (params: Omit<ToggleLearningPointParams, "userId">) => {
			if (!user) throw new Error("User not authenticated");
			return addLearningPoint({ ...params, userId: user.id });
		},
		onSuccess: () => {
			if (!user) throw new Error("User not authenticated");
			queryClient.invalidateQueries({
				queryKey: ["user-selected-points", topicId, user.id],
			});
		},
		onError: (error) => {
			console.error("학습 포인트 추가 중 오류:", error);
		},
	});

	const removeMutation = useMutation({
		mutationFn: (params: Omit<ToggleLearningPointParams, "userId">) => {
			if (!user) throw new Error("User not authenticated");
			return removeLearningPoint({ ...params, userId: user.id });
		},
		onSuccess: () => {
			if (!user) throw new Error("User not authenticated");
			queryClient.invalidateQueries({
				queryKey: ["user-selected-points", topicId, user.id],
			});
		},
		onError: (error) => {
			console.error("학습 포인트 제거 중 오류:", error);
		},
	});

	return {
		addLearningPoint: addMutation,
		removeLearningPoint: removeMutation,
	};
}
