import type { User } from "@supabase/supabase-js";
import { createServerClient } from "@/shared/api/supabase";

/**
 * 서버 사이드에서 현재 사용자 정보를 가져옵니다.
 * @returns 인증된 사용자 또는 null
 */
export async function getCurrentUser(): Promise<User | null> {
	try {
		const supabase = await createServerClient();
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser();

		if (error) {
			return null;
		}

		return user;
	} catch (error) {
		console.error("Error getting user:", error);
		return null;
	}
}

/**
 * 서버 사이드에서 사용자 인증 상태를 확인합니다.
 * @returns 인증 여부
 */
export async function isAuthenticated(): Promise<boolean> {
	const user = await getCurrentUser();
	return user !== null;
}
