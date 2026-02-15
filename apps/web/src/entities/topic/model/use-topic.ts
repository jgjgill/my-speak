import { useSuspenseQuery } from "@tanstack/react-query";
import { topicKeys } from "@/shared/api/query-keys";
import { getTopic } from "../api/topic-queries";

export function useTopic(topicId: string, language: string) {
	return useSuspenseQuery({
		queryKey: topicKeys.detail(topicId, language),
		queryFn: () => getTopic(topicId, language),
	});
}
