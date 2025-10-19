"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { createBrowserClient } from "@/shared/api/supabase";
import { isNativeWebViewClient } from "@/shared/lib";

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

interface NativeGoHomeMessage {
	type: "GO_HOME";
}

// 오디오 녹음 관련 메시지들
interface NativeAudioRecordingStartMessage {
	type: "AUDIO_RECORDING_START";
}

interface NativeAudioRecordingStopMessage {
	type: "AUDIO_RECORDING_STOP";
}

interface NativeAudioPlaybackStartMessage {
	type: "AUDIO_PLAYBACK_START";
}

interface NativeAudioPlaybackPauseMessage {
	type: "AUDIO_PLAYBACK_PAUSE";
}

interface NativeAudioPlaybackSeekMessage {
	type: "AUDIO_PLAYBACK_SEEK";
	payload: {
		seekTime: number;
	};
}

// TTS 관련 메시지들 (payload 구조로 통일)
interface NativeTTSSpeakMessage {
	type: "TTS_SPEAK";
	payload: {
		text: string;
		language: string;
	};
}

interface NativeTTSStopMessage {
	type: "TTS_STOP";
}

interface NativeTTSStatusMessage {
	type: "TTS_STATUS";
	payload: {
		status: "speaking" | "stopped" | "error";
	};
}

type NativeMessage =
	| NativeAuthMessage
	| NativeLogoutMessage
	| NativeGoBackMessage
	| NativeGoHomeMessage
	| NativeAudioRecordingStartMessage
	| NativeAudioRecordingStopMessage
	| NativeAudioPlaybackStartMessage
	| NativeAudioPlaybackPauseMessage
	| NativeAudioPlaybackSeekMessage
	| NativeTTSSpeakMessage
	| NativeTTSStopMessage
	| NativeTTSStatusMessage;

export default function NativeBridge() {
	const queryClient = useQueryClient();

	useEffect(() => {
		const handleNativeMessage = async (event: Event) => {
			const messageEvent = event as MessageEvent;
			try {
				if (typeof messageEvent.data !== "string") {
					return;
				}

				const message = JSON.parse(messageEvent.data) as NativeMessage;

				if (message.type === "AUTH_DATA") {
					if (message.session) {
						const supabase = createBrowserClient();
						// @test 임시 주석
						// alert(`나는 세션: ${message.session.access_token}`);

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

						await updateAuthSession();
					}
				} else if (message.type === "LOGOUT") {
					const supabase = createBrowserClient();

					// 즉시 쿼리 정리 (UI 빠른 반응)
					queryClient.setQueryData(["user"], null);
					queryClient.clear();

					// Supabase 세션 정리
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
				} else if (message.type === "GO_HOME") {
					window.location.replace("/");
				}
			} catch (error) {
				console.error("Failed to parse native message:", error);
			}
		};

		document.addEventListener("message", handleNativeMessage);
		window.addEventListener("message", handleNativeMessage);

		const requestAuthFromNative = () => {
			if (!window.ReactNativeWebView) {
				return false; // 웹뷰 준비되지 않음
			}

			window.ReactNativeWebView.postMessage(
				JSON.stringify({
					type: "REQUEST_AUTH",
				}),
			);
			return true; // 요청 성공
		};

		// 3번까지 재시도하는 인터벌 방식
		const maxRetries = 3;
		let retryCount = 0;

		const authRequestInterval = setInterval(() => {
			const success = requestAuthFromNative();
			retryCount++;

			if (success) {
				clearInterval(authRequestInterval);
			} else if (retryCount >= maxRetries) {
				clearInterval(authRequestInterval);

				if (isNativeWebViewClient()) {
					console.warn("서비스 연결에 문제가 있습니다. 앱을 재시작해 주세요.");
				}
			}
		}, 1000);

		return () => {
			document.removeEventListener("message", handleNativeMessage);
			window.removeEventListener("message", handleNativeMessage);
			clearInterval(authRequestInterval);
		};
	}, [queryClient]);

	return null;
}
