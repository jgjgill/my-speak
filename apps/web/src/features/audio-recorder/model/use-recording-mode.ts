import { useEffect, useState } from "react";

export type RecordingMode = "browser" | "webview" | "unsupported";

export function useRecordingMode() {
	const [recordingMode, setRecordingMode] =
		useState<RecordingMode>("unsupported");

	useEffect(() => {
		const isWebView =
			typeof window !== "undefined" && window.ReactNativeWebView !== undefined;
		const isMediaRecorderSupported =
			typeof MediaRecorder !== "undefined" &&
			typeof navigator.mediaDevices?.getUserMedia !== "undefined";

		if (isWebView) {
			setRecordingMode("webview");
		} else if (isMediaRecorderSupported) {
			setRecordingMode("browser");
		} else {
			setRecordingMode("unsupported");
		}
	}, []);

	return recordingMode;
}
