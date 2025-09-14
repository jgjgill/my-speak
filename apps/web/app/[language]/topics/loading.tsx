import { TopicsLoading } from "./components/topics-loading";

export default function Loading() {
	return (
		<div className="min-h-screen">
			{/* 헤더 스켈레톤 */}
			<div>
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center gap-3 animate-pulse">
						<div>
							<div className="h-6 bg-gray-200 rounded w-48 mb-1" />
							<div className="h-4 bg-gray-200 rounded w-32" />
						</div>
					</div>
				</div>
			</div>

			{/* 콘텐츠 스켈레톤 */}
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<TopicsLoading />
			</div>
		</div>
	);
}
