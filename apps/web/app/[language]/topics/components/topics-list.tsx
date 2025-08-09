"use client";

import { useEffect, useRef } from "react";
import { useTopicsInfinite } from "../hooks/use-topics-infinite";
import { TopicCard } from "./topic-card";

export function TopicsList() {
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useTopicsInfinite();
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
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">학습 주제 목록</h1>

			{allTopics.map((topic) => (
				<TopicCard key={topic.id} topic={topic} />
			))}

			{allTopics.length === 0 && (
				<p className="text-gray-500">아직 등록된 주제가 없습니다.</p>
			)}

			<div ref={loadMoreRef} className="h-4">
				{isFetchingNextPage && (
					<div className="text-center py-4">
						<div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
						<p className="mt-2 text-gray-500">더 많은 주제를 불러오는 중...</p>
					</div>
				)}
			</div>
		</div>
	);
}
