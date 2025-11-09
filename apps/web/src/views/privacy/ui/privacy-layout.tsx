import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "개인정보 처리방침",
	description:
		"My Speak의 개인정보 처리방침을 확인하세요. 개인정보 수집, 이용, 보관 및 파기에 관한 상세한 정책을 안내합니다.",
	keywords: [
		"개인정보 처리방침",
		"개인정보 보호정책",
		"My Speak 개인정보",
		"개인정보 수집",
		"데이터 보호",
	],
	openGraph: {
		title: "개인정보 처리방침 | My Speak",
		description: "My Speak의 개인정보 처리방침을 확인하세요.",
		url: "https://my-speak.com/privacy",
		type: "website",
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default function PrivacyLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
