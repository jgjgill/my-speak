export default function Loading() {
	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">학습 주제 목록</h1>

			{Array.from({ length: 5 }, (_, index) => {
				const uniqueId = `skeleton-card-${Date.now()}-${index}`;

				return (
					<div key={uniqueId} className="border p-4 mb-4 rounded animate-pulse">
						<div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />

						<div className="flex gap-2 mb-3">
							<div className="h-5 bg-gray-200 rounded w-16" />
							<div className="h-5 bg-gray-200 rounded w-12" />
							<div className="h-5 bg-gray-200 rounded w-20" />
						</div>

						<div className="h-4 bg-gray-200 rounded w-full mb-2" />
						<div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />

						<div className="h-3 bg-gray-200 rounded w-1/4" />
					</div>
				);
			})}
		</div>
	);
}
