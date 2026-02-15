import { useSuspenseQuery } from "@tanstack/react-query";
import { getKeywordSpeeches } from "@/entities/topic";
import { topicContentKeys } from "@/shared/api/query-keys";

export function useStageFourData(topicId: string, language: string) {
	return useSuspenseQuery({
		queryKey: topicContentKeys.keywordSpeeches(topicId, language),
		queryFn: () => getKeywordSpeeches(topicId, language),
	});
}
