import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "서비스 약관",
	description:
		"My Speak 서비스 이용약관을 확인하세요. 언어 학습 서비스 이용에 관한 상세한 조건과 정책을 안내합니다.",
	keywords: [
		"서비스 약관",
		"이용약관",
		"My Speak 약관",
		"언어 학습 서비스",
		"서비스 정책",
	],
	openGraph: {
		title: "서비스 약관 | My Speak",
		description: "My Speak 서비스 이용약관을 확인하세요.",
		url: "https://my-speak.com/terms",
		type: "website",
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default function TermsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
