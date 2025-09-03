import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect } from "react";
import { supabase } from "@/utils/supabase/client";

export function useAuthStateEffect() {
	const queryClient = useQueryClient();

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			queryClient.setQueryData(["user"], session?.user ?? null);

			// 인증 상태 변경 시 네비게이션 처리
			if (event === "SIGNED_IN") {
				router.dismissAll();
			} else if (event === "SIGNED_OUT") {
				queryClient.clear();
				router.dismissAll();
			}
		});

		return () => subscription.unsubscribe();
	}, [queryClient]);
}
