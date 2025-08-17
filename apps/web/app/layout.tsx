import type { PropsWithChildren } from "react";
import { Suspense } from "react";

import "./global.css";
import { headers } from "next/headers";
import ConditionalHeader from "./components/conditional-header";
import NativeBridge from "./components/native-bridge";
import { AuthProvider } from "./contexts/auth-context";
import { WebViewProvider } from "./contexts/webview-context";
import QueryProvider from "./providers/query-provider";
import { getCurrentUser } from "./utils/auth/server";

interface RootLayoutProps extends PropsWithChildren {}

export default async function Layout({ children }: RootLayoutProps) {
	const initialUser = await getCurrentUser();

	const headerStore = await headers();
	const searchParams = Object.fromEntries(
		new URLSearchParams(headerStore.get("searchParams") || ""),
	);

	const params = searchParams;

	const initialIsWebView = params.native === "true";
	const initialHideHeader = params.hideHeader === "true";

	return (
		<html lang="ko">
			<body>
				<QueryProvider>
					<AuthProvider initialUser={initialUser}>
						<Suspense fallback={null}>
							<WebViewProvider
								initialIsWebView={initialIsWebView}
								initialHideHeader={initialHideHeader}
							>
								<NativeBridge />
								<ConditionalHeader />
								<main>{children}</main>
							</WebViewProvider>
						</Suspense>
					</AuthProvider>
				</QueryProvider>
			</body>
		</html>
	);
}
