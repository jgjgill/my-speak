import {
	createContext,
	type PropsWithChildren,
	type RefObject,
	useContext,
	useRef,
} from "react";
import type { WebView } from "react-native-webview";

interface WebViewContextType {
	webViewRef: RefObject<WebView | null>;
}

const WebViewContext = createContext<WebViewContextType | undefined>(undefined);

export function WebViewProvider({ children }: PropsWithChildren) {
	const webViewRef = useRef<WebView>(null);

	return (
		<WebViewContext.Provider value={{ webViewRef }}>
			{children}
		</WebViewContext.Provider>
	);
}

export function useWebViewRef() {
	const context = useContext(WebViewContext);
	if (!context) {
		throw new Error("useWebViewRef must be used within WebViewProvider");
	}
	return context.webViewRef;
}
