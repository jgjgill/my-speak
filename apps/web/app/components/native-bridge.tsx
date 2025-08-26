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
		// React Native WebView는 document에 message 이벤트를 발생시킵니다
		const handleNativeMessage = (event: Event) => {
			// MessageEvent로 캐스팅
			const messageEvent = event as MessageEvent;
			try {
				console.log("📨 Message event received:", messageEvent);

				// 네이티브 앱이 아닌 경우 무시
				if (typeof messageEvent.data !== "string") {
					console.log(
						"❌ Invalid message data type:",
						typeof messageEvent.data,
					);
					return;
				}

				const message = JSON.parse(messageEvent.data) as NativeMessage;
				console.log("✅ Received message from native app:", message);

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
				console.error("❌ Failed to parse native message:", error);
			}
		};

		// Android: React Native WebView는 postMessage를 document 객체로 전달
		// - Android WebView 엔진이 DOM document를 메시지 타겟으로 사용
		document.addEventListener("message", handleNativeMessage);

		// iOS: WKWebView는 window 객체로 메시지를 전달하는 경우가 있음
		// - iOS 버전과 React Native 버전에 따라 동작이 다를 수 있어 안전성을 위해 추가
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
			document.removeEventListener("message", handleNativeMessage);
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
