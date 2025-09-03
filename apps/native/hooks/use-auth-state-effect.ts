import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
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
				if (Platform.OS === "android") {
					// 안드로이드: dismissAll로 깔끔한 스택 정리 (replace 시 깜빡임 발생)
					router.dismissAll();
				} else {
					// iOS: Apple 로그인 모달 때문에 replace 사용 (dismissAll 시 네비게이션 에러)
					router.replace("/");
				}
			} else if (event === "SIGNED_OUT") {
				queryClient.clear();
				router.dismissAll();
			}
		});

		return () => subscription.unsubscribe();
	}, [queryClient]);
}
