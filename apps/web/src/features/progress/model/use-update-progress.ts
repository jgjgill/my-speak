import type { User } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProgress } from "../api";

export function useUpdateProgress(
	topicId: string,
	language: string,
	user: User | null,
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (currentStage: number) => {
			if (!user) throw new Error("User not authenticated");
			return updateUserProgress(topicId, user.id, currentStage);
		},
		onSuccess: () => {
			if (!user) throw new Error("User not authenticated");

			// Invalidate user progress cache
			queryClient.invalidateQueries({
				queryKey: ["user-progress", topicId, language, user.id],
			});

			// Invalidate topics list cache (to update max stage in list view)
			queryClient.invalidateQueries({
				queryKey: ["topics", "infinite"],
			});
		},
	});
}
