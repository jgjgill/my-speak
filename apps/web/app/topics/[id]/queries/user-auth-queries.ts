import type { User } from "@supabase/supabase-js";
import { createClient } from "../../../utils/supabase/client";

// 사용자 인증 정보 조회
export async function getUser(): Promise<User | null> {
	const supabase = createClient();
	const { data, error } = await supabase.auth.getUser();
	
	if (error) throw error;
	return data.user;
}