"use client";

import type { User } from "@supabase/supabase-js";
import { useState } from "react";
import { useUpdateUserProgress } from "./use-update-user-progress";

interface UseProgressProps {
	topicId: string;
	user: User | null;
	maxAvailableStage: number;
}

interface UseProgressResult {
	currentStage: number;
	changeCurrentStage: (stage: number) => void;
	completeStage: (stage: number) => void;
}

export function useProgress({
	topicId,
	user,
	maxAvailableStage,
}: UseProgressProps): UseProgressResult {
	const [currentStage, setCurrentStage] = useState(maxAvailableStage);

	const updateProgressMutation = useUpdateUserProgress(topicId, user);

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
		changeCurrentStage,
		completeStage,
	};
}
