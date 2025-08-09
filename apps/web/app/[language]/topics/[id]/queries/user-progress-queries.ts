import type { Tables } from "@repo/typescript-config/supabase-types";
import type { User } from "@supabase/supabase-js";
import { createClient } from "../../../../utils/supabase/client";

export type UserProgress = Tables<"user_progress">;

export async function getUserProgress(
	topicId: string,
	user: User,
): Promise<UserProgress | null> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("user_progress")
		.select("*")
		.eq("user_id", user.id)
		.eq("topic_id", topicId)
		.single();

	if (error && error.code !== "PGRST116") {
		// PGRST116: no rows returned
		throw error;
	}
	return data || null;
}
