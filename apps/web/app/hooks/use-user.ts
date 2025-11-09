import type { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/shared/api/supabase/client";

async function getUser(): Promise<User | null> {
	try {
		const supabase = createClient();
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
				await supabase.auth.signOut();
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
		staleTime: 15 * 60 * 1000,
		gcTime: Infinity,
		initialData: initialUser,
	});
}
