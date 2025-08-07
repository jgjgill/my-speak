import { Suspense } from "react";
import { createClient } from "../../utils/supabase/server";
import StageNavigation from "./components/stage-navigation";
import StageOneContainer from "./components/stage-one-container";
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

	// 로그인 사용자의 초기 단계 조회
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

			<StageNavigation currentStage={initialStage} />

			<Suspense
				fallback={<div className="border p-4 mb-6">1단계 로딩 중...</div>}
			>
				<StageOneContainer topicId={id} user={user} />
			</Suspense>
		</div>
	);
}
