import { useSuspenseQuery } from "@tanstack/react-query";
import { getKeywordSpeeches } from "@/entities/topic";

export function useStageFourData(topicId: string) {
	return useSuspenseQuery({
		queryKey: ["keyword-speeches", topicId],
		queryFn: () => getKeywordSpeeches(topicId),
	});
}
