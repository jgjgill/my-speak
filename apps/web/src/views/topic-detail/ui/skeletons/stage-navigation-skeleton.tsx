export default function StageNavigationSkeleton() {
	return (
		<div className="mb-8" aria-live="polite" aria-busy="true">
			<div className="grid grid-cols-2 gap-4 place-items-center sm:flex sm:items-center sm:justify-center sm:gap-0">
				{[1, 2, 3, 4].map((stage, index) => (
					<div key={stage} className="flex items-center">
						<div className="flex flex-col items-center animate-pulse">
							{/* 원형 버튼 스켈레톤 */}
							<div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-200 border-4 border-gray-100" />

							{/* 텍스트 스켈레톤 */}
							<div className="mt-2 sm:mt-3 text-center">
								<div className="h-3 sm:h-4 bg-gray-200 rounded mb-1 w-12" />
								<div className="h-2 sm:h-3 bg-gray-200 rounded w-16" />
							</div>
						</div>

						{/* 연결선 스켈레톤 (데스크톱에서만, 마지막 요소 제외) */}
						{index < 3 && (
							<div className="hidden sm:block w-16 h-1 mx-4 bg-gray-200 rounded-full animate-pulse" />
						)}
					</div>
				))}
			</div>
		</div>
	);
}
