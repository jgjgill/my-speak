import type { User } from "@supabase/supabase-js";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getStageTwoData } from "../queries/stage-two-queries";

export function useStageTwoData(topicId: string, user: User | null) {
	return useSuspenseQuery({
		queryKey: ["stage-two-data", topicId, user ? user.id : "guest"],
		queryFn: () => getStageTwoData(topicId, user),
	});
}
