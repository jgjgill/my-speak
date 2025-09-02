import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { Suspense } from "react";

import "./global.css";
import { headers } from "next/headers";
import ConditionalHeader from "./components/conditional-header";
import GoogleAnalytics from "./components/google-analytics";
import NativeBridge from "./components/native-bridge";
import StructuredData from "./components/structured-data";
import { AuthProvider } from "./contexts/auth-context";
import { WebViewProvider } from "./contexts/webview-context";
import QueryProvider from "./providers/query-provider";
import { getCurrentUser } from "./utils/auth/server";

export const metadata: Metadata = {
	title: {
		default: "My Speak - 언어 학습 플랫폼",
		template: "%s | My Speak",
	},
	description:
		"한국어→외국어 번역과 키워드 스피치를 통한 4단계 학습 시스템으로 스피킹을 효과적으로 학습하세요.",
	keywords: [
		"스피킹 연습",
		"언어 학습",
		"번역 학습",
		"키워드 스피치",
		"언어 교육",
		"영어 회화",
		"영어 학습",
		"일본어 회화",
		"일본어 학습",
	],
	authors: [{ name: "My Speak" }],
	creator: "My Speak",
	publisher: "My Speak",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	metadataBase: new URL("https://my-speak.com"),
	openGraph: {
		type: "website",
		locale: "ko_KR",
		url: "https://my-speak.com",
		siteName: "My Speak",
		title: "My Speak - 언어 학습 플랫폼",
		description:
			"한국어→외국어 번역과 키워드 스피치를 통한 4단계 학습 시스템으로 외국어 스피킹을 효과적으로 학습하세요.",
		images: [
			{
				url: "/app-icon.png",
				width: 512,
				height: 512,
				alt: "My Speak 로고",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "My Speak - 언어 학습 플랫폼",
		description:
			"한국어→외국어 번역과 키워드 스피치를 통한 4단계 학습 시스템으로 외국어 스피킹을 효과적으로 학습하세요.",
		images: ["/app-icon.png"],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	verification: {
		google: "K5Hasaf0ZKQkUeZlUv9efXDzOdiVV2DXGl2TSD_wI7g",
	},
};

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
				<GoogleAnalytics />
				<StructuredData />
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
