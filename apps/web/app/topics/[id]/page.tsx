import { Suspense } from "react";
import { createClient } from "../../utils/supabase/server";
import StageFourContainer from "./components/stage-four-container";
import StageOneContainer from "./components/stage-one-container";
import StageThreeContainer from "./components/stage-three-container";
import StageTwoContainer from "./components/stage-two-container";
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
				fallback={<div className="border p-4 mb-6">1단계 로딩 중...</div>}
			>
				<StageOneContainer topicId={id} user={user} />
			</Suspense>

			<Suspense
				fallback={<div className="border p-4 mb-6">2단계 로딩 중...</div>}
			>
				<StageTwoContainer topicId={id} user={user} />
			</Suspense>

			<Suspense
				fallback={<div className="border p-4 mb-6">3단계 로딩 중...</div>}
			>
				<StageThreeContainer topicId={id} user={user} />
			</Suspense>

			<Suspense
				fallback={<div className="border p-4 mb-6">4단계 로딩 중...</div>}
			>
				<StageFourContainer topicId={id} />
			</Suspense>
		</div>
	);
}
