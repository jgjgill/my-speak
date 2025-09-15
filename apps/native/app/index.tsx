import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	BackHandler,
	ToastAndroid,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NativeHeader from "@/components/native-header";
import SimpleWebView from "@/components/simple-webview";
import { useAuth } from "@/context/auth";
import { useWebViewRef } from "@/context/webview-context";
import { useWebViewAudioRecorder } from "@/hooks/use-audio-recorder";
import { getWebViewUrl } from "@/utils/webview-url";

export default function Index() {
	const { isLoading } = useAuth();
	const webViewRef = useWebViewRef();
	const webViewUrl = getWebViewUrl();
	const [currentUrl, setCurrentUrl] = useState(webViewUrl);
	const [canGoBack, setCanGoBack] = useState(false);
	const backPressCountRef = useRef(0);

	// 오디오 녹음 훅 사용
	const {
		startRecording,
		stopRecording,
		playRecording,
		pauseRecording,
		seekToPosition,
	} = useWebViewAudioRecorder(webViewRef);

	const handleWebViewBack = () => {
		if (webViewRef.current) {
			webViewRef.current.postMessage(JSON.stringify({ type: "GO_BACK" }));
		}
	};

	const handleHardwareBackPress = useCallback(() => {
		try {
			const url = new URL(currentUrl);
			const isRoot = url.pathname === "/";

			if (router.canGoBack()) {
				router.back();
				return true;
			}

			if (canGoBack) {
				if (webViewRef.current) {
					webViewRef.current.postMessage(JSON.stringify({ type: "GO_BACK" }));
				}
				return true;
			}

			if (!isRoot) {
				if (webViewRef.current) {
					webViewRef.current.postMessage(JSON.stringify({ type: "GO_HOME" }));
				}
				return true;
			}

			// 루트에서 두 번 눌러서 앱 종료
			if (backPressCountRef.current === 0) {
				backPressCountRef.current = Date.now();
				ToastAndroid.show(
					"앱을 끄려면 한 번 더 눌러주세요.",
					ToastAndroid.SHORT,
				);

				setTimeout(() => {
					backPressCountRef.current = 0;
				}, 2000);
				return true;
			}

			return Date.now() - backPressCountRef.current >= 2000;
		} catch {
			return false;
		}
	}, [canGoBack, currentUrl, webViewRef]);

	const handleUrlChange = (url: string) => {
		setCurrentUrl(url);
	};

	const handleNavigationStateChange = (canGoBack: boolean) => {
		setCanGoBack(canGoBack);
	};

	// BackHandler 설정
	useEffect(() => {
		const backHandler = BackHandler.addEventListener(
			"hardwareBackPress",
			handleHardwareBackPress,
		);

		return () => backHandler.remove();
	}, [handleHardwareBackPress]);

	// WebView에서 온 메시지 처리
	// biome-ignore lint/suspicious/noExplicitAny: <bridge>
	const handleWebViewMessage = (message: { type: string; payload?: any }) => {
		console.log("📨 WebView 메시지 수신:", message);

		switch (message.type) {
			case "AUDIO_RECORDING_START":
				console.log("🎤 녹음 시작 요청 받음");
				startRecording();
				break;

			case "AUDIO_RECORDING_STOP":
				console.log("⏹️ 녹음 중지 요청 받음");
				stopRecording();
				break;

			case "AUDIO_PLAYBACK_START":
				console.log("▶️ 재생 시작 요청 받음");
				playRecording();
				break;

			case "AUDIO_PLAYBACK_PAUSE":
				console.log("⏸️ 재생 일시정지 요청 받음");
				pauseRecording();
				break;

			case "AUDIO_PLAYBACK_SEEK":
				console.log("⏭️ 재생 위치 이동 요청 받음:", message.payload);
				if (message.payload?.seekTime !== undefined) {
					seekToPosition(message.payload.seekTime);
				}
				break;

			default:
				// 기존 다른 메시지들은 그대로 처리
				break;
		}
	};

	if (isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-white">
			<NativeHeader
				currentUrl={currentUrl}
				onWebViewBack={handleWebViewBack}
				canGoBack={canGoBack}
			/>

			<SimpleWebView
				onUrlChange={handleUrlChange}
				onNavigationStateChange={handleNavigationStateChange}
				onWebViewMessage={handleWebViewMessage}
			/>
		</SafeAreaView>
	);
}
