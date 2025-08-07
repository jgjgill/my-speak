import type { Tables } from "@repo/typescript-config/supabase-types";
import type { User } from "@supabase/supabase-js";
import { createClient } from "../../../utils/supabase/client";

type KoreanScript = Tables<"korean_scripts">;
type EnglishScript = Tables<"english_scripts">;
type LearningPoint = Tables<"learning_points">;
type UserTranslation = Tables<"user_translations">;
type UserSelectedPoint = Tables<"user_selected_points">;

export interface StageTwoData {
	koreanScripts: KoreanScript[];
	englishScripts: EnglishScript[];
	learningPoints: LearningPoint[];
	userTranslations: UserTranslation[];
	userSelectedPoints: UserSelectedPoint[];
}

export async function getStageTwoData(
	topicId: string,
	user: User | null,
): Promise<StageTwoData> {
	const supabase = createClient();

	const [
		koreanResult,
		englishResult,
		learningPointsResult,
		userTranslationsResult,
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
					.from("user_translations")
					.select("*")
					.eq("user_id", user.id)
					.eq("topic_id", topicId)
			: Promise.resolve({ data: null, error: null }),

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
	if (userTranslationsResult.error) throw userTranslationsResult.error;
	if (userSelectedPointsResult.error) throw userSelectedPointsResult.error;

	return {
		koreanScripts: koreanResult.data || [],
		englishScripts: englishResult.data || [],
		learningPoints: learningPointsResult.data || [],
		userTranslations: userTranslationsResult.data || [],
		userSelectedPoints: userSelectedPointsResult.data || [],
	};
}
