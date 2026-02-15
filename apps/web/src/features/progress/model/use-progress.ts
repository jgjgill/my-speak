"use client";

import type { User } from "@supabase/supabase-js";
import { useState } from "react";
import { useUserProgress } from "@/entities/progress";
import { useUpdateProgress } from "./use-update-progress";

interface UseProgressProps {
	topicId: string;
	language: string;
	user: User | null;
}

interface UseProgressResult {
	currentStage: number;
	maxAvailableStage: number;
	changeCurrentStage: (stage: number) => void;
	completeStage: (stage: number) => void;
}

export function useProgress({
	topicId,
	language,
	user,
}: UseProgressProps): UseProgressResult {
	const { data: maxAvailableStage } = useUserProgress(topicId, language, user);
	const [currentStage, setCurrentStage] = useState(maxAvailableStage);

	const updateProgressMutation = useUpdateProgress(topicId, language, user);

	const changeCurrentStage = (stage: number): void => {
		if (!(1 <= stage && stage <= maxAvailableStage)) {
			console.error("접근할 수 없는 단계:", stage);
			return;
		}
		setCurrentStage(stage);
	};

	const completeStage = (stage: number): void => {
		const nextStage = stage + 1;
		if (nextStage <= 4 && user) {
			updateProgressMutation.mutate(nextStage, {
				onSuccess: () => {
					setCurrentStage(nextStage);
				},
			});
		}
	};

	return {
		currentStage,
		maxAvailableStage,
		changeCurrentStage,
		completeStage,
	};
}
