import { createSafeContext } from "../create-safe-context";

export interface WebViewContextType {
	isWebView: boolean;
	hideHeader: boolean;
}

export const [WebViewProvider, useWebView] =
	createSafeContext<WebViewContextType>("WebView");
