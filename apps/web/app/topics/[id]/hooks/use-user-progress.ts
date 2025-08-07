import type { User } from "@supabase/supabase-js";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getUserProgress } from "../queries/user-progress-queries";

export function useUserProgress(topicId: string, user: User | null) {
	return useSuspenseQuery({
		queryKey: ["user-progress", topicId, user?.id],
		queryFn: () => (user ? getUserProgress(topicId, user) : null),
	});
}
