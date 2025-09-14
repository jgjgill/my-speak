export function TopicsLoading() {
	return (
		<div className="space-y-4">
			{Array.from({ length: 5 }, (_, index) => {
				const uniqueId = `skeleton-card-${Date.now()}-${index}`;

				return (
					<div key={uniqueId} className="topic-card mb-6 animate-pulse">
						{/* 진행률 바 스켈레톤 (선택적) */}
						{/* {index === 1 && (
							<div className="h-2 bg-gray-200 rounded-full w-full mb-4" />
						)} */}

						{/* 헤더 영역 */}
						<div className="flex items-start justify-between mb-3">
							<div className="h-5 bg-gray-200 rounded w-3/4" />
							{index === 0 && (
								<div className="h-6 bg-gray-200 rounded w-12" />
							)}
						</div>

						{/* 메타데이터 태그들 */}
						<div className="flex flex-wrap gap-2 mb-3">
							<div className="h-6 bg-gray-200 rounded-full w-16" />
							<div className="h-6 bg-gray-200 rounded-full w-12" />
							<div className="h-6 bg-gray-200 rounded-full w-20" />
						</div>

						{/* 설명 영역 */}
						<div className="mb-4">
							<div className="h-4 bg-gray-200 rounded w-full mb-2" />
							<div className="h-4 bg-gray-200 rounded w-5/6 mb-2" />
							<div className="h-4 bg-gray-200 rounded w-2/3" />
						</div>

						{/* 하이라이트 문장 영역 */}
						{
							<div className="bg-gray-200 p-3 mb-4 rounded-r-lg">
								<div className="flex items-start gap-3">
									<div className="w-5 h-5 bg-gray-200 rounded-full flex-shrink-0" />
									<div className="flex-1">
										<div className="h-4 bg-gray-200 rounded w-full mb-1" />
										<div className="h-3 bg-gray-200 rounded w-32" />
									</div>
								</div>
							</div>
						}

						{/* 하단 정보 영역 */}
						<div className="flex items-center justify-between pt-3 border-t border-gray-100">
							<div className="h-3 bg-gray-200 rounded w-24" />
							<div className="flex items-center gap-2">
								{index === 1 && (
									<div className="h-3 bg-gray-200 rounded w-16" />
								)}
								<div className="h-4 w-4 bg-gray-200 rounded" />
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
