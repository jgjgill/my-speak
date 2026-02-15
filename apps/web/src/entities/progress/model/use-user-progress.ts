import type { User } from "@supabase/supabase-js";
import { useSuspenseQuery } from "@tanstack/react-query";
import { userDataKeys } from "@/shared/api/query-keys";
import { getGuestProgress, getUserProgress } from "../api";

export function useUserProgress(
	topicId: string,
	language: string,
	user: User | null,
) {
	return useSuspenseQuery({
		queryKey: userDataKeys.progress(topicId, language, user?.id ?? null),
		queryFn: user
			? async () => {
					const progress = await getUserProgress(topicId, language, user);

					return progress?.current_stage || 1;
				}
			: getGuestProgress,
	});
}
