"use client";

import { useEffect } from "react";
import { createClient } from "../utils/supabase/client";

interface NativeAuthMessage {
	type: "AUTH_DATA";
	user: {
		id: string;
		email: string;
		user_metadata?: unknown;
	};
	session?: {
		access_token: string;
		refresh_token: string;
		expires_at: number;
	} | null;
}

interface NativeLogoutMessage {
	type: "LOGOUT";
}

type NativeMessage = NativeAuthMessage | NativeLogoutMessage;

export default function NativeBridge() {
	useEffect(() => {
		// 네이티브 앱으로부터 메시지 수신 리스너
		const handleNativeMessage = (event: MessageEvent) => {
			try {
				// 네이티브 앱이 아닌 경우 무시
				if (typeof event.data !== "string") {
					return;
				}

				const message = JSON.parse(event.data) as NativeMessage;
				console.log("Received message from native app:", message);

				if (message.type === "AUTH_DATA") {
					console.log("📦 Auth data received from native:", message.user);
					console.log("🔐 Session data received:", message.session);

					// Supabase 세션 설정
					if (message.session) {
						const supabase = createClient();

						supabase.auth
							.setSession({
								access_token: message.session.access_token,
								refresh_token: message.session.refresh_token,
							})
							.then(({ data, error }) => {
								if (error) {
									console.error("❌ Failed to set Supabase session:", error);
								} else {
									console.log(
										"✅ Supabase session set successfully in WebView",
									);
									console.log("👤 Authenticated user:", data.user?.email);

									// 인증 상태 변경 이벤트 발생
									window.dispatchEvent(
										new CustomEvent("supabaseSessionUpdated"),
									);
								}
							});
					}
				} else if (message.type === "LOGOUT") {
					console.log("🚪 Logout message received from native");

					// Supabase 세션 정리
					const supabase = createClient();
					supabase.auth.signOut().then(({ error }) => {
						if (error) {
							console.error("❌ Failed to sign out in WebView:", error);
						} else {
							console.log("✅ WebView session cleared successfully");

							// 로그아웃 상태 변경 이벤트 발생
							window.dispatchEvent(new CustomEvent("supabaseSessionUpdated"));
						}
					});
				}
			} catch (error) {
				console.error("Failed to parse native message:", error);
			}
		};

		window.addEventListener("message", handleNativeMessage);

		// 네이티브 앱에게 인증 정보 요청
		const requestAuthFromNative = () => {
			if (window.ReactNativeWebView) {
				window.ReactNativeWebView.postMessage(
					JSON.stringify({
						type: "REQUEST_AUTH",
					}),
				);
			}
		};

		// 페이지 로드 후 인증 정보 요청
		const timer = setTimeout(requestAuthFromNative, 1000);

		return () => {
			window.removeEventListener("message", handleNativeMessage);
			clearTimeout(timer);
		};
	}, []);

	return null; // UI를 렌더링하지 않는 컴포넌트
}

// TypeScript 타입 확장
declare global {
	interface Window {
		ReactNativeWebView?: {
			postMessage: (message: string) => void;
		};
	}
}
