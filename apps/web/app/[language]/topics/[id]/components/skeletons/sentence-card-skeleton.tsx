export default function SentenceCardSkeleton() {
	return (
		<div className="border rounded-lg p-4 animate-pulse">
			{/* 문장 번호 */}
			<div className="flex items-center gap-2 mb-4">
				<div className="w-6 h-6 bg-gray-200 rounded-full" />
				<div className="h-4 bg-gray-200 rounded w-12" />
			</div>

			{/* 한글 문장 */}
			<div className="h-6 bg-gray-200 rounded w-full mb-4" />

			{/* 번역 입력 영역 */}
			<div className="space-y-2 mb-4">
				<div className="h-4 bg-gray-200 rounded w-32" />
				<div className="flex gap-2">
					<div className="flex-1 h-10 bg-gray-200 rounded" />
					<div className="h-10 w-16 bg-gray-200 rounded" />
				</div>
			</div>
		</div>
	);
}
