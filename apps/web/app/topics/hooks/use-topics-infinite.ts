"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { getTopics, type TopicsQueryParams } from "../queries/topics-queries";

export function useTopicsInfinite({
	limit,
}: Omit<TopicsQueryParams, "page"> = {}) {
	return useSuspenseInfiniteQuery({
		queryKey: ["topics", "infinite", limit],
		queryFn: ({ pageParam = 0 }) => getTopics({ limit, page: pageParam }),
		getNextPageParam: (lastPage) =>
			lastPage.hasMore ? lastPage.currentPage + 1 : undefined,
		initialPageParam: 0,
	});
}
