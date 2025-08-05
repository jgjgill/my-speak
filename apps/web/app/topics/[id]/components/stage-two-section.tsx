import type { Tables } from "@repo/typescript-config/supabase-types";
import type { User } from "@supabase/supabase-js";
import Highlighter from "react-highlight-words";
import { createClient } from "../../../utils/supabase/server";

type LearningPoint = Tables<"learning_points">;

interface StageTwoSectionProps {
	topicId: string;
	user: User | null;
}

export default async function StageTwoSection({
	topicId,
	user,
}: StageTwoSectionProps) {
	const supabase = await createClient();

	const [
		koreanResult,
		englishResult,
		learningPointsResult,
		userTranslationsResult,
		userSelectedPointsResult,
	] = await Promise.all([
		supabase
			.from("korean_scripts")
			.select("*")
			.eq("topic_id", topicId)
			.order("sentence_order"),

		supabase
			.from("english_scripts")
			.select("*")
			.eq("topic_id", topicId)
			.order("sentence_order"),

		supabase
			.from("learning_points")
			.select("*")
			.eq("topic_id", topicId)
			.order("sentence_order"),

		user
			? supabase
					.from("user_translations")
					.select("*")
					.eq("user_id", user.id)
					.eq("topic_id", topicId)
			: Promise.resolve({ data: null, error: null }),

		user
			? supabase
					.from("user_selected_points")
					.select("learning_point_id")
					.eq("user_id", user.id)
					.eq("topic_id", topicId)
			: Promise.resolve({ data: null, error: null }),
	]);

	const koreanScripts = koreanResult.data || [];
	const englishScripts = englishResult.data || [];
	const learningPoints = learningPointsResult.data || [];
	const userTranslations = userTranslationsResult.data || [];
	const userSelectedPoints = userSelectedPointsResult.data || [];

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
		{} as Record<number, LearningPoint[]>,
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
		<div className="border p-4 mb-6">
			<h2 className="text-xl font-bold mb-4">2단계: 영어 스크립트</h2>

			<div className="mb-6">
				<h3 className="font-bold mb-3">한글 ↔ 영어 비교</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<h4 className="font-semibold mb-2">한글</h4>
						<div>
							{koreanScripts.map((script, index) => (
								<span key={script.id}>
									{script.korean_text}
									{index < koreanScripts.length - 1 && " "}
								</span>
							))}
						</div>
					</div>
					<div>
						<h4 className="font-semibold mb-2">영어</h4>
						<div>
							{englishScripts.map((script, index) => (
								<span key={script.id}>
									{script.english_text}
									{index < englishScripts.length - 1 && " "}
								</span>
							))}
						</div>
					</div>
				</div>
			</div>

			<div className="mb-6">
				<h3 className="font-bold mb-3">문장별 한영 비교</h3>

				<div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded">
					<h4 className="font-semibold mb-2">1단계에서 체크한 학습 포인트</h4>
					<div className="flex items-center gap-2 text-sm">
						<span className="bg-orange-200 px-2 py-1 rounded">강조 표현</span>
						<span>← 로그인 사용자만 표시됩니다</span>
					</div>
				</div>

				{koreanScripts.map((script, index) => {
					const userTranslation = userTranslations.find(
						(t) => t.sentence_order === script.sentence_order,
					);
					const selectedKoreanKeywords = getSelectedKoreanKeywords(
						script.sentence_order,
					);
					const selectedEnglishKeywords = getSelectedEnglishKeywords(
						script.sentence_order,
					);

					return (
						<div key={script.id} className="mb-4 p-2 border">
							<span className="font-semibold">문장 {index + 1}</span>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
								<div>
									<span className="text-sm font-medium">한글</span>
									<div className="leading-relaxed">
										<Highlighter
											searchWords={selectedKoreanKeywords}
											textToHighlight={script.korean_text}
											highlightClassName="bg-orange-200 px-1 rounded"
										/>
									</div>
								</div>

								<div>
									<span className="text-sm font-medium">번역</span>
									<div className="leading-relaxed">
										<Highlighter
											searchWords={selectedEnglishKeywords}
											textToHighlight={
												englishScripts[index]?.english_text || ""
											}
											highlightClassName="bg-orange-200 px-1 rounded"
										/>
									</div>
								</div>

								<details>
									<summary className="cursor-pointer text-sm font-light">
										내 번역
									</summary>
									{userTranslation && (
										<p className="bg-blue-50 text-sm p-2 font-light rounded">
											{userTranslation.user_translation}
										</p>
									)}
									{!userTranslation && (
										<p className="text-gray-500 text-sm italic font-light">
											로그인시 번역한 내용도 같이 볼 수 있어요.
										</p>
									)}
								</details>
							</div>
						</div>
					);
				})}
			</div>

			<div className="mb-6">
				<h3 className="font-bold mb-3">끊어읽기 발음 연습</h3>
				<p className="text-sm mb-4">
					| 표시된 곳에서 잠깐 멈춤, || 표시된 곳에서 긴 호흡을 하며 읽어보세요.
				</p>

				{englishScripts.map((script, index) => (
					<div key={script.id} className="mb-3 p-2 border">
						<span className="text-sm">발음 연습 {index + 1}</span>
						<p>{script.chunked_text}</p>
					</div>
				))}

				<div className="mt-6 p-3 border">
					<h4 className="font-bold mb-3">전체 끊어읽기 스크립트</h4>
					<p className="text-sm mb-3">이제 전체를 한 번에 따라 읽어보세요.</p>
					<div>
						{englishScripts.map((script, index) => (
							<span key={script.id}>
								{script.chunked_text}
								{index < englishScripts.length - 1 && " || "}
							</span>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
