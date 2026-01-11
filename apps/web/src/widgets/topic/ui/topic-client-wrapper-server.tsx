import { getUserProgress } from "@/entities/progress";
import { createClient } from "@/shared/api/supabase/server";
import { getCurrentUser } from "@/shared/lib/auth/server";
import TopicClientWrapper from "./topic-client-wrapper";

interface TopicClientWrapperServerProps {
	topicId: string;
	language: string;
}

/**
 * Server Component wrapper for TopicClientWrapper
 * - Fetches user progress data on the server
 * - Passes initial data to client component to prevent hydration mismatch
 * - Ensures SEO-friendly server-side rendering
 */
export default async function TopicClientWrapperServer({
	topicId,
	language,
}: TopicClientWrapperServerProps) {
	const currentUser = await getCurrentUser();
	const supabase = await createClient();

	// Fetch progress data on server to ensure consistent initial render
	const initialMaxStage = currentUser
		? await getUserProgress(topicId, language, currentUser, supabase).then(
				(res) => res?.current_stage || 1,
			)
		: 1; // Guest users always start at stage 1

	return (
		<TopicClientWrapper topicId={topicId} initialMaxStage={initialMaxStage} />
	);
}
