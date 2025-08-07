import type { Tables } from "@repo/typescript-config/supabase-types";
import { createClient } from "../../../utils/supabase/client";

type UserProgress = Tables<"user_progress">;

export async function updateUserProgress(
	topicId: string,
	userId: string,
	currentStage: number,
): Promise<UserProgress> {
	const supabase = createClient();

	const { data, error } = await supabase
		.from("user_progress")
		.upsert(
			{
				user_id: userId,
				topic_id: topicId,
				current_stage: currentStage,
			},
			{ onConflict: "user_id,topic_id" },
		)
		.select()
		.single();

	if (error) throw error;
	return data;
}
