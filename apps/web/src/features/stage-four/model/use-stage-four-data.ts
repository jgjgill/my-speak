import { useSuspenseQuery } from "@tanstack/react-query";
import { getKeywordSpeeches } from "@/entities/topic";

export function useStageFourData(topicId: string, language: string) {
	return useSuspenseQuery({
		queryKey: ["keyword-speeches", topicId, language],
		queryFn: () => getKeywordSpeeches(topicId, language),
	});
}
