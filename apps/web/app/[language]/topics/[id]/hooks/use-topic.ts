import { useSuspenseQuery } from "@tanstack/react-query";
import { getTopic } from "../queries/topic-info-queries";

export function useTopic(topicId: string) {
	return useSuspenseQuery({
		queryKey: ["topic", topicId],
		queryFn: () => getTopic(topicId),
	});
}
