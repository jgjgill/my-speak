import { forwardRef, useCallback, useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
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
			<View style={styles.container}>
				<WebView
					ref={ref}
					source={{ uri: webViewUrl }}
					style={styles.webView}
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
						<View style={styles.brandedLoadingContainer}>
							<View style={styles.logoContainer}>
								<Text style={styles.logoText}>My Speak</Text>
							</View>
							<ActivityIndicator
								size="large"
								color="#1E40AF"
								style={styles.spinner}
							/>
							<View style={styles.messageContainer}>
								<Text style={styles.secondaryMessage}>
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	webView: {
		flex: 1,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	brandedLoadingContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "#FFFFFF",
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 24,
	},
	logoContainer: {
		marginBottom: 32,
	},
	logoText: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#1E40AF",
		textAlign: "center",
	},
	spinner: {
		marginVertical: 24,
	},
	messageContainer: {
		alignItems: "center",
		marginTop: 16,
	},
	primaryMessage: {
		fontSize: 18,
		fontWeight: "600",
		color: "#1E40AF",
		textAlign: "center",
		marginBottom: 8,
	},
	secondaryMessage: {
		fontSize: 14,
		color: "#3B82F6",
		textAlign: "center",
		opacity: 0.8,
	},
});

export default SimpleWebView;
