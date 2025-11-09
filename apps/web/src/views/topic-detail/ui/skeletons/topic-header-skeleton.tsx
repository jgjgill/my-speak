export default function TopicHeaderSkeleton() {
	return (
		<div className="mb-6" aria-live="polite" aria-busy="true">
			<div className="h-8 bg-gray-200 rounded animate-pulse mb-2 w-3/4" />

			<div className="mb-2">
				<span className="mr-2">
					<div className="h-5 bg-gray-200 rounded animate-pulse w-16 inline-block" />
				</span>
				<span className="mr-2">
					<div className="h-5 bg-gray-200 rounded animate-pulse w-12 inline-block" />
				</span>
				<span>
					<div className="h-5 bg-gray-200 rounded animate-pulse w-20 inline-block" />
				</span>
			</div>

			<div className="h-4 bg-gray-200 rounded animate-pulse w-full mb-4" />
		</div>
	);
}
