import type { Metadata } from "next";
import { Suspense } from "react";
import { type LanguageCode, languageInfo } from "@/shared/config/languages";
import { ExpressionsList } from "@/widgets/expressions-list";

interface ExpressionsPageProps {
	params: Promise<{ language: string }>;
}

export async function generateMetadata({
	params,
}: ExpressionsPageProps): Promise<Metadata> {
	const { language } = await params;
	const currentLanguage = languageInfo[language as LanguageCode];

	const title = `${currentLanguage?.nativeName || language.toUpperCase()} Expressions`;
	const description = `${currentLanguage?.name || language} 필수 표현을 학습하고 빈칸 채우기로 실전 감각을 키우세요.`;

	return {
		title,
		description,
		keywords: [
			`${currentLanguage?.name || language} expressions`,
			"필수 표현",
			"빈칸 채우기",
			"회화 표현",
		],
		openGraph: {
			title: `${title} | My Speak`,
			description,
			url: `https://my-speak.com/${language}/expressions`,
			type: "website",
		},
		twitter: {
			title: `${title} | My Speak`,
			description,
		},
		alternates: {
			canonical: `/${language}/expressions`,
		},
	};
}

export default async function ExpressionsPage({
	params,
}: ExpressionsPageProps) {
	const { language } = await params;
	const currentLanguage = languageInfo[language as LanguageCode];

	return (
		<div className="min-h-screen">
			<div>
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center gap-3">
						<div>
							<h1 className="text-title font-bold text-korean">
								{currentLanguage?.nativeName || language.toUpperCase()}{" "}
								Expressions {currentLanguage?.flag || ""}
							</h1>
							<p className="text-caption text-gray-500">
								필수 표현 학습 - 빈칸 채우기 연습
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<Suspense fallback={<div>Loading...</div>}>
					<ExpressionsList />
				</Suspense>
			</div>
		</div>
	);
}
