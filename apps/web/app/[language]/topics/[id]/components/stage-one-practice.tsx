"use client";

import type { Tables } from "@repo/typescript-config/supabase-types";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useAuth } from "../../../../contexts/auth-context";
import { useToast } from "../../../../contexts/toast-context";
import { useIsMounted } from "../../../../hooks/use-is-mounted";
import { useLearningPointMutations } from "../hooks/use-learning-point-mutations";
import { useTranslationMutation } from "../hooks/use-translation-mutations";
import { useUserTranslations } from "../hooks/use-user-translations";
import KoreanSentenceHighlighter from "./korean-sentence-highlighter/korean-sentence-highlighter";
import PracticeHeader from "./practice-header";
import TranslationInputForm from "./translation-input-form";

const StageCompleteButton = dynamic(() => import("./stage-complete-button"), {
	ssr: false,
});

type KoreanScript = Tables<"korean_scripts">;
type LearningPoint = Tables<"learning_points">;

interface StageOnePracticeProps {
	koreanScripts: KoreanScript[];
	learningPointsByOrder: Record<number, LearningPoint[]>;
	topicId: string;
	initialSelectedPoints: Set<string>;
	onStageComplete: () => void;
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
	const { addToast } = useToast();

	const [selectedPoints, setSelectedPoints] = useState(initialSelectedPoints);
	const isMounted = useIsMounted();
	const { data: userTranslations } = useUserTranslations(topicId, user);

	const translationMutation = useTranslationMutation(topicId, user);
	const { addLearningPoint } = useLearningPointMutations(topicId, user);

	const handleTranslationSubmit = async (
		sentenceOrder: number,
		translated: string,
	) => {
		if (user) {
			const koreanText =
				koreanScripts.find((s) => s.sentence_order === sentenceOrder)
					?.korean_text || "";

			try {
				await translationMutation.mutateAsync({
					topicId,
					sentenceOrder,
					koreanText,
					userTranslation: translated,
					isCompleted: true,
				});

				addToast({
					message: "번역이 저장되었습니다!",
					type: "success",
				});
			} catch (_error) {
				addToast({
					message: "번역 저장에 실패했습니다. 다시 시도해주세요.",
					type: "error",
				});
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
			addToast({
				message: pointInfo.foreign_phrase,
				type: "info",
				duration: 2000,
			});

			if (user) {
				const pointKey = `${sentenceOrder}-${pointInfo.id}`;
				const isSelected = selectedPoints.has(pointKey);

				if (isSelected || addLearningPoint.isPending) {
					return;
				}

				try {
					await addLearningPoint.mutateAsync({
						topicId,
						learningPointId: pointInfo.id,
					});

					setSelectedPoints((prev) => {
						const newSet = new Set(prev);
						newSet.add(pointKey);
						return newSet;
					});
				} catch (_error) {
					addToast({
						message: "학습 포인트 추가에 실패했습니다. 다시 시도해주세요.",
						type: "error",
					});
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

	return (
		<div className="mb-4">
			<PracticeHeader progressPercentage={progressPercentage} />

			{koreanScripts.map((script, index) => {
				const sentenceOrder = script.sentence_order;
				const learningPoints = learningPointsByOrder[sentenceOrder] || [];

				// 완료 상태 확인 (CSR only)
				const isCompleted =
					isMounted &&
					userTranslations.find(
						(t) => t.sentence_order === sentenceOrder && t.is_completed,
					);

				return (
					<div
						key={script.id}
						className={`bg-white rounded-xl shadow-sm p-4 transition-all duration-500 mb-6 relative ${
							isCompleted
								? "border-2 border-stage-1 animate-pulse-border scale-[1.01]"
								: "border border-gray-200"
						}`}
					>
						<div className="mb-4">
							<div className="flex items-center gap-2 mb-3">
								<div className="w-6 h-6 bg-stage-1 text-white rounded-full flex items-center justify-center text-xs font-bold">
									{index + 1}
								</div>
								<span className="text-sm font-medium text-text-secondary">
									문장 {index + 1}
								</span>
							</div>
							<KoreanSentenceHighlighter
								sentenceOrder={sentenceOrder}
								koreanText={script.korean_text}
								learningPoints={learningPoints}
								selectedPoints={selectedPoints}
								onLearningPointClick={handleLearningPointClick}
								isLoading={addLearningPoint.isPending}
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

			<StageCompleteButton
				isStageComplete={isStageComplete}
				onStageComplete={onStageComplete}
			/>
		</div>
	);
}
