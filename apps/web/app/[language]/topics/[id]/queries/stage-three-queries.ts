import type { Tables } from "@repo/typescript-config/supabase-types";
import type { User } from "@supabase/supabase-js";
import { createClient } from "../../../../utils/supabase/client";

type KoreanScript = Tables<"korean_scripts">;
type EnglishScript = Tables<"english_scripts">;
type LearningPoint = Tables<"learning_points">;
type UserSelectedPoint = Tables<"user_selected_points">;

export interface StageThreeData {
	koreanScripts: KoreanScript[];
	englishScripts: EnglishScript[];
	learningPoints: LearningPoint[];
	userSelectedPoints: UserSelectedPoint[];
}

export async function getStageThreeData(
	topicId: string,
	user: User | null,
): Promise<StageThreeData> {
	const supabase = createClient();

	const [
		koreanResult,
		englishResult,
		learningPointsResult,
		userSelectedPointsResult,
	] = await Promise.all([
		supabase
			.from("korean_scripts")
			.select("*")
			.eq("topic_id", topicId)
			.order("sentence_order"),

		supabase
			.from("english_scripts")
			.select("*")
			.eq("topic_id", topicId)
			.order("sentence_order"),

		supabase
			.from("learning_points")
			.select("*")
			.eq("topic_id", topicId)
			.order("sentence_order"),

		user
			? supabase
					.from("user_selected_points")
					.select("*")
					.eq("user_id", user.id)
					.eq("topic_id", topicId)
			: Promise.resolve({ data: null, error: null }),
	]);

	if (koreanResult.error) throw koreanResult.error;
	if (englishResult.error) throw englishResult.error;
	if (learningPointsResult.error) throw learningPointsResult.error;
	if (userSelectedPointsResult.error) throw userSelectedPointsResult.error;

	return {
		koreanScripts: koreanResult.data || [],
		englishScripts: englishResult.data || [],
		learningPoints: learningPointsResult.data || [],
		userSelectedPoints: userSelectedPointsResult.data || [],
	};
}
