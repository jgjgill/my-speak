export function TopicsLoading() {
	return (
		<div>
			{/* 필터 컨트롤 스켈레톤 */}
			<div className="mb-4 animate-pulse border-b border-gray-200 pb-4">
				<div className="flex flex-wrap items-start gap-x-6 gap-y-4">
					{/* 정렬 스켈레톤 */}
					<div className="flex items-center gap-2">
						<div className="h-4 w-8 rounded bg-gray-200" />
						<div className="flex gap-1.5">
							<div className="h-9 w-16 rounded-full bg-gray-200" />
							<div className="h-9 w-20 rounded-full bg-gray-200" />
							<div className="h-9 w-24 rounded-full bg-gray-200" />
							<div className="h-9 w-24 rounded-full bg-gray-200" />
						</div>
					</div>

					{/* 난이도 스켈레톤 */}
					<div className="flex items-center gap-2">
						<div className="h-4 w-10 rounded bg-gray-200" />
						<div className="flex gap-1.5">
							<div className="h-9 w-12 rounded-full bg-gray-200" />
							<div className="h-9 w-12 rounded-full bg-gray-200" />
							<div className="h-9 w-12 rounded-full bg-gray-200" />
						</div>
					</div>

					{/* 풀이 현황 스켈레톤 (조건부) */}
					<div className="flex items-center gap-2">
						<div className="h-4 w-16 rounded bg-gray-200" />
						<div className="flex gap-1.5">
							<div className="h-9 w-12 rounded-full bg-gray-200" />
							<div className="h-9 w-14 rounded-full bg-gray-200" />
							<div className="h-9 w-14 rounded-full bg-gray-200" />
							<div className="h-9 w-12 rounded-full bg-gray-200" />
						</div>
					</div>
				</div>
			</div>

			{/* Topic 카드 스켈레톤 */}
			<div className="space-y-4">
				{Array.from({ length: 5 }, (_, index) => {
					const uniqueId = `skeleton-card-${Date.now()}-${index}`;

					return (
						<div key={uniqueId} className="topic-card mb-6 animate-pulse">
							{/* 헤더 영역 */}
							<div className="mb-3 flex items-start justify-between">
								<div className="h-5 w-3/4 rounded bg-gray-200" />
								{index === 0 && <div className="h-6 w-12 rounded bg-gray-200" />}
							</div>

							{/* 메타데이터 태그들 */}
							<div className="mb-3 flex flex-wrap gap-2">
								<div className="h-6 w-16 rounded-full bg-gray-200" />
								<div className="h-6 w-12 rounded-full bg-gray-200" />
								<div className="h-6 w-20 rounded-full bg-gray-200" />
							</div>

							{/* 설명 영역 */}
							<div className="mb-4">
								<div className="mb-2 h-4 w-full rounded bg-gray-200" />
								<div className="mb-2 h-4 w-5/6 rounded bg-gray-200" />
								<div className="h-4 w-2/3 rounded bg-gray-200" />
							</div>

							{/* 하이라이트 문장 영역 */}
							{
								<div className="mb-4 rounded-r-lg bg-gray-200 p-3">
									<div className="flex items-start gap-3">
										<div className="h-5 w-5 flex-shrink-0 rounded-full bg-gray-200" />
										<div className="flex-1">
											<div className="mb-1 h-4 w-full rounded bg-gray-200" />
											<div className="h-3 w-32 rounded bg-gray-200" />
										</div>
									</div>
								</div>
							}

							{/* 하단 정보 영역 */}
							<div className="flex items-center justify-between border-t border-gray-100 pt-3">
								<div className="h-3 w-24 rounded bg-gray-200" />
								<div className="flex items-center gap-2">
									{index === 1 && (
										<div className="h-3 w-16 rounded bg-gray-200" />
									)}
									<div className="h-4 w-4 rounded bg-gray-200" />
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
