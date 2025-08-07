import type { Tables } from "@repo/typescript-config/supabase-types";
import Link from "next/link";
import { createClient } from "../utils/supabase/server";

type Topic = Tables<"topics">;

export default async function TopicsPage() {
	const supabase = await createClient();

	const { data: topics, error } = await supabase
		.from("topics")
		.select("*")
		.order("created_at", { ascending: false });

	if (error) {
		return <div className="p-4">Error: {error.message}</div>;
	}

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">학습 주제 목록</h1>

			{topics?.map((topic: Topic) => (
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
			))}

			{topics?.length === 0 && (
				<p className="text-gray-500">아직 등록된 주제가 없습니다.</p>
			)}
		</div>
	);
}
