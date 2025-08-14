import type { User } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProgress } from "../mutations/user-progress-mutations";

export function useUpdateUserProgress(topicId: string, user: User | null) {
	if (!user) {
		throw new Error("User not authenticated");
	}

	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (currentStage: number) => {
			return updateUserProgress(topicId, user.id, currentStage);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["user-progress", topicId, user.id],
			});
		},
	});
}
