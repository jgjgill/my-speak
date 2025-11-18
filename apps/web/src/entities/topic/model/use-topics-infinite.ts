"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { getTopics, type TopicsQueryParams } from "../api";

export function useTopicsInfinite(props: Omit<TopicsQueryParams, "page"> = {}) {
	const queryKey = ["topics", "infinite", props];

	return useSuspenseInfiniteQuery({
		queryKey,
		queryFn: ({ pageParam = 0 }) =>
			getTopics({
				...props,
				page: pageParam,
			}),
		getNextPageParam: (lastPage) =>
			lastPage.hasMore ? lastPage.currentPage + 1 : undefined,
		initialPageParam: 0,
	});
}
