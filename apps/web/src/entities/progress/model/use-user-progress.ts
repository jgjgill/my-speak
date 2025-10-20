import type { User } from "@supabase/supabase-js";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getGuestProgress, getUserProgress } from "../api";

export function useUserProgress(topicId: string, user: User | null) {
	return useSuspenseQuery({
		queryKey: ["user-progress", topicId, user ? user.id : "guest"],
		queryFn: user
			? async () => {
					const progress = await getUserProgress(topicId, user);
					return progress?.current_stage || 1;
				}
			: getGuestProgress,
	});
}
