import type { Tables } from "@repo/typescript-config/supabase-types";
import { createClient } from "../../../utils/supabase/client";

export type KeywordSpeech = Tables<"keyword_speeches">;

export async function getStageFourData(topicId: string): Promise<KeywordSpeech[]> {
	const supabase = createClient();
	
	const { data, error } = await supabase
		.from("keyword_speeches")
		.select("*")
		.eq("topic_id", topicId)
		.order("sequence_order");

	if (error) throw error;
	return data || [];
}