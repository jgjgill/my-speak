"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { type LanguageCode, languageInfo } from "@/shared/config/languages";
import type { TopicWithHighlight } from "../api";

interface TopicCardProps {
	topic: TopicWithHighlight;
	isCompleted?: boolean;
	completionPercentage?: number;
}

export function TopicCard({
	topic,
	isCompleted = false,
	completionPercentage = 0,
}: TopicCardProps) {
	const params = useParams();
	const language = params?.language as string;

	const currentLanguage = languageInfo[language as LanguageCode];

	return (
		<Link key={topic.id} href={`/${language}/topics/${topic.id}`}>
			<div
				className={`topic-card mb-6 ${isCompleted ? "topic-card-completed" : ""}`}
			>
				{completionPercentage > 0 && (
					<div className="progress-bar mb-4">
						<div
							className="progress-fill"
							style={{ width: `${completionPercentage}%` }}
						/>
					</div>
				)}

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

				<div className="flex flex-wrap gap-2 mb-3">
					<span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-light text-primary border border-primary-light">
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

				{topic.description && (
					<p className="text-body text-gray-700 mb-4 leading-relaxed">
						{topic.description}
					</p>
				)}

				{topic.highlight_sentences && (
					<div className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-400 p-3 mb-4 rounded-r-lg">
						<div className="flex items-start gap-3">
							<div className="flex-shrink-0 w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
								<svg
									className="w-3 h-3 text-orange-600"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<title>하이라이트 아이콘</title>
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
								</svg>
							</div>
							<div className="flex-1">
								<p className="text-sm font-medium text-gray-800 leading-relaxed">
									💬 "{topic.highlight_sentences.korean_text}"
								</p>
								<p className="text-xs text-orange-600 font-medium mt-1">
									이 표현을 {currentLanguage?.name || "외국어"}로 하면?
								</p>
							</div>
						</div>
					</div>
				)}

				<div className="flex items-center justify-between pt-3 border-t border-gray-100">
					<div className="text-caption text-gray-500">
						{new Date(topic.created_at).toLocaleDateString("ko-KR")}
					</div>

					{/* @todo 학습 진행률 */}
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
