import type { Tables } from "@repo/typescript-config/supabase-types";
import { createClient } from "../../../utils/supabase/client";

// 타입 정의
export type Topic = Tables<"topics">;

// 주제 정보 조회
export async function getTopic(topicId: string): Promise<Topic> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("topics")
		.select("*")
		.eq("id", topicId)
		.single();

	if (error) throw error;
	return data;
}