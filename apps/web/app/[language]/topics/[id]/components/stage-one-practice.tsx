"use client";

import type { Tables } from "@repo/typescript-config/supabase-types";
import { useState } from "react";
import { useAuth } from "../../../../contexts/auth-context";
import { createClient } from "../../../../utils/supabase/client";
import { useUserTranslations } from "../hooks/use-user-translations";
import KoreanSentenceHighlighter from "./korean-sentence-highlighter";
import PracticeHeader from "./practice-header";
import TranslationInputForm from "./translation-input-form";

type KoreanScript = Tables<"korean_scripts">;
type LearningPoint = Tables<"learning_points">;

interface StageOnePracticeProps {
	koreanScripts: KoreanScript[];
	learningPointsByOrder: Record<number, LearningPoint[]>;
	topicId: string;
	initialSelectedPoints: Set<string>;
	onStageComplete: () => Promise<void>;
}

const getLearningPointInfo = (
	learningPointsByOrder: Record<number, LearningPoint[]>,
	sentenceOrder: number,
	highlightedText: string,
) => {
	const points = learningPointsByOrder[sentenceOrder] || [];

	return points.find((point) => point.korean_phrase === highlightedText);
};

export default function StageOnePractice({
	koreanScripts,
	learningPointsByOrder,
	topicId,
	initialSelectedPoints,
	onStageComplete,
}: StageOnePracticeProps) {
	const { user } = useAuth();
	const supabase = createClient();

	const [selectedPoints, setSelectedPoints] = useState(initialSelectedPoints);
	const { data: userTranslations } = useUserTranslations(topicId, user);

	const handleTranslationSubmit = async (
		sentenceOrder: number,
		translated: string,
	) => {
		if (user) {
			try {
				const { error } = await supabase.from("user_translations").upsert(
					{
						user_id: user.id,
						topic_id: topicId,
						sentence_order: sentenceOrder,
						korean_text:
							koreanScripts.find((s) => s.sentence_order === sentenceOrder)
								?.korean_text || "",
						user_translation: translated,
						is_completed: true,
					},
					{ onConflict: "user_id,topic_id,sentence_order" },
				);

				alert("번역이 저장되었습니다!");

				if (error) {
					console.error("번역 저장 실패:", error.message);
				}
			} catch (error) {
				console.error("번역 저장 중 오류:", error);
			}
		}
	};

	const handleLearningPointClick = async (
		sentenceOrder: number,
		highlightedText: string,
	) => {
		const pointInfo = getLearningPointInfo(
			learningPointsByOrder,
			sentenceOrder,
			highlightedText,
		);

		if (pointInfo) {
			alert(`💡 ${pointInfo.english_phrase}`);

			if (user) {
				const pointKey = `${sentenceOrder}-${pointInfo.id}`;
				const isSelected = selectedPoints.has(pointKey);

				setSelectedPoints((prev) => {
					const newSet = new Set(prev);

					isSelected ? newSet.delete(pointKey) : newSet.add(pointKey);

					return newSet;
				});

				try {
					if (isSelected) {
						const { error } = await supabase
							.from("user_selected_points")
							.delete()
							.eq("user_id", user.id)
							.eq("learning_point_id", pointInfo.id);

						if (error) {
							throw error;
						}
					} else {
						const { error } = await supabase
							.from("user_selected_points")
							.upsert(
								{
									user_id: user.id,
									topic_id: topicId,
									learning_point_id: pointInfo.id,
								},
								{ onConflict: "user_id,topic_id,learning_point_id" },
							);

						if (error) {
							throw error;
						}
					}
				} catch (error) {
					console.error("학습 포인트 처리 중 오류:", error);
				}
			}
		}
	};

	const totalSentenceCount = koreanScripts.length;
	const completedCount = userTranslations.filter((t) => t.is_completed).length;
	const progressPercentage =
		totalSentenceCount > 0
			? Math.round((completedCount / totalSentenceCount) * 100)
			: 0;

	const isStageComplete = progressPercentage === 100;

	const handleNextStage = async () => {
		if (user && isStageComplete) {
			try {
				await onStageComplete();
				alert("🎉 1단계를 완료했습니다! 2단계로 이동합니다.");
			} catch (error) {
				console.error("단계 완료 처리 중 오류:", error);
				alert("단계 진행 중 오류가 발생했습니다. 다시 시도해주세요.");
			}
		}
	};

	return (
		<div className="mb-4">
			<PracticeHeader progressPercentage={progressPercentage} />

			{/* 100% 완료 시 다음 단계 버튼 */}
			{/* TODO: dynamic import 필요 현재 progressPercentage은 서버에서 0으로 구성, userTranslations은 prefetch로 진행하지 않은 상황*/}
			{isStageComplete && (
				<div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
					<div className="flex items-center justify-between">
						<div>
							<h4 className="font-bold text-green-800 mb-1">🎉 1단계 완료!</h4>
							<p className="text-sm text-green-700">
								모든 번역을 완료했습니다. 2단계로 진행해보세요.
							</p>
						</div>
						{user ? (
							<button
								type="button"
								onClick={handleNextStage}
								className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
							>
								2단계로 이동하기
							</button>
						) : (
							<div className="text-sm text-gray-500">
								로그인하면 다음 단계로 진행할 수 있습니다.
							</div>
						)}
					</div>
				</div>
			)}

			{koreanScripts.map((script, index) => {
				const sentenceOrder = script.sentence_order;
				const learningPoints = learningPointsByOrder[sentenceOrder] || [];

				return (
					<div key={script.id} className="mb-6 p-4 border rounded">
						<div className="mb-3">
							<div className="flex justify-between items-start mb-2">
								<span className="text-sm font-medium text-gray-600">
									문장 {index + 1}
								</span>
							</div>
							<KoreanSentenceHighlighter
								sentenceOrder={sentenceOrder}
								koreanText={script.korean_text}
								learningPoints={learningPoints}
								selectedPoints={selectedPoints}
								onLearningPointClick={handleLearningPointClick}
							/>
						</div>

						<TranslationInputForm
							sentenceOrder={sentenceOrder}
							topicId={topicId}
							onTranslationSubmit={handleTranslationSubmit}
						/>
					</div>
				);
			})}
		</div>
	);
}
