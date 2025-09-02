import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "로그인",
	description:
		"My Speak에 로그인하여 개인화된 언어 학습을 시작하세요. Google, Apple 계정으로 간편하게 로그인할 수 있습니다.",
	keywords: [
		"로그인",
		"회원가입",
		"Google 로그인",
		"Apple 로그인",
		"언어 학습 로그인",
		"My Speak 로그인",
	],
	openGraph: {
		title: "로그인 | My Speak",
		description: "My Speak에 로그인하여 개인화된 언어 학습을 시작하세요.",
		url: "https://my-speak.com/login",
		type: "website",
	},
	robots: {
		index: false,
		follow: true,
	},
};

export default function LoginLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
