import type { Metadata } from "next";
import { Suspense } from "react";
import { getTopic } from "@/entities/topic";
import { createClient } from "@/shared/api/supabase/server";
import { type LanguageCode, languageInfo } from "@/shared/config";
import { TopicClientWrapperServer } from "@/widgets/topic";
import FloatingAppButton from "./floating-app-button";
import TopicClientWrapperSkeleton from "./skeletons/topic-client-wrapper-skeleton";
import TopicHeaderSkeleton from "./skeletons/topic-header-skeleton";
import TopicHeader from "./topic-header";

type Props = {
	params: Promise<{ id: string; language: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id, language } = await params;
	const supabase = await createClient();

	try {
		const topic = await getTopic(id, supabase);
		const currentLanguage = languageInfo[language as LanguageCode];

		const title = `${topic.title} - ${currentLanguage?.nativeName || language.toUpperCase()} 학습`;
		const description = `${topic.title} 주제로 ${currentLanguage?.name || language} 스피킹을 학습하세요. 4단계 체계적 학습 시스템으로 번역부터 키워드 스피치까지 완성하세요.`;

		return {
			title,
			description,
			keywords: [
				topic.title,
				`${currentLanguage?.name || language} 학습`,
				"스피킹 연습",
				"4단계 학습",
				"번역 학습",
				"키워드 스피치",
				`${currentLanguage?.nativeName || language} 회화`,
			],
			openGraph: {
				title: `${title} | My Speak`,
				description,
				url: `https://my-speak.com/${language}/topics/${id}`,
				type: "article",
				publishedTime: topic.created_at,
			},
			twitter: {
				title: `${title} | My Speak`,
				description,
				card: "summary_large_image",
			},
			alternates: {
				canonical: `/${language}/topics/${id}`,
			},
		};
	} catch {
		// Fallback metadata if topic fetch fails
		const currentLanguage = languageInfo[language as LanguageCode];
		return {
			title: `${currentLanguage?.nativeName || language.toUpperCase()} 학습 주제`,
			description: `${currentLanguage?.name || language} 스피킹 학습을 위한 주제입니다.`,
		};
	}
}

export default async function TopicDetailPage({ params }: Props) {
	const { id } = await params;

	return (
		<>
			<div className="p-4 min-h-screen">
				<Suspense fallback={<TopicHeaderSkeleton />}>
					<TopicHeader topicId={id} />
				</Suspense>

				<Suspense fallback={<TopicClientWrapperSkeleton />}>
					<TopicClientWrapperServer topicId={id} />
				</Suspense>
			</div>

			<FloatingAppButton />
		</>
	);
}
