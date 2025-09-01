"use client";

import BrowserAudioRecorder from "./browser-audio-recorder";
import UnsupportedAudioRecorder from "./unsupported-audio-recorder";
import { useRecordingMode } from "./use-recording-mode";
import WebViewAudioRecorder from "./webview-audio-recorder";

interface AudioRecorderProps {
	onRecordingComplete: (hasRecorded: boolean) => void;
}

export default function AudioRecorderManager({
	onRecordingComplete,
}: AudioRecorderProps) {
	const recordingMode = useRecordingMode();

	return (
		<>
			{recordingMode === "webview" && (
				<WebViewAudioRecorder onRecordingComplete={onRecordingComplete} />
			)}
			{recordingMode === "browser" && (
				<BrowserAudioRecorder onRecordingComplete={onRecordingComplete} />
			)}
			{recordingMode === "unsupported" && <UnsupportedAudioRecorder />}
		</>
	);
}
