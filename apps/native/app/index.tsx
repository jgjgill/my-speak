import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	BackHandler,
	Platform,
	Text,
	ToastAndroid,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NativeHeader from "@/components/native-header";
import SimpleWebView from "@/components/simple-webview";
import { useAuth } from "@/context/auth";
import { useDeepLink } from "@/context/deep-link-context";
import { useWebView } from "@/context/webview-context";
import { useWebViewMessageRouter } from "@/hooks/use-webview-message-router";

export default function Index() {
	const { isLoading } = useAuth();
	const { webViewRef, webViewUrl } = useWebView();
	const { processDeepLink } = useDeepLink();

	const isWeb = Platform.OS === "web";

	const [currentUrl, setCurrentUrl] = useState(webViewUrl);
	const [canGoBack, setCanGoBack] = useState(false);

	const backPressCountRef = useRef(0);

	// 웹뷰 메시지 라우터 훅 사용
	const handleWebViewMessage = useWebViewMessageRouter(webViewRef);

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

	// 딥링크 처리 - 앱 시작 시 한 번만 실행
	useEffect(() => {
		processDeepLink();
	}, [processDeepLink]);

	// BackHandler 설정
	useEffect(() => {
		const backHandler = BackHandler.addEventListener(
			"hardwareBackPress",
			handleHardwareBackPress,
		);

		return () => backHandler.remove();
	}, [handleHardwareBackPress]);

	// 웹에서 접속한 경우 스토어로 리다이렉트
	useEffect(() => {
		if (!isWeb) return;

		const userAgent = navigator.userAgent;

		if (/iPhone|iPad|iPod/.test(userAgent)) {
			window.location.href =
				"https://apps.apple.com/kr/app/myspeak/id6752112155";
		} else if (/Android/.test(userAgent)) {
			window.location.href =
				"https://play.google.com/store/apps/details?id=com.myspeaknative";
		} else {
			window.location.href = "https://my-speak.com";
		}
	}, [isWeb]);

	if (isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-white">
			{isWeb && (
				<View className="flex-1 bg-white px-6 pt-12">
					{/* 자연스러운 헤더 */}
					<View className="items-center mb-8">
						<Text className="text-3xl font-light text-gray-800 mb-2">
							MySpeak
						</Text>
						<View className="w-12 h-0.5 bg-gray-300"></View>
					</View>

					{/* 콘텐츠 중심의 안내 */}
					<View className="flex-1 justify-center -mt-16">
						<View className="mb-8">
							<Text className="text-xl text-gray-800 mb-3 leading-relaxed">
								안녕하세요! 👋
							</Text>
							<Text className="text-base text-gray-600 leading-relaxed mb-6">
								더 나은 스피킹 학습을 위해 전용 앱을 권장합니다.
								{"\n"}웹에서도 동일한 학습이 가능해요.
							</Text>
						</View>

						{/* 자연스러운 액션 */}
						<View className="space-y-4">
							<TouchableOpacity
								onPress={() => {
									window.location.href = "https://my-speak.com";
								}}
								className="py-3 border-b border-gray-200"
								activeOpacity={0.7}
							>
								<Text className="text-blue-600 text-lg font-medium">
									웹에서 바로 시작하기 →
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => {
									const userAgent = navigator.userAgent;
									if (/iPhone|iPad|iPod/.test(userAgent)) {
										window.location.href =
											"https://apps.apple.com/kr/app/myspeak/id6752112155";
									} else if (/Android/.test(userAgent)) {
										window.location.href =
											"https://play.google.com/store/apps/details?id=com.myspeaknative";
									} else {
										window.location.href = "https://my-speak.com";
									}
								}}
								className="py-3 border-b border-gray-200"
								activeOpacity={0.7}
							>
								<Text className="text-gray-600 text-lg font-medium">
									앱 다운로드 하기 →
								</Text>
							</TouchableOpacity>
						</View>
					</View>

					{/* 하단 서브텍스트 */}
					<View className="pb-8">
						<Text className="text-center text-sm text-gray-400">
							언어 학습의 새로운 경험을 만나보세요
						</Text>
					</View>
				</View>
			)}

			{!isWeb && (
				<>
					<NativeHeader
						currentUrl={currentUrl}
						onWebViewBack={handleWebViewBack}
						canGoBack={canGoBack}
					/>
					<SimpleWebView
						webViewUrl={webViewUrl}
						onUrlChange={handleUrlChange}
						onNavigationStateChange={handleNavigationStateChange}
						onWebViewMessage={handleWebViewMessage}
					/>
				</>
			)}
		</SafeAreaView>
	);
}
