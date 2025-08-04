import type { Tables } from "@repo/typescript-config/supabase-types";

type Topic = Tables<"topics">;

interface TopicHeaderProps {
	topic: Topic;
}

export default function TopicHeader({ topic }: TopicHeaderProps) {
	return (
		<div className="mb-6">
			<h1 className="text-2xl font-bold mb-2">{topic.title}</h1>
			<div className="mb-2">
				<span className="mr-2">{topic.category}</span>
				<span className="mr-2">{topic.difficulty}</span>
				<span>총 {topic.total_sentences}문장</span>
			</div>
			{topic.description && <p className="mb-4">{topic.description}</p>}
		</div>
	);
}