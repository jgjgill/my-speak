import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";
import { createClient } from "../../utils/supabase/server";
import { TopicsList } from "./components/topics-list";
import { TopicsLoading } from "./components/topics-loading";
import { getTopics } from "./queries/topics-queries";

export default async function TopicsPage() {
	const supabase = await createClient();

	const queryClient = new QueryClient();

	await queryClient.prefetchInfiniteQuery({
		queryKey: ["topics", "infinite", {}],
		queryFn: ({ pageParam = 0 }) => getTopics({ page: pageParam }, supabase),
		initialPageParam: 0,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Suspense fallback={<TopicsLoading />}>
				<TopicsList />
			</Suspense>
		</HydrationBoundary>
	);
}
