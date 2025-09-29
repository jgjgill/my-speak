import { useEffect, useState } from "react";
import { useWebView } from "../../../../../contexts/webview-context";

export type TTSMode = "browser" | "webview" | "unsupported";

export function useTTSMode() {
	const { isWebView } = useWebView();
	const [ttsMode, setTTSMode] = useState<TTSMode>("unsupported");

	useEffect(() => {
		const isSpeechSynthesisSupported = "speechSynthesis" in window;

		if (isWebView) {
			setTTSMode("webview");
		} else if (isSpeechSynthesisSupported) {
			setTTSMode("browser");
		} else {
			setTTSMode("unsupported");
		}
	}, [isWebView]);

	return ttsMode;
}
