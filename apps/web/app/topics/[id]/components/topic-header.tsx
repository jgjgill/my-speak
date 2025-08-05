import { notFound } from "next/navigation";
import { createClient } from "../../../utils/supabase/server";

interface TopicHeaderProps {
	topicId: string;
}

export default async function TopicHeader({ topicId }: TopicHeaderProps) {
	const supabase = await createClient();

	const { data: topic, error: topicError } = await supabase
		.from("topics")
		.select("*")
		.eq("id", topicId)
		.single();

	if (topicError || !topic) {
		notFound();
	}

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
