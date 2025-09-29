"use client";

import BrowserTTS from "./browser-tts";
import UnsupportedTTS from "./unsupported-tts";
import { useTTSMode } from "./use-tts-mode";
import WebViewTTS from "./webview-tts";

interface TTSManagerProps {
	text: string;
	language?: string;
	onSpeakStart?: () => void;
	onSpeakEnd?: () => void;
	onError?: (error: string) => void;
}

export default function TTSManager({
	text,
	language,
	onSpeakStart,
	onSpeakEnd,
	onError,
}: TTSManagerProps) {
	const ttsMode = useTTSMode();

	return (
		<>
			{ttsMode === "browser" && (
				<BrowserTTS
					text={text}
					language={language}
					onSpeakStart={onSpeakStart}
					onSpeakEnd={onSpeakEnd}
					onError={onError}
				/>
			)}
			{ttsMode === "webview" && (
				<WebViewTTS
					text={text}
					language={language}
					onSpeakStart={onSpeakStart}
					onSpeakEnd={onSpeakEnd}
					onError={onError}
				/>
			)}
			{ttsMode === "unsupported" && <UnsupportedTTS />}
		</>
	);
}