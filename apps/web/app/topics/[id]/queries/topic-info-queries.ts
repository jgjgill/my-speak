import type { Tables } from "@repo/typescript-config/supabase-types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "../../../utils/supabase/client";

// 타입 정의
export type Topic = Tables<"topics">;

// 주제 정보 조회
export async function getTopic(
	topicId: string,
	supabase?: SupabaseClient,
): Promise<Topic> {
	const client = supabase || createClient();
	const { data, error } = await client
		.from("topics")
		.select("*")
		.eq("id", topicId)
		.single();

	if (error) throw error;
	return data;
}