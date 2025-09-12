import type { Tables } from "@repo/typescript-config/supabase-types";

type LearningPoint = Tables<"learning_points">;
type UserSelectedPoint = Tables<"user_selected_points">;

export function createSelectedLearningPointsByOrder(
	userSelectedPoints: Pick<UserSelectedPoint, "learning_point_id">[],
	learningPoints: LearningPoint[],
): Record<number, LearningPoint[]> {
	return userSelectedPoints.reduce(
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
}

export function getSelectedKoreanKeywords(
	selectedLearningPointsByOrder: Record<number, LearningPoint[]>,
	sentenceOrder: number,
): string[] {
	const points = selectedLearningPointsByOrder[sentenceOrder] || [];
	return points.map((point) => point.korean_phrase);
}

export function getSelectedForeignKeywords(
	selectedLearningPointsByOrder: Record<number, LearningPoint[]>,
	sentenceOrder: number,
): string[] {
	const points = selectedLearningPointsByOrder[sentenceOrder] || [];
	return points.map((point) => point.foreign_phrase);
}
