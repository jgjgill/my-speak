"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTopicsInfinite } from "../hooks/use-topics-infinite";
import { TopicCard } from "./topic-card";

export function TopicsList() {
	const params = useParams();
	const language = params.language as string;
	const queryClient = useQueryClient();

	console.log('🔍 [TopicsList] Component rendered');
	console.log('🔍 [TopicsList] Params:', params);
	console.log('🔍 [TopicsList] Language extracted:', language);
	console.log('🔍 [TopicsList] Props to hook:', { language });

	// 캐시 상태 확인
	const queryKey = ["topics", "infinite", { language }];
	const cacheData = queryClient.getQueryData(queryKey);
	const queryState = queryClient.getQueryState(queryKey);

	console.log('🔍 [TopicsList] Cache data exists:', !!cacheData);
	console.log('🔍 [TopicsList] Cache data:', cacheData);
	console.log('🔍 [TopicsList] Query state:', queryState);
	console.log('🔍 [TopicsList] All cached queries:',
		queryClient.getQueryCache().getAll().map(q => ({
			queryKey: q.queryKey,
			state: q.state.status,
			dataUpdatedAt: q.state.dataUpdatedAt
		}))
	);

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useTopicsInfinite({ language });
	const loadMoreRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage();
				}
			},
			{ threshold: 0.1 },
		);

		const currentRef = loadMoreRef.current;
		if (currentRef) {
			observer.observe(currentRef);
		}

		return () => {
			if (currentRef) {
				observer.unobserve(currentRef);
			}
		};
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	const allTopics = data.pages.flatMap((page) => page.topics);

	return (
		<div>
			{/* 주제 카드 그리드 */}
			<div className="space-y-4">
				{allTopics.map((topic) => (
					<TopicCard key={topic.id} topic={topic} />
				))}
			</div>

			{/* 빈 상태 */}
			{allTopics.length === 0 && (
				<div className="text-center py-12">
					<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white flex items-center justify-center">
						<svg
							className="w-8 h-8 text-gray-400"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<title>빈 상태 아이콘</title>
							<path
								fillRule="evenodd"
								d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
					<h3 className="text-heading font-semibold text-korean mb-2">
						아직 등록된 주제가 없습니다
					</h3>
					<p className="text-body text-gray-500">
						새로운 학습 주제가 곧 추가될 예정입니다
					</p>
				</div>
			)}

			{/* 무한 스크롤 로딩 */}
			<div ref={loadMoreRef} className="h-4">
				{isFetchingNextPage && (
					<div className="text-center py-8">
						<div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
						<p className="mt-3 text-body text-gray-500">
							더 많은 주제를 불러오는 중...
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
