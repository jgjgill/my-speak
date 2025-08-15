"use client";

import type { User } from "@supabase/supabase-js";
import { useState } from "react";
import { createClient } from "../../../../utils/supabase/client";

interface UseProgressProps {
	topicId: string;
	user: User | null;
	initialStage: number;
}

interface UseProgressResult {
	currentStage: number;
	setCurrentStage: (stage: number) => Promise<void>;
}

export function useProgress({
	topicId,
	user,
	initialStage,
}: UseProgressProps): UseProgressResult {
	const [currentStage, setCurrentStageState] = useState<number>(initialStage);
	const supabase = createClient();

	const setCurrentStage = async (stage: number): Promise<void> => {
		if (!(1 <= stage && stage <= 4)) {
			console.error("유효하지 않은 단계:", stage);
			return;
		}

		setCurrentStageState(stage);

		if (user) {
			try {
				const { error } = await supabase.from("user_progress").upsert(
					{
						user_id: user.id,
						topic_id: topicId,
						current_stage: stage,
					},
					{ onConflict: "user_id,topic_id" },
				);

				if (error) {
					throw error;
				}
			} catch (error) {
				console.error("현재 단계 저장 중 오류:", error);
			}
		}
	};

	return {
		currentStage,
		setCurrentStage,
	};
}