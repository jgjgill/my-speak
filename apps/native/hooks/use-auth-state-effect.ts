import { useQueryClient } from "@tanstack/react-query";
import { router, usePathname } from "expo-router";
import { useEffect } from "react";
import { useWebView } from "@/context/webview-context";
import { supabase } from "@/utils/supabase/client";

export function useAuthStateEffect() {
	const queryClient = useQueryClient();
	const { webViewRef } = useWebView();
	const pathname = usePathname();

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			queryClient.setQueryData(["user"], session?.user ?? null);

			// 웹뷰에 인증 상태 변경 알림 (네비게이션 전에 처리)
			if (webViewRef.current) {
				if (event === "SIGNED_IN" && session) {
					// 로그인 시 인증 데이터 전송
					const authData = {
						type: "AUTH_DATA",
						user: {
							id: session.user.id,
							email: session.user.email,
							user_metadata: session.user.user_metadata,
						},
						session: {
							access_token: session.access_token,
							refresh_token: session.refresh_token,
							expires_at: session.expires_at,
						},
					};
					webViewRef.current.postMessage(JSON.stringify(authData));
				} else if (event === "SIGNED_OUT") {
					// 로그아웃 시 로그아웃 메시지 전송
					const logoutData = { type: "LOGOUT" };
					webViewRef.current.postMessage(JSON.stringify(logoutData));
				}
			}

			// 인증 상태 변경 시 네비게이션 처리
			if (event === "SIGNED_IN") {
				// oauth-loading 페이지에서는 직접 네비게이션 처리
				// 다른 경우에만 자동 홈 이동
				if (!pathname.includes("oauth-loading")) {
					router.replace("/");
				}
			} else if (event === "SIGNED_OUT") {
				queryClient.clear();
				router.dismissAll();
			}
		});

		return () => subscription.unsubscribe();
	}, [queryClient, webViewRef, pathname]);
}
