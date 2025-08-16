export default function StageNavigationSkeleton() {
	return (
		<output className="mb-6" aria-label="단계 네비게이션 로딩 중">
			<div className="flex flex-wrap gap-2">
				{[1, 2, 3, 4].map((stage) => (
					<div
						key={stage}
						className="px-4 py-2 rounded-lg border border-gray-200 bg-gray-100 animate-pulse"
					>
						<div className="text-center">
							<div className="h-4 bg-gray-300 rounded mb-1 w-12" />
							<div className="h-3 bg-gray-300 rounded w-16" />
						</div>
					</div>
				))}
			</div>
		</output>
	);
}
