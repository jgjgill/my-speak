import { getUserProgress } from "@/entities/progress";
import { createClient } from "@/shared/api/supabase/server";
import { getCurrentUser } from "@/shared/lib/auth/server";
import StageController from "./stage-controller";

interface TopicContainerProps {
	topicId: string;
	language: string;
}

export default async function TopicContainer({
	topicId,
	language,
}: TopicContainerProps) {
	const currentUser = await getCurrentUser();
	const supabase = await createClient();

	const maxAvailableStage = currentUser
		? await getUserProgress(topicId, language, currentUser, supabase).then(
				(res) => res?.current_stage || 1,
			)
		: 1;

	return (
		<StageController
			topicId={topicId}
			language={language}
			maxAvailableStage={maxAvailableStage}
		/>
	);
}
