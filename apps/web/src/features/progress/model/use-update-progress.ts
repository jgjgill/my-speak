import type { User } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProgress } from "../api";

export function useUpdateProgress(topicId: string, user: User | null) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (currentStage: number) => {
			if (!user) throw new Error("User not authenticated");
			return updateUserProgress(topicId, user.id, currentStage);
		},
		onSuccess: () => {
			if (!user) throw new Error("User not authenticated");
			queryClient.invalidateQueries({
				queryKey: ["user-progress", topicId, user.id],
			});
		},
	});
}
