import { useAudioRecorderMessageHandlers } from "./use-audio-recorder-message-handlers";
import { useTTSMessageHandlers } from "./use-tts-message-handlers";

type WebViewMessage = {
	type: string;
	payload?: Record<string, unknown>;
};

type MessageHandler = (message: WebViewMessage) => void;

interface WebViewRef {
	current?: {
		postMessage: (message: string) => void;
	} | null;
}

export const useWebViewMessageRouter = (webViewRef: WebViewRef) => {
	const {
		startRecording,
		stopRecording,
		playRecording,
		pauseRecording,
		seekToPosition,
	} = useAudioRecorderMessageHandlers(webViewRef);

	const { handleTTSSpeak, handleTTSStop } = useTTSMessageHandlers(webViewRef);

	const MESSAGE_HANDLERS: Record<string, MessageHandler> = {
		AUDIO_RECORDING_START: () => {
			startRecording();
		},
		AUDIO_RECORDING_STOP: () => {
			stopRecording();
		},
		AUDIO_PLAYBACK_START: () => {
			playRecording();
		},
		AUDIO_PLAYBACK_PAUSE: () => {
			pauseRecording();
		},
		AUDIO_PLAYBACK_SEEK: (message) => {
			if (message.payload) {
				seekToPosition(message.payload.seekTime as number);
			}
		},

		TTS_SPEAK: (message) => {
			if (message.payload) {
				handleTTSSpeak({
					text: message.payload.text as string,
					language: message.payload.language as string,
					id: message.payload.id as string,
				});
			}
		},
		TTS_STOP: (message) => {
			if (message.payload) {
				handleTTSStop({
					id: message.payload.id as string,
				});
			}
		},
	};

	return (message: WebViewMessage) => {
		console.log("📨 WebView 메시지 수신:", message);

		const handler = MESSAGE_HANDLERS[message.type];

		if (handler) {
			handler(message);
		} else {
			console.warn(`⚠️ 처리되지 않은 메시지 타입: ${message.type}`);
		}
	};
};
