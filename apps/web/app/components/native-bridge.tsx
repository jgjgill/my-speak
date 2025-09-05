"use client";

import { useQueryClient } from "@tanstack/react-query";
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
	const queryClient = useQueryClient();

	useEffect(() => {
		const handleNativeMessage = (event: Event) => {
			const messageEvent = event as MessageEvent;
			try {
				if (typeof messageEvent.data !== "string") {
					return;
				}

				const message = JSON.parse(messageEvent.data) as NativeMessage;

				if (message.type === "AUTH_DATA") {
					if (message.session) {
						const supabase = createClient();
						alert("애플 로그인이 잘 되었을까..");

						const updateAuthSession = async () => {
							if (!message.session) {
								return null;
							}

							const { data } = await supabase.auth.setSession({
								access_token: message.session.access_token,
								refresh_token: message.session.refresh_token,
							});

							return data;
						};

						updateAuthSession();
					}
				} else if (message.type === "LOGOUT") {
					queryClient.setQueryData(["user"], null);
					queryClient.clear();

					const supabase = createClient();

					supabase.auth.signOut().catch(() => {
						console.log(
							"Supabase signOut error ignored (session may already be cleared)",
						);
					});
				} else if (message.type === "GO_BACK") {
					if (window.history.length > 1) {
						window.history.back();
					} else {
						window.location.replace("/");
					}
				}
			} catch (error) {
				console.error("Failed to parse native message:", error);
			}
		};

		document.addEventListener("message", handleNativeMessage);
		window.addEventListener("message", handleNativeMessage);

		const requestAuthFromNative = () => {
			if (!window.ReactNativeWebView) {
				return;
			}

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
	}, [queryClient]);

	return null;
}
