/**
 * WebView에서 네이티브 앱으로 TTS 관련 메시지를 전송하는 유틸리티 함수들
 */

export function sendTTSSpeak(text: string, language: string): void {
	if (typeof window === "undefined" || !window.ReactNativeWebView) {
		console.warn("TTS: ReactNativeWebView not available");
		return;
	}

	window.ReactNativeWebView.postMessage(
		JSON.stringify({
			type: "TTS_SPEAK",
			text,
			language,
		}),
	);
}

export function sendTTSStop(): void {
	if (typeof window === "undefined" || !window.ReactNativeWebView) {
		console.warn("TTS: ReactNativeWebView not available");
		return;
	}

	window.ReactNativeWebView.postMessage(
		JSON.stringify({
			type: "TTS_STOP",
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