import {
	createContext,
	type PropsWithChildren,
	type RefObject,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import type { WebView } from "react-native-webview";
import { getWebViewUrl } from "@/utils/webview-url";
import { useDeepLink } from "./deep-link-context";

interface WebViewContextType {
	webViewRef: RefObject<WebView | null>;
	webViewUrl: string;
	updateWebViewUrl: (path?: string) => void;
}

const WebViewContext = createContext<WebViewContextType | undefined>(undefined);

export function WebViewProvider({ children }: PropsWithChildren) {
	const webViewRef = useRef<WebView>(null);
	const { initialPath } = useDeepLink();
	const [webViewUrl, setWebViewUrl] = useState<string>("");
	const hasUsedDeepLinkRef = useRef(false);

	// 웹뷰 URL 초기화 및 업데이트
	useEffect(() => {
		const shouldUseInitialPath = !hasUsedDeepLinkRef.current && initialPath;
		const url = getWebViewUrl(shouldUseInitialPath ? initialPath : undefined);
		setWebViewUrl(url);

		if (shouldUseInitialPath) {
			hasUsedDeepLinkRef.current = true;
		}
	}, [initialPath]);

	const updateWebViewUrl = (path?: string) => {
		const url = getWebViewUrl(path);
		setWebViewUrl(url);
	};

	const value: WebViewContextType = {
		webViewRef,
		webViewUrl,
		updateWebViewUrl,
	};

	return (
		<WebViewContext.Provider value={value}>{children}</WebViewContext.Provider>
	);
}

export function useWebView() {
	const context = useContext(WebViewContext);
	if (!context) {
		throw new Error("useWebView must be used within WebViewProvider");
	}
	return context;
}
