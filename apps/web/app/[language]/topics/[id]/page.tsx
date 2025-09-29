import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { Suspense } from "react";
import { type LanguageCode, languageInfo } from "../../../constants/languages";
import { getCurrentUser } from "../../../utils/auth/server";
import { createClient } from "../../../utils/supabase/server";
import FloatingAppButton from "./components/floating-app-button";
import TopicClientWrapperSkeleton from "./components/skeletons/topic-client-wrapper-skeleton";
import TopicHeaderSkeleton from "./components/skeletons/topic-header-skeleton";
import TopicClientWrapper from "./components/topic-client-wrapper";
import TopicHeader from "./components/topic-header";
import { getEmptyUserSelectedPoints } from "./hooks/use-stage-one-public-data";
import {
	getForeignScripts,
	getKeywordSpeeches,
	getKoreanScripts,
	getLearningPoints,
	getUserSelectedPoints,
} from "./queries/stage-queries";
import { getTopic } from "./queries/topic-info-queries";

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
	const currentUser = await getCurrentUser();
	const supabase = await createClient();

	const queryClient = new QueryClient();

	const getUserProgress = async () => {
		if (!currentUser) return 1;

		const { data, error } = await supabase
			.from("user_progress")
			.select("current_stage")
			.eq("user_id", currentUser.id)
			.eq("topic_id", id)
			.maybeSingle();

		if (error) throw error;
		return data?.current_stage || 1;
	};

	const getGuestProgress = async () => 1;

	queryClient.prefetchQuery({
		queryKey: ["topic", id],
		queryFn: () => getTopic(id, supabase),
	});

	await Promise.all([
		queryClient.prefetchQuery({
			queryKey: ["korean-scripts", id],
			queryFn: () => getKoreanScripts(id, supabase),
		}),

		queryClient.prefetchQuery({
			queryKey: ["foreign-scripts", id],
			queryFn: () => getForeignScripts(id, supabase),
		}),

		queryClient.prefetchQuery({
			queryKey: ["learning-points", id],
			queryFn: () => getLearningPoints(id, supabase),
		}),

		queryClient.prefetchQuery({
			queryKey: [
				"user-selected-points",
				id,
				currentUser ? currentUser.id : "guest",
			],
			queryFn: currentUser
				? () => getUserSelectedPoints(id, currentUser, supabase)
				: getEmptyUserSelectedPoints,
		}),
		queryClient.prefetchQuery({
			queryKey: ["user-progress", id, currentUser ? currentUser.id : "guest"],
			queryFn: currentUser ? getUserProgress : getGuestProgress,
		}),
		queryClient.prefetchQuery({
			queryKey: ["keyword-speeches", id],
			queryFn: () => getKeywordSpeeches(id, supabase),
		}),
	]);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className="p-4">
				<Suspense fallback={<TopicHeaderSkeleton />}>
					<TopicHeader topicId={id} />
				</Suspense>

				<Suspense fallback={<TopicClientWrapperSkeleton />}>
					<TopicClientWrapper topicId={id} />
				</Suspense>
			</div>

			<FloatingAppButton />
		</HydrationBoundary>
	);
}
