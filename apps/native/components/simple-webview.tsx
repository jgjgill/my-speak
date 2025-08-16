import { useEffect, useRef, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";
import { useAuth } from "@/context/auth";
import { supabase } from "@/utils/supabase/client";
import { WEB_APP_URL } from "@/utils/constants";

export default function SimpleWebView() {
	const webViewRef = useRef<WebView>(null);
	const { user, isLoading } = useAuth();
	const webViewUrl =
		`${WEB_APP_URL}?native=true&hideHeader=true` || "http://localhost:3000";

	console.log("WebView URL:", webViewUrl);

	// 웹뷰에 인증 정보와 세션 전송
	const sendAuthToWebView = useCallback(async () => {
		if (webViewRef.current && user) {
			try {
				// Supabase 세션 정보 가져오기
				const { data: { session }, error } = await supabase.auth.getSession();
				
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
					session: session ? {
						access_token: session.access_token,
						refresh_token: session.refresh_token,
						expires_at: session.expires_at
					} : null
				};

				console.log("📤 Sending auth data with session to WebView:", authData);
				webViewRef.current.postMessage(JSON.stringify(authData));
			} catch (error) {
				console.error("Error getting session:", error);
			}
		}
	}, [user]);

	// 웹뷰로부터 메시지 수신
	const handleWebViewMessage = (event: WebViewMessageEvent) => {
		try {
			const message = JSON.parse(event.nativeEvent.data);
			console.log("Message from WebView:", message);

			if (message.type === "REQUEST_AUTH") {
				sendAuthToWebView();
			}
		} catch (error) {
			console.error("Failed to parse WebView message:", error);
		}
	};

	// 사용자 로그인 완료 후 인증 정보 전송
	useEffect(() => {
		if (user && !isLoading) {
			const timer = setTimeout(() => {
				sendAuthToWebView();
			}, 1000); // 웹뷰 로딩 대기

			return () => clearTimeout(timer);
		}
	}, [user, isLoading, sendAuthToWebView]);

	return (
		<View style={styles.container}>
			<WebView
				ref={webViewRef}
				source={{ uri: webViewUrl }}
				style={styles.webView}
				onLoad={() => {
					console.log("WebView loaded successfully");
					sendAuthToWebView();
				}}
				onMessage={handleWebViewMessage}
				onError={(error) => console.error("WebView error:", error)}
				onLoadStart={() => console.log("WebView loading started")}
				onLoadEnd={() => console.log("WebView loading ended")}
				startInLoadingState={true}
				renderLoading={() => (
					<View style={styles.loadingContainer}>
						<Text>Loading...</Text>
					</View>
				)}
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
