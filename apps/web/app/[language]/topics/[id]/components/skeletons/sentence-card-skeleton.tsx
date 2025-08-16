export default function SentenceCardSkeleton() {
	return (
		<div className="mb-6 p-4 border rounded">
			<div className="flex justify-between items-start mb-2">
				<div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
			</div>

			<div className="mb-3">
				<div className="h-6 bg-gray-200 rounded animate-pulse w-full mb-2" />
				<div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
			</div>

			<div className="space-y-3">
				<div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
				<div className="flex gap-2">
					<div className="flex-1 h-10 bg-gray-200 rounded animate-pulse" />
					<div className="h-10 w-16 bg-gray-200 rounded animate-pulse" />
				</div>
			</div>
		</div>
	);
}
