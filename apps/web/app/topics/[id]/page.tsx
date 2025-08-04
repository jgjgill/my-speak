import { notFound } from "next/navigation";
import { createClient } from "../../utils/supabase/server";
import StageFourSection from "./components/stage-four-section";
import StageOnePractice from "./components/stage-one-practice";
import StageThreeSection from "./components/stage-three-section";
import StageTwoSection from "./components/stage-two-section";
import TopicHeader from "./components/topic-header";

type Props = {
	params: Promise<{ id: string }>;
};

export default async function TopicDetailPage({ params }: Props) {
	const { id } = await params;
	const supabase = await createClient();

	const { data: topic, error: topicError } = await supabase
		.from("topics")
		.select("*")
		.eq("id", id)
		.single();

	if (topicError || !topic) {
		notFound();
	}

	const {
		data: { user },
	} = await supabase.auth.getUser();

	const [
		koreanResult,
		englishResult,
		keywordResult,
		learningPointsResult,
		userTranslationsResult,
		userSelectedPointsResult,
	] = await Promise.all([
		supabase
			.from("korean_scripts")
			.select("*")
			.eq("topic_id", id)
			.order("sentence_order"),

		supabase
			.from("english_scripts")
			.select("*")
			.eq("topic_id", id)
			.order("sentence_order"),

		supabase
			.from("keyword_speeches")
			.select("*")
			.eq("topic_id", id)
			.order("sequence_order"),

		supabase
			.from("learning_points")
			.select("*")
			.eq("topic_id", id)
			.order("sentence_order"),

		user
			? supabase
					.from("user_translations")
					.select("*")
					.eq("user_id", user.id)
					.eq("topic_id", id)
			: Promise.resolve({ data: null, error: null }),

		user
			? supabase
					.from("user_selected_points")
					.select("learning_point_id")
					.eq("user_id", user.id)
					.eq("topic_id", id)
			: Promise.resolve({ data: null, error: null }),
	]);

	const koreanScripts = koreanResult.data || [];
	const englishScripts = englishResult.data || [];
	const keywordSpeeches = keywordResult.data || [];
	const learningPoints = learningPointsResult.data || [];
	const userTranslations = userTranslationsResult.data || [];
	const userSelectedPoints = userSelectedPointsResult.data || [];

	const learningPointsByOrder = learningPoints.reduce(
		(acc, point) => {
			if (!acc[point.sentence_order]) {
				acc[point.sentence_order] = [];
			}

			acc[point.sentence_order]?.push(point);
			return acc;
		},
		{} as Record<number, typeof learningPoints>,
	);

	const initialUserProgress = userTranslations.reduce(
		(acc, translation) => {
			acc[translation.sentence_order] = {
				translation: translation.user_translation,
				isCompleted: translation.is_completed || false,
				timestamp: translation.updated_at
					? new Date(translation.updated_at)
					: undefined,
			};
			return acc;
		},
		{} as Record<
			number,
			{ translation?: string; isCompleted?: boolean; timestamp?: Date }
		>,
	);

	const initialSelectedPoints = new Set(
		userSelectedPoints
			.map((point) => {
				const learningPoint = learningPoints.find(
					(lp) => lp.id === point.learning_point_id,
				);
				return learningPoint
					? `${learningPoint.sentence_order}-${point.learning_point_id}`
					: "";
			})
			.filter(Boolean),
	);

	const selectedLearningPointsByOrder = userSelectedPoints.reduce(
		(acc, point) => {
			const learningPoint = learningPoints.find(
				(lp) => lp.id === point.learning_point_id,
			);
			if (learningPoint) {
				if (!acc[learningPoint.sentence_order]) {
					acc[learningPoint.sentence_order] = [];
				}
				acc[learningPoint.sentence_order]?.push(learningPoint);
			}
			return acc;
		},
		{} as Record<number, typeof learningPoints>,
	);

	const getSelectedKoreanKeywords = (sentenceOrder: number) => {
		const points = selectedLearningPointsByOrder[sentenceOrder] || [];
		return points.map((point) => point.korean_phrase);
	};

	const getSelectedEnglishKeywords = (sentenceOrder: number) => {
		const points = selectedLearningPointsByOrder[sentenceOrder] || [];
		return points.map((point) => point.english_phrase);
	};

	return (
		<div className="p-4">
			<TopicHeader topic={topic} />

			<div className="border p-4 mb-6">
				<h2 className="text-xl font-bold mb-4">1단계: 한글 스크립트</h2>

				<div className="mb-6">
					<h3 className="font-bold mb-3">전체 한글 스크립트</h3>
					<div>
						{koreanScripts.map((script, index) => (
							<span key={script.id}>
								{script.korean_text}
								{index < koreanScripts.length - 1 && " "}
							</span>
						))}
					</div>
				</div>

				<div className="mb-4 p-3 border">
					<strong>미션:</strong> 아래 한글 문장들을 영어로 번역해보세요.
					완벽하지 않아도 괜찮습니다!
				</div>

				<StageOnePractice
					koreanScripts={koreanScripts}
					learningPointsByOrder={learningPointsByOrder}
					topicId={id}
					initialUserProgress={initialUserProgress}
					initialSelectedPoints={initialSelectedPoints}
				/>
			</div>

			<StageTwoSection
				koreanScripts={koreanScripts}
				englishScripts={englishScripts}
				userTranslations={userTranslations}
				getSelectedKoreanKeywords={getSelectedKoreanKeywords}
				getSelectedEnglishKeywords={getSelectedEnglishKeywords}
			/>

			<StageThreeSection
				koreanScripts={koreanScripts}
				englishScripts={englishScripts}
				getSelectedKoreanKeywords={getSelectedKoreanKeywords}
			/>

			<StageFourSection keywordSpeeches={keywordSpeeches} />
		</div>
	);
}
