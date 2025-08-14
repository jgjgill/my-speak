import type { Tables } from "@repo/typescript-config/supabase-types";

type UserTranslation = Tables<"user_translations">;

export interface StageCompletionParams {
	totalSentenceCount: number;
	userTranslations?: UserTranslation[];
	guestCompletedTranslations?: Set<number>;
}

export function isStageOneComplete({
	totalSentenceCount,
	userTranslations,
	guestCompletedTranslations,
}: StageCompletionParams): boolean {
	if (userTranslations) {
		const completedTranslationsCount = userTranslations.filter(
			(translation) => translation.is_completed,
		).length;

		return completedTranslationsCount === totalSentenceCount;
	}

	if (guestCompletedTranslations) {
		return guestCompletedTranslations.size === totalSentenceCount;
	}

	return false;
}

export function getCompletionProgress({
	userTranslations,
	guestCompletedTranslations,
}: Omit<StageCompletionParams, "totalSentenceCount">): {
	completedTranslationCount: number;
} {
	let completedTranslationCount = 0;

	if (userTranslations) {
		completedTranslationCount = userTranslations.filter(
			(translation) => translation.is_completed,
		).length;
	} else if (guestCompletedTranslations) {
		completedTranslationCount = guestCompletedTranslations.size;
	}

	return { completedTranslationCount };
}
