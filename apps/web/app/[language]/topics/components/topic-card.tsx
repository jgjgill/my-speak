import Link from "next/link";
import { useParams } from "next/navigation";
import type { Topic } from "../queries/topics-queries";

interface TopicCardProps {
	topic: Topic;
	isCompleted?: boolean;
	completionPercentage?: number;
}

export function TopicCard({
	topic,
	isCompleted = false,
	completionPercentage = 0,
}: TopicCardProps) {
	const { language } = useParams();

	return (
		<Link key={topic.id} href={`/${language}/topics/${topic.id}`}>
			<div
				className={`topic-card mb-6 ${isCompleted ? "topic-card-completed" : ""}`}
			>
				{/* 진행률 표시 바 */}
				{completionPercentage > 0 && (
					<div className="progress-bar mb-4">
						<div
							className="progress-fill"
							style={{ width: `${completionPercentage}%` }}
						/>
					</div>
				)}

				{/* 헤더 영역 */}
				<div className="flex items-start justify-between mb-3">
					<h2 className="text-heading font-semibold text-korean flex-1 pr-3">
						{topic.title}
					</h2>
					{isCompleted && (
						<div className="feedback-correct px-2 py-1 text-xs font-medium">
							완료
						</div>
					)}
				</div>

				{/* 메타데이터 영역 */}
				<div className="flex flex-wrap gap-2 mb-3">
					<span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200">
						{topic.category}
					</span>
					<span
						className={`px-3 py-1 text-xs font-medium rounded-full border ${
							topic.difficulty === "초급"
								? "bg-green-50 text-green-700 border-green-200"
								: topic.difficulty === "중급"
									? "bg-yellow-50 text-yellow-700 border-yellow-200"
									: "bg-red-50 text-red-700 border-red-200"
						}`}
					>
						{topic.difficulty}
					</span>
					<span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-50 text-gray-600 border border-gray-200">
						{topic.total_sentences}문장
					</span>
				</div>

				{/* 설명 영역 */}
				{topic.description && (
					<p className="text-body text-gray-700 mb-4 leading-relaxed">
						{topic.description}
					</p>
				)}

				{/* 하단 정보 영역 */}
				<div className="flex items-center justify-between pt-3 border-t border-gray-100">
					<div className="text-caption text-gray-500">
						생성일: {new Date(topic.created_at).toLocaleDateString("ko-KR")}
					</div>

					{/* 학습 진행 상태 */}
					<div className="flex items-center gap-2">
						{completionPercentage > 0 && (
							<span className="text-caption font-medium text-target-language">
								{completionPercentage}% 완료
							</span>
						)}
						<svg
							className="w-4 h-4 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>학습 시작 화살표</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</div>
				</div>
			</div>
		</Link>
	);
}
