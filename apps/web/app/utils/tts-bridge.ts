/**
 * WebView에서 네이티브 앱으로 TTS 관련 메시지를 전송하는 유틸리티 함수들
 */

export function sendTTSSpeak(text: string, language: string, id: string): void {
	if (typeof window === "undefined" || !window.ReactNativeWebView) {
		console.warn("TTS: ReactNativeWebView not available");
		return;
	}

	window.ReactNativeWebView.postMessage(
		JSON.stringify({
			type: "TTS_SPEAK",
			payload: {
				text,
				language,
				id,
			},
		}),
	);
}

export function sendTTSStop(id: string): void {
	if (typeof window === "undefined" || !window.ReactNativeWebView) {
		console.warn("TTS: ReactNativeWebView not available");
		return;
	}

	window.ReactNativeWebView.postMessage(
		JSON.stringify({
			type: "TTS_STOP",
			payload: {
				id,
			},
		}),
	);
}

export function requestTTSStatus(): void {
	if (typeof window === "undefined" || !window.ReactNativeWebView) {
		console.warn("TTS: ReactNativeWebView not available");
		return;
	}

	window.ReactNativeWebView.postMessage(
		JSON.stringify({
			type: "TTS_STATUS_REQUEST",
		}),
	);
}
