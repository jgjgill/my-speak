import { useCallback, useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";
import { useAuth } from "@/context/auth";
import { supabase } from "@/utils/supabase/client";
import { getWebViewUrl } from "@/utils/webview-url";

export default function SimpleWebView() {
	const webViewRef = useRef<WebView>(null);
	const { user, isLoading } = useAuth();
	const webViewUrl = getWebViewUrl();

	// 웹뷰에 인증 정보와 세션 전송
	const sendAuthToWebView = useCallback(async () => {
		if (webViewRef.current && user) {
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

				webViewRef.current.postMessage(JSON.stringify(authData));
			} catch (error) {
				console.error("Error getting session:", error);
			}
		}
	}, [user]);

	// 웹뷰에 로그아웃 메시지 전송
	const sendLogoutToWebView = useCallback(() => {
		if (webViewRef.current) {
			const logoutData = {
				type: "LOGOUT",
			};
			webViewRef.current.postMessage(JSON.stringify(logoutData));
		}
	}, []);

	// 웹뷰로부터 메시지 수신
	const handleWebViewMessage = (event: WebViewMessageEvent) => {
		try {
			const message = JSON.parse(event.nativeEvent.data);

			if (message.type === "REQUEST_AUTH") {
				sendAuthToWebView();
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
				ref={webViewRef}
				source={{ uri: webViewUrl }}
				style={styles.webView}
				onLoad={() => {
					console.log("WebView loaded:", webViewUrl);
					// 초기 로드 시에만 한 번 전송, REQUEST_AUTH 요청 시 추가 전송
				}}
				onMessage={handleWebViewMessage}
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
					<View style={styles.loadingContainer}>
						<Text>Loading...</Text>
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
}

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
});
