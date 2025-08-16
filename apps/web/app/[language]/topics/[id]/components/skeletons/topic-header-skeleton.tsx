export default function TopicHeaderSkeleton() {
	return (
		<output className="mb-6" aria-label="주제 정보 로딩 중">
			<div className="h-8 bg-gray-200 rounded animate-pulse mb-2 w-3/4" />

			<div className="mb-2 flex gap-4">
				<div className="h-5 bg-gray-200 rounded animate-pulse w-16" />
				<div className="h-5 bg-gray-200 rounded animate-pulse w-12" />
				<div className="h-5 bg-gray-200 rounded animate-pulse w-20" />
			</div>

			<div className="space-y-2">
				<div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
				<div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
			</div>
		</output>
	);
}
