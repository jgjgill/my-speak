"use client";

import type { Tables } from "@repo/typescript-config/supabase-types";
import { useState } from "react";
import { useAuth } from "../../../../contexts/auth-context";
import { createClient } from "../../../../utils/supabase/client";
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
}: StageOnePracticeProps) {
	const { user } = useAuth();
	const supabase = createClient();

	const [selectedPoints, setSelectedPoints] = useState(initialSelectedPoints);

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

	return (
		<div className="mb-4">
			<PracticeHeader progressPercentage={0} />

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
