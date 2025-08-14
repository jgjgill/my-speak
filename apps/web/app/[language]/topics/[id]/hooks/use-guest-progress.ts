import { useState } from "react";

interface GuestProgress {
	currentStage: number;
	completedTranslations: Set<number>;
}

export function useGuestProgress(initialStage: number = 1) {
	const [guestProgress, setGuestProgress] = useState<GuestProgress>({
		currentStage: initialStage,
		completedTranslations: new Set(),
	});

	const updateCurrentStage = (stage: number) => {
		setGuestProgress((prev) => ({
			...prev,
			currentStage: stage,
		}));
	};

	const markTranslationCompleted = (sentenceOrder: number) => {
		setGuestProgress((prev) => ({
			...prev,
			completedTranslations: new Set(prev.completedTranslations).add(
				sentenceOrder,
			),
		}));
	};

	const markTranslationIncomplete = (sentenceOrder: number) => {
		setGuestProgress((prev) => {
			const newCompletedTranslations = new Set(prev.completedTranslations);
			newCompletedTranslations.delete(sentenceOrder);
			return {
				...prev,
				completedTranslations: newCompletedTranslations,
			};
		});
	};

	const toggleTranslationComplete = (sentenceOrder: number) => {
		guestProgress.completedTranslations.has(sentenceOrder)
			? markTranslationIncomplete(sentenceOrder)
			: markTranslationCompleted(sentenceOrder);
	};

	return {
		guestProgress,
		updateCurrentStage,
		markTranslationCompleted,
		markTranslationIncomplete,
		toggleTranslationComplete,
	};
}
