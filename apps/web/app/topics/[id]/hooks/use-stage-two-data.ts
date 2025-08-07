import type { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { getStageTwoData } from "../queries/stage-two-queries";

export function useStageTwoData(topicId: string, user: User | null) {
	return useQuery({
		queryKey: ["stage-two-data", topicId, user?.id],
		queryFn: () => getStageTwoData(topicId, user),
		enabled: !!topicId,
	});
}