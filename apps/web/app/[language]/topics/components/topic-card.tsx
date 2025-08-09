import Link from "next/link";
import type { Topic } from "../queries/topics-queries";

interface TopicCardProps {
	topic: Topic;
}

export function TopicCard({ topic }: TopicCardProps) {
	return (
		<Link key={topic.id} href={`/topics/${topic.id}`}>
			<div className="border p-4 mb-4 rounded hover:bg-gray-50 cursor-pointer">
				<h2 className="text-xl font-semibold">{topic.title}</h2>
				<div className="text-sm text-gray-600 mt-2">
					<span className="bg-blue-100 px-2 py-1 rounded mr-2">
						{topic.category}
					</span>
					<span className="bg-green-100 px-2 py-1 rounded mr-2">
						{topic.difficulty}
					</span>
					<span className="text-gray-500">
						총 {topic.total_sentences}문장
					</span>
				</div>
				{topic.description && (
					<p className="mt-2 text-gray-700">{topic.description}</p>
				)}
				<p className="text-xs text-gray-400 mt-2">
					생성일: {new Date(topic.created_at).toLocaleString()}
				</p>
			</div>
		</Link>
	);
}