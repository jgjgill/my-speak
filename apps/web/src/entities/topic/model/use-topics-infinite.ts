"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { topicKeys } from "@/shared/api/query-keys";
import { getTopics, type TopicsQueryParams } from "../api";

export function useTopicsInfinite(props: Omit<TopicsQueryParams, "page"> = {}) {
	const sortedDifficulties = props.filters?.difficulties
		? [...props.filters.difficulties].sort()
		: undefined;

	const queryKey = [
		...topicKeys.infinite(),
		{
			...props,
			filters: props.filters
				? {
						...props.filters,
						difficulties: sortedDifficulties,
					}
				: undefined,
		},
	];

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
		// Always refetch on mount to ensure fresh data after mutations
		refetchOnMount: "always",
	});
}
