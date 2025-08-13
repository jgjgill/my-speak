import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/utils/supabase/client";

export function useAuthStateEffect() {
	const queryClient = useQueryClient();

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			queryClient.setQueryData(["user"], session?.user ?? null);

			// 로그아웃 시 모든 캐시 클리어
			if (event === "SIGNED_OUT") {
				queryClient.clear();
			}
		});

		return () => subscription.unsubscribe();
	}, [queryClient]);
}
