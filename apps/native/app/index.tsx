import { useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { WebView } from "react-native-webview";
import NativeHeader from "@/components/native-header";
import SimpleWebView from "@/components/simple-webview";
import { useAuth } from "@/context/auth";
import { getWebViewUrl } from "@/utils/webview-url";

export default function Index() {
	const { isLoading } = useAuth();
	const webViewRef = useRef<WebView>(null);
	const webViewUrl = getWebViewUrl();
	const [currentUrl, setCurrentUrl] = useState(webViewUrl);

	console.log(currentUrl, 123);
	const handleWebViewBack = () => {
		if (webViewRef.current) {
			const goBackMessage = {
				type: "GO_BACK",
			};
			webViewRef.current.postMessage(JSON.stringify(goBackMessage));
		}
	};

	const handleUrlChange = (url: string) => {
		setCurrentUrl(url);
	};

	if (isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
			<NativeHeader currentUrl={currentUrl} onWebViewBack={handleWebViewBack} />
			<SimpleWebView ref={webViewRef} onUrlChange={handleUrlChange} />
		</SafeAreaView>
	);
}
