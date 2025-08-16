import SentenceCardSkeleton from "./sentence-card-skeleton";

export default function PracticeContentSkeleton() {
	return (
		<div className="space-y-4" aria-live="polite" aria-busy="true">
			<div className="flex justify-between items-center mb-4">
				<div className="h-6 bg-gray-200 rounded animate-pulse w-32" />
				<div className="h-5 bg-gray-200 rounded animate-pulse w-24" />
			</div>

			<div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded">
				<div className="h-5 bg-gray-200 rounded animate-pulse w-28 mb-2" />
				<div className="flex flex-wrap gap-4">
					<div className="flex items-center gap-2">
						<div className="h-7 bg-gray-200 rounded animate-pulse w-24" />
						<div className="h-4 bg-gray-200 rounded animate-pulse w-40" />
					</div>
					<div className="flex items-center gap-2">
						<div className="h-7 bg-gray-200 rounded animate-pulse w-28" />
						<div className="h-4 bg-gray-200 rounded animate-pulse w-48" />
					</div>
				</div>
			</div>

			{[1, 2, 3].map((index) => (
				<SentenceCardSkeleton key={index} />
			))}
		</div>
	);
}
