"use client";

import { useTopic } from "../hooks/use-topic";

interface TopicHeaderProps {
	topicId: string;
}

export default function TopicHeader({ topicId }: TopicHeaderProps) {
	const { data: topic } = useTopic(topicId);

	return (
		<div className="mb-6">
			<h1 className="text-heading font-semibold text-korean mb-3">{topic.title}</h1>

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
					총 {topic.total_sentences}문장
				</span>
			</div>

			{topic.description && <p className="text-body text-gray-700 mb-4 leading-relaxed">{topic.description}</p>}
		</div>
	);
}
