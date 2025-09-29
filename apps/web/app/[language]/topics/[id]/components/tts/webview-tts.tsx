"use client";

import { useEffect } from "react";
import { useBooleanState } from "react-simplikit";
import { sendTTSSpeak, sendTTSStop } from "../../../../../utils/tts-bridge";

interface WebViewTTSProps {
	text: string;
	language?: string;
	onSpeakStart?: () => void;
	onSpeakEnd?: () => void;
	onError?: (error: string) => void;
}

export default function WebViewTTS({
	text,
	language = "en",
	onSpeakStart,
	onSpeakEnd,
	onError,
}: WebViewTTSProps) {
	const [isPlaying, playTts, pauseTts] = useBooleanState(false);

	useEffect(() => {
		// WebView 환경에서 TTS 상태 메시지 수신 리스너
		const handleTTSStatusMessage = (event: Event) => {
			const messageEvent = event as MessageEvent;
			try {
				if (typeof messageEvent.data !== "string") {
					return;
				}

				const message = JSON.parse(messageEvent.data);

				if (message.type === "TTS_STATUS") {
					switch (message.status) {
						case "speaking":
							playTts();
							onSpeakStart?.();
							break;
						case "stopped":
							pauseTts();
							onSpeakEnd?.();
							break;
						case "error":
							pauseTts();
							onError?.("TTS playback error");
							break;
					}
				}
			} catch (error) {
				console.error("Failed to parse TTS status message:", error);
			}
		};

		document.addEventListener("message", handleTTSStatusMessage);
		window.addEventListener("message", handleTTSStatusMessage);

		return () => {
			document.removeEventListener("message", handleTTSStatusMessage);
			window.removeEventListener("message", handleTTSStatusMessage);
		};
	}, [playTts, pauseTts, onSpeakStart, onSpeakEnd, onError]);

	const speak = () => {
		if (!text.trim()) return;
		sendTTSSpeak(text, language);
	};

	const stop = () => {
		sendTTSStop();
		pauseTts();
	};

	return (
		<button
			type="button"
			onClick={isPlaying ? stop : speak}
			disabled={!text.trim()}
			className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{isPlaying ? (
				<>
					<span className="text-blue-600">⏸️</span>
					<span className="text-sm text-blue-700">재생 중지</span>
				</>
			) : (
				<>
					<span className="text-blue-600">🔊</span>
					<span className="text-sm text-blue-700">음성 재생</span>
				</>
			)}
		</button>
	);
}
