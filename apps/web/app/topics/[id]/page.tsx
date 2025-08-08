import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";
import { createClient } from "../../utils/supabase/server";
import TopicClientWrapper from "./components/topic-client-wrapper";
import TopicHeader from "./components/topic-header";
import {
	getKoreanScripts,
	getLearningPoints,
} from "./queries/stage-one-queries";
import { getTopic } from "./queries/topic-info-queries";

type Props = {
	params: Promise<{ id: string }>;
};

export default async function TopicDetailPage({ params }: Props) {
	const { id } = await params;
	const supabase = await createClient();

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	const currentUser = authError ? null : user;

	let initialStage = 1;
	if (currentUser) {
		const { data: progressData } = await supabase
			.from("user_progress")
			.select("current_stage")
			.eq("user_id", currentUser.id)
			.eq("topic_id", id)
			.single();

		initialStage = progressData?.current_stage || 1;
	}

	const queryClient = new QueryClient();

	await Promise.all([
		queryClient.prefetchQuery({
			queryKey: ["korean-scripts", id],
			queryFn: () => getKoreanScripts(id, supabase),
		}),
		queryClient.prefetchQuery({
			queryKey: ["learning-points", id],
			queryFn: () => getLearningPoints(id, supabase),
		}),
		queryClient.prefetchQuery({
			queryKey: ["topic", id],
			queryFn: () => getTopic(id, supabase),
		}),
	]);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
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
		</HydrationBoundary>
	);
}
