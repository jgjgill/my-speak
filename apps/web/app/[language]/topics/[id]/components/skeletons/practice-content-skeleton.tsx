export default function PracticeContentSkeleton() {
	return (
		<div className="animate-pulse" aria-live="polite" aria-busy="true">
			<div className="topic-card mb-6">
				{/* 1단계 헤더 스켈레톤 */}
				<div className="flex items-center gap-3 mb-6">
					<div className="w-8 h-8 bg-gray-200 rounded-full" />
					<div className="h-6 bg-gray-200 rounded w-24" />
				</div>

				{/* 전체 스크립트 영역 스켈레톤 */}
				<div className="mb-6">
					<div className="flex items-center gap-2 mb-3">
						<div className="w-2 h-2 bg-gray-200 rounded-full" />
						<div className="h-5 bg-gray-200 rounded w-40" />
					</div>
					<div className="bg-gray-100 rounded-lg p-4">
						<div className="space-y-2">
							<div className="h-4 bg-gray-200 rounded w-full" />
							<div className="h-4 bg-gray-200 rounded w-5/6" />
							<div className="h-4 bg-gray-200 rounded w-4/5" />
							<div className="h-4 bg-gray-200 rounded w-3/4" />
						</div>
					</div>
				</div>

				{/* 미션 안내 스켈레톤 */}
				<div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
					<div className="flex items-start gap-3">
						<div className="w-6 h-6 bg-gray-200 rounded-full mt-0.5" />
						<div className="flex-1">
							<div className="h-4 bg-gray-200 rounded w-20 mb-1" />
							<div className="space-y-1">
								<div className="h-3 bg-gray-200 rounded w-full" />
								<div className="h-3 bg-gray-200 rounded w-3/4" />
							</div>
						</div>
					</div>
				</div>

				{/* 문장별 번역 연습 섹션 */}
				<div className="mb-6">
					<div className="flex justify-between items-center mb-2">
						<div className="h-4 bg-gray-200 rounded w-32" />
						<div className="h-4 bg-gray-200 rounded w-16" />
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2 mb-6" />

					{/* 학습 포인트 안내 */}
					<div className="mb-6">
						<div className="h-4 bg-gray-200 rounded w-32 mb-3" />
						<div className="flex flex-wrap gap-2">
							<div className="h-8 bg-gray-200 rounded-full w-24" />
							<div className="h-8 bg-gray-200 rounded-full w-28" />
						</div>
					</div>

					{/* 문장 카드 스켈레톤 */}
					<div className="space-y-6">
						{[1, 2, 3].map((index) => (
							<div
								key={index}
								className="bg-white rounded-lg border border-gray-200 p-4"
							>
								{/* 문장 번호 */}
								<div className="flex items-center gap-2 mb-4">
									<div className="w-6 h-6 bg-gray-200 rounded-full" />
									<div className="h-4 bg-gray-200 rounded w-12" />
								</div>

								{/* 한글 문장 */}
								<div className="mb-4">
									<div className="h-6 bg-gray-200 rounded w-full mb-1" />
									<div className="h-6 bg-gray-200 rounded w-2/3" />
								</div>

								{/* 번역 입력 영역 */}
								<div className="space-y-2">
									<div className="h-4 bg-gray-200 rounded w-32" />
									<div className="flex gap-2">
										<div className="flex-1">
											<div className="h-10 bg-gray-50 border border-gray-200 rounded px-3 py-2">
												<div className="h-4 bg-gray-200 rounded w-32" />
											</div>
										</div>
										<div className="h-10 w-16 bg-gray-200 rounded" />
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
