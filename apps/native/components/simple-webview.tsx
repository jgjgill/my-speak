import { forwardRef, useCallback, useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import {
	WebView,
	type WebViewMessageEvent,
	type WebViewNavigation,
} from "react-native-webview";
import { useAuth } from "@/context/auth";
import { supabase } from "@/utils/supabase/client";
import { getWebViewUrl } from "@/utils/webview-url";

interface SimpleWebViewProps {
	onUrlChange?: (url: string) => void;
	// biome-ignore lint/suspicious/noExplicitAny: <bridge>
	onWebViewMessage?: (message: any) => void;
}

const SimpleWebView = forwardRef<WebView, SimpleWebViewProps>(
	({ onUrlChange, onWebViewMessage }, ref) => {
		const { user, isLoading } = useAuth();
		const webViewUrl = getWebViewUrl();

		// 웹뷰에 인증 정보와 세션 전송
		const sendAuthToWebView = useCallback(async () => {
			if (ref && typeof ref === "object" && ref.current && user) {
				try {
					const {
						data: { session },
						error,
					} = await supabase.auth.getSession();

					if (error) {
						console.error("Failed to get session:", error);
						return;
					}

					const authData = {
						type: "AUTH_DATA",
						user: {
							id: user.id,
							email: user.email,
							user_metadata: user.user_metadata,
						},
						session: session
							? {
									access_token: session.access_token,
									refresh_token: session.refresh_token,
									expires_at: session.expires_at,
								}
							: null,
					};

					ref.current.postMessage(JSON.stringify(authData));
				} catch (error) {
					console.error("Error getting session:", error);
				}
			}
		}, [user, ref]);

		// 웹뷰에 로그아웃 메시지 전송
		const sendLogoutToWebView = useCallback(() => {
			if (ref && typeof ref === "object" && ref.current) {
				const logoutData = {
					type: "LOGOUT",
				};
				ref.current.postMessage(JSON.stringify(logoutData));
			}
		}, [ref]);

		// 웹뷰 네비게이션 상태 변경 감지
		const handleNavigationStateChange = (navState: WebViewNavigation) => {
			const newUrl = navState.url;

			if (onUrlChange) {
				onUrlChange(newUrl);
			}
		};

		// 웹뷰로부터 메시지 수신
		const handleWebViewMessage = (event: WebViewMessageEvent) => {
			try {
				const message = JSON.parse(event.nativeEvent.data);

				if (message.type === "REQUEST_AUTH") {
					sendAuthToWebView();
				}

				if (onWebViewMessage) {
					onWebViewMessage(message);
				}
			} catch (error) {
				console.error("Failed to parse WebView message:", error);
			}
		};

		// 사용자 로그아웃 시 WebView에 로그아웃 메시지 전송
		useEffect(() => {
			if (user || isLoading) {
				return;
			}

			sendLogoutToWebView();
		}, [user, isLoading, sendLogoutToWebView]);

		return (
			<View className="flex-1">
				<WebView
					ref={ref}
					source={{ uri: webViewUrl }}
					userAgent="Mozilla/5.0 (Mobile; rv:1.0) MySpeak/1.0.0 ReactNative"
					className="flex-1"
					onLoad={() => {
						console.log("WebView loaded:", webViewUrl);
					}}
					onMessage={handleWebViewMessage}
					onNavigationStateChange={handleNavigationStateChange}
					onError={(syntheticEvent) => {
						const { nativeEvent } = syntheticEvent;
						console.error("WebView error:", nativeEvent);
					}}
					onHttpError={(syntheticEvent) => {
						const { nativeEvent } = syntheticEvent;
						console.error("WebView HTTP error:", nativeEvent);
					}}
					startInLoadingState={true}
					renderLoading={() => (
						<View className="absolute inset-0 bg-white justify-center items-center px-6">
							<View className="mb-8">
								<Text className="text-3xl font-bold text-primary text-center">
									My Speak
								</Text>
							</View>
							<ActivityIndicator
								size="large"
								color="#1e9aff"
								className="my-6"
							/>
							<View className="items-center mt-4">
								<Text className="text-sm text-stage-1 text-center opacity-80">
									Preparing your lesson
								</Text>
							</View>
						</View>
					)}
					mixedContentMode="compatibility"
					originWhitelist={["*"]}
					cacheEnabled={true}
					allowsBackForwardNavigationGestures={true}
					thirdPartyCookiesEnabled={true}
					javaScriptEnabled={true}
				/>
			</View>
		);
	},
);

SimpleWebView.displayName = "SimpleWebView";

export default SimpleWebView;
