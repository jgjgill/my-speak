import type { Tables } from "@repo/typescript-config/supabase-types";
import { createBrowserClient } from "@/shared/api/supabase";

type UserSelectedPoint = Tables<"user_selected_points">;

export interface ToggleLearningPointParams {
	userId: string;
	topicId: string;
	learningPointId: string;
}

export async function addLearningPoint(
	params: ToggleLearningPointParams,
): Promise<UserSelectedPoint> {
	const supabase = createBrowserClient();

	const { data, error } = await supabase
		.from("user_selected_points")
		.insert({
			user_id: params.userId,
			topic_id: params.topicId,
			learning_point_id: params.learningPointId,
		})
		.select()
		.single();

	if (error) throw error;
	return data;
}

export async function removeLearningPoint(
	params: ToggleLearningPointParams,
): Promise<void> {
	const supabase = createBrowserClient();

	const { error } = await supabase
		.from("user_selected_points")
		.delete()
		.eq("user_id", params.userId)
		.eq("learning_point_id", params.learningPointId);

	if (error) throw error;
}
