import * as Speech from "expo-speech";

interface WebViewRef {
	current?: {
		postMessage: (message: string) => void;
	} | null;
}

export const useTTSMessageHandlers = (webViewRef: WebViewRef) => {
	const handleTTSSpeak = (message: {
		text: string;
		language: string;
		id: string;
	}) => {
		console.log("🔊 TTS 재생 시작:", message);

		const options: Speech.SpeechOptions = {
			language: message.language || "en",
			pitch: 1.0,
			rate: 1.0,
			volume: 1.0,
			onStart: () => {
				console.log("🔊 TTS 재생 시작됨");
				if (webViewRef?.current) {
					webViewRef.current.postMessage(
						JSON.stringify({
							type: "TTS_STATUS",
							payload: {
								status: "speaking",
								id: message.id,
							},
						}),
					);
				}
			},
			onDone: () => {
				console.log("✅ TTS 재생 완료");
				if (webViewRef?.current) {
					webViewRef.current.postMessage(
						JSON.stringify({
							type: "TTS_STATUS",
							payload: {
								status: "stopped",
								id: message.id,
							},
						}),
					);
				}
			},
			onError: (error) => {
				console.error("❌ TTS 재생 오류:", error);
				if (webViewRef?.current) {
					webViewRef.current.postMessage(
						JSON.stringify({
							type: "TTS_STATUS",
							payload: {
								status: "error",
								id: message.id,
							},
						}),
					);
				}
			},
		};

		Speech.speak(message.text, options);
	};

	const handleTTSStop = (message: { id: string }) => {
		console.log("⏹️ TTS 재생 중지:", message);
		Speech.stop();

		if (webViewRef?.current) {
			webViewRef.current.postMessage(
				JSON.stringify({
					type: "TTS_STATUS",
					payload: {
						status: "stopped",
						id: message.id,
					},
				}),
			);
		}
	};

	return {
		handleTTSSpeak,
		handleTTSStop,
	};
};
