import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import "../../app/global.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { headers } from "next/headers";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import {
	AuthProvider,
	QueryProvider,
	ToastProvider,
	WebViewProvider,
} from "@/app/providers";
import { getCurrentUser } from "@/shared/lib/auth/server";
import ConditionalHeader from "../../app/components/conditional-header";
import GoogleAnalytics from "../../app/components/google-analytics";
import NativeBridge from "../../app/components/native-bridge";
import StructuredData from "../../app/components/structured-data";
import ToastContainer from "../../app/components/toast-container";

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
				url: "/og-image.png",
				alt: "My Speak 로고",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "My Speak - 언어 학습 플랫폼",
		description:
			"한국어→외국어 번역과 키워드 스피치를 통한 4단계 학습 시스템으로 외국어 스피킹을 효과적으로 학습하세요.",
		images: ["/og-image.png"],
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
					<NuqsAdapter>
						<AuthProvider initialUser={initialUser}>
							<ToastProvider>
								<WebViewProvider
									initialIsWebView={initialIsWebView}
									initialHideHeader={initialHideHeader}
								>
									<NativeBridge />
									<ConditionalHeader />
									<main>{children}</main>
									<ToastContainer />
									<SpeedInsights />
								</WebViewProvider>
							</ToastProvider>
						</AuthProvider>
					</NuqsAdapter>
				</QueryProvider>
			</body>
		</html>
	);
}
