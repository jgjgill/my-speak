"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { getTopics, type TopicsQueryParams } from "../queries/topics-queries";

export function useTopicsInfinite(props: Omit<TopicsQueryParams, "page"> = {}) {
	const queryKey = ["topics", "infinite", props];

	console.log('🔍 [useTopicsInfinite] Hook called with props:', props);
	console.log('🔍 [useTopicsInfinite] Generated query key:', queryKey);
	console.log('🔍 [useTopicsInfinite] Timestamp:', new Date().toISOString());

	return useSuspenseInfiniteQuery({
		queryKey,
		queryFn: ({ pageParam = 0 }) => {
			console.log('🔍 [useTopicsInfinite] QueryFn executed with pageParam:', pageParam);
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
