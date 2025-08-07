import { Suspense } from "react";
import { createClient } from "../../utils/supabase/server";
import TopicClientWrapper from "./components/topic-client-wrapper";
import TopicHeader from "./components/topic-header";

type Props = {
	params: Promise<{ id: string }>;
};

export default async function TopicDetailPage({ params }: Props) {
	const { id } = await params;
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	let initialStage = 1;
	if (user) {
		const { data: progressData } = await supabase
			.from("user_progress")
			.select("current_stage")
			.eq("user_id", user.id)
			.eq("topic_id", id)
			.single();

		initialStage = progressData?.current_stage || 1;
	}

	return (
		<div className="p-4">
			<Suspense
				fallback={
					<div className="mb-6 h-20 animate-pulse bg-gray-200 rounded" />
				}
			>
				<TopicHeader topicId={id} />
			</Suspense>

			<Suspense
				fallback={<div className="border p-4 mb-6">학습 단계 로딩 중...</div>}
			>
				<TopicClientWrapper topicId={id} initialStage={initialStage} />
			</Suspense>
		</div>
	);
}
