"use client";

import { type PropsWithChildren, useEffect, useState } from "react";
import { WebViewProvider as WebViewContextProvider } from "@/shared/lib/webview";

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
		<WebViewContextProvider value={{ isWebView, hideHeader }}>
			{children}
		</WebViewContextProvider>
	);
}
