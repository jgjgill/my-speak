import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "../../utils/supabase/server";
import { TopicsList } from "./components/topics-list";
import { TopicsLoading } from "./components/topics-loading";
import { getTopics } from "./queries/topics-queries";

interface TopicsPageProps {
	params: Promise<{ language: string }>;
}

const languageInfo = {
	en: { name: "영어", nativeName: "English", topicsText: "Topics", flag: "🇺🇸" },
	jp: {
		name: "일본어",
		nativeName: "日本語",
		topicsText: "トピック",
		flag: "🇯🇵",
	},
} as const;

export async function generateMetadata({
	params,
}: TopicsPageProps): Promise<Metadata> {
	const { language } = await params;
	const currentLanguage = languageInfo[language as keyof typeof languageInfo];

	const title = `${currentLanguage?.nativeName || language.toUpperCase()} ${currentLanguage?.topicsText || "Topics"}`;
	const description = `${currentLanguage?.name || language} 학습을 위한 다양한 주제들을 탐색하고 4단계 체계적 학습으로 스피킹 실력을 향상시키세요.`;

	return {
		title,
		description,
		keywords: [
			`${currentLanguage?.name || language} 학습`,
			"스피킹 연습",
			"언어 학습 주제",
			"4단계 학습",
			`${currentLanguage?.nativeName || language} 회화`,
			"언어 교육",
		],
		openGraph: {
			title: `${title} | My Speak`,
			description,
			url: `https://my-speak.com/${language}/topics`,
			type: "website",
		},
		twitter: {
			title: `${title} | My Speak`,
			description,
		},
		alternates: {
			canonical: `/${language}/topics`,
		},
	};
}

export default async function TopicsPage({ params }: TopicsPageProps) {
	const { language } = await params;
	const supabase = await createClient();

	const queryClient = new QueryClient();

	await queryClient.prefetchInfiniteQuery({
		queryKey: ["topics", "infinite", { language }],
		queryFn: ({ pageParam = 0 }) =>
			getTopics({ page: pageParam, languageCode: language }, supabase),
		initialPageParam: 0,
	});

	const currentLanguage = languageInfo[language as keyof typeof languageInfo];

	return (
		<div className="min-h-screen">
			<div>
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center gap-3">
						<div>
							<h1 className="text-title font-bold text-korean">
								{currentLanguage?.nativeName || language.toUpperCase()}{" "}
								{currentLanguage?.topicsText || "Topics"}{" "}
								{currentLanguage?.flag || language.toUpperCase()}
							</h1>
							<p className="text-caption text-gray-500">
								{currentLanguage?.name || language} 학습 주제 목록
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* 콘텐츠 */}
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<HydrationBoundary state={dehydrate(queryClient)}>
					<Suspense fallback={<TopicsLoading />}>
						<TopicsList />
					</Suspense>
				</HydrationBoundary>
			</div>
		</div>
	);
}
