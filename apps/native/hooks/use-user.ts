import type { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase/client";

async function getUser(): Promise<User | null> {
	try {
		const { data, error } = await supabase.auth.getUser();

		if (error) {
			console.log("🚫 User authentication failed:", {
				message: error.message,
				status: error.status,
				name: error.name,
			});

			// AuthApiError이고 refresh token 관련 에러인 경우 세션 정리
			if (error.name === "AuthApiError" && error.message.includes("refresh")) {
				console.log("🔄 Refresh token error detected, clearing session...");
				await supabase.auth.signOut({ scope: "local" });
			}

			return null;
		}
		return data.user;
	} catch (error) {
		console.error("💥 Unexpected error in getUser:", {
			error: error instanceof Error ? error.message : error,
			stack: error instanceof Error ? error.stack : undefined,
		});
		return null;
	}
}

export function useUser(initialUser?: User | null) {
	return useQuery({
		queryKey: ["user"],
		queryFn: getUser,
		staleTime: 15 * 60 * 1000, // 15분 캐시
		gcTime: Infinity, // 세션 동안 유지
		initialData: initialUser, // 서버 초기 데이터
		retry: false, // 인증 실패시 재시도 안함
	});
}
