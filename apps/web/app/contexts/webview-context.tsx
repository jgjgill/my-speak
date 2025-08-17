"use client";

import {
	createContext,
	type PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";

interface WebViewContextType {
	isWebView: boolean;
	hideHeader: boolean;
}

const WebViewContext = createContext<WebViewContextType | undefined>(undefined);

interface WebViewProviderProps extends PropsWithChildren {
	initialIsWebView?: boolean;
	initialHideHeader?: boolean;
}

export function WebViewProvider({
	children,
	initialIsWebView = false,
	initialHideHeader = false,
}: WebViewProviderProps) {
	const [isWebView, setIsWebView] = useState(initialIsWebView);
	const [hideHeader, setHideHeader] = useState(initialHideHeader);

	useEffect(() => {
		if (initialIsWebView || initialHideHeader) {
			sessionStorage.setItem("isWebView", initialIsWebView.toString());
			sessionStorage.setItem("hideHeader", initialHideHeader.toString());
			return;
		}

		const storedWebView = sessionStorage.getItem("isWebView") === "true";
		const storedHideHeader = sessionStorage.getItem("hideHeader") === "true";

		if (storedWebView || storedHideHeader) {
			setIsWebView(storedWebView);
			setHideHeader(storedHideHeader);
		}
	}, [initialIsWebView, initialHideHeader]);

	return (
		<WebViewContext.Provider value={{ isWebView, hideHeader }}>
			{children}
		</WebViewContext.Provider>
	);
}

export function useWebView() {
	const context = useContext(WebViewContext);
	if (!context) {
		throw new Error("useWebView must be used within a WebViewProvider");
	}
	return context;
}
