import type { User } from "@supabase/supabase-js";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getStageThreeData } from "../queries/stage-three-queries";

export function useStageThreeData(topicId: string, user: User | null) {
	return useSuspenseQuery({
		queryKey: ["stage-three-data", topicId, user ? user.id : "guest"],
		queryFn: () => getStageThreeData(topicId, user),
	});
}
