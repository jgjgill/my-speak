import type { Tables } from "@repo/typescript-config/supabase-types";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createBrowserClient } from "@/shared/api/supabase";

export type UserProgress = Tables<"user_progress">;

export async function getUserProgress(
	topicId: string,
	language: string,
	user: User,
	supabase?: SupabaseClient,
): Promise<UserProgress | null> {
	const client = supabase || createBrowserClient();
	const { data, error } = await client
		.from("user_progress")
		.select("*, topics!inner(language_code)")
		.eq("user_id", user.id)
		.eq("topic_id", topicId)
		.eq("topics.language_code", language)
		.maybeSingle();

	if (error && error.code !== "PGRST116") {
		// PGRST116: no rows returned
		throw error;
	}
	return data || null;
}

export async function getGuestProgress(): Promise<number> {
	return 1;
}
