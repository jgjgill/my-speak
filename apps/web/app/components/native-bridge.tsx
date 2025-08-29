"use client";

import { useEffect } from "react";
import { createClient } from "../utils/supabase/client";

declare global {
	interface Window {
		ReactNativeWebView?: {
			postMessage: (message: string) => void;
		};
	}
}

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

interface NativeGoBackMessage {
	type: "GO_BACK";
}

type NativeMessage =
	| NativeAuthMessage
	| NativeLogoutMessage
	| NativeGoBackMessage;

export default function NativeBridge() {
	useEffect(() => {
		const handleNativeMessage = (event: Event) => {
			const messageEvent = event as MessageEvent;
			try {
				if (typeof messageEvent.data !== "string") {
					return;
				}

				const message = JSON.parse(messageEvent.data) as NativeMessage;
				console.log("✅ Received message from native app:", message);

				if (message.type === "AUTH_DATA") {
					console.log("📦 Auth data received from native:", message.user);
					console.log("🔐 Session data received:", message.session);

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

									window.dispatchEvent(
										new CustomEvent("supabaseSessionUpdated"),
									);
								}
							});
					}
				} else if (message.type === "LOGOUT") {
					console.log("🚪 Logout message received from native");

					const supabase = createClient();
					supabase.auth.signOut().then(({ error }) => {
						if (error) {
							console.error("❌ Failed to sign out in WebView:", error);
						} else {
							console.log("✅ WebView session cleared successfully");

							window.dispatchEvent(new CustomEvent("supabaseSessionUpdated"));
						}
					});
				} else if (message.type === "GO_BACK") {
					console.log("⬅️ Go back message received from native");

					// 브라우저 히스토리 뒤로가기
					if (window.history.length > 1) {
						window.history.back();
					} else {
						console.log("No history to go back to");
					}
				}
			} catch (error) {
				console.error("❌ Failed to parse native message:", error);
			}
		};

		document.addEventListener("message", handleNativeMessage);
		window.addEventListener("message", handleNativeMessage);

		const requestAuthFromNative = () => {
			if (!window.ReactNativeWebView) {
				console.log("📱 Not in WebView environment, skipping auth request");
				return;
			}

			console.log("📱 Requesting auth from native app");

			window.ReactNativeWebView.postMessage(
				JSON.stringify({
					type: "REQUEST_AUTH",
				}),
			);
		};

		const timer = setTimeout(requestAuthFromNative, 500);

		return () => {
			document.removeEventListener("message", handleNativeMessage);
			window.removeEventListener("message", handleNativeMessage);
			clearTimeout(timer);
		};
	}, []);

	return null;
}
