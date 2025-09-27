"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { getTopics, type TopicsQueryParams } from "../queries/topics-queries";

export function useTopicsInfinite(props: Omit<TopicsQueryParams, "page"> = {}) {
	const queryKey = ["topics", "infinite", props];

	return useSuspenseInfiniteQuery({
		queryKey,
		queryFn: ({ pageParam = 0 }) => {
			return getTopics({
				limit: props.limit,
				page: pageParam,
				language: props.language,
			});
		},
		getNextPageParam: (lastPage) =>
			lastPage.hasMore ? lastPage.currentPage + 1 : undefined,
		initialPageParam: 0,
	});
}
