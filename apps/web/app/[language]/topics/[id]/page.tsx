import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";
import { getCurrentUser } from "../../../utils/auth/server";
import { createClient } from "../../../utils/supabase/server";
import TopicClientWrapperSkeleton from "./components/skeletons/topic-client-wrapper-skeleton";
import TopicHeaderSkeleton from "./components/skeletons/topic-header-skeleton";
import TopicClientWrapper from "./components/topic-client-wrapper";
import TopicHeader from "./components/topic-header";
import { getEmptyUserSelectedPoints } from "./hooks/use-stage-one-public-data";
import {
	getEnglishScripts,
	getKeywordSpeeches,
	getKoreanScripts,
	getLearningPoints,
	getUserSelectedPoints,
} from "./queries/stage-queries";
import { getTopic } from "./queries/topic-info-queries";

type Props = {
	params: Promise<{ id: string }>;
};

export default async function TopicDetailPage({ params }: Props) {
	const { id } = await params;
	const currentUser = await getCurrentUser();
	const supabase = await createClient();

	const queryClient = new QueryClient();

	const getUserProgress = async () => {
		if (!currentUser) return 1;

		const { data, error } = await supabase
			.from("user_progress")
			.select("current_stage")
			.eq("user_id", currentUser.id)
			.eq("topic_id", id)
			.maybeSingle();

		if (error) throw error;
		return data?.current_stage || 1;
	};

	const getGuestProgress = async () => 1;

	await queryClient.prefetchQuery({
		queryKey: ["topic", id],
		queryFn: () => getTopic(id, supabase),
	});

	await Promise.all([
		queryClient.prefetchQuery({
			queryKey: ["korean-scripts", id],
			queryFn: () => getKoreanScripts(id, supabase),
		}),

		queryClient.prefetchQuery({
			queryKey: ["english-scripts", id],
			queryFn: () => getEnglishScripts(id, supabase),
		}),

		queryClient.prefetchQuery({
			queryKey: ["learning-points", id],
			queryFn: () => getLearningPoints(id, supabase),
		}),

		queryClient.prefetchQuery({
			queryKey: [
				"user-selected-points",
				id,
				currentUser ? currentUser.id : "guest",
			],
			queryFn: currentUser
				? () => getUserSelectedPoints(id, currentUser, supabase)
				: getEmptyUserSelectedPoints,
		}),
		queryClient.prefetchQuery({
			queryKey: ["user-progress", id, currentUser ? currentUser.id : "guest"],
			queryFn: currentUser ? getUserProgress : getGuestProgress,
		}),
		queryClient.prefetchQuery({
			queryKey: ["keyword-speeches", id],
			queryFn: () => getKeywordSpeeches(id, supabase),
		}),
	]);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className="p-4">
				<Suspense fallback={<TopicHeaderSkeleton />}>
					<TopicHeader topicId={id} />
				</Suspense>

				<Suspense fallback={<TopicClientWrapperSkeleton />}>
					<TopicClientWrapper topicId={id} />
				</Suspense>
			</div>
		</HydrationBoundary>
	);
}
