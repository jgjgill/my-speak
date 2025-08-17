import type { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase/client";

async function getUser(): Promise<User | null> {
	const { data, error } = await supabase.auth.getUser();

	if (error) {
		console.log("User not authenticated:", error.message);
		return null;
	}
	return data.user;
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
