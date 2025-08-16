import { useSuspenseQuery } from "@tanstack/react-query";
import { getStageFourData } from "../queries/stage-four-queries";

export function useStageFourData(topicId: string) {
	return useSuspenseQuery({
		queryKey: ["stage-four-data", topicId],
		queryFn: () => getStageFourData(topicId),
	});
}
