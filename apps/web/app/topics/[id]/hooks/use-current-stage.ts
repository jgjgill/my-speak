"use client";

import type { User } from "@supabase/supabase-js";
import { useState } from "react";
import { createClient } from "../../../utils/supabase/client";

interface UseCurrentStageProps {
	topicId: string;
	user: User | null;
	initialStage: number;
}

interface UseCurrentStageResult {
	currentStage: number;
	setCurrentStage: (stage: number) => Promise<void>;
}

export function useCurrentStage({
	topicId,
	user,
	initialStage,
}: UseCurrentStageProps): UseCurrentStageResult {
	const [currentStage, setCurrentStageState] = useState<number>(initialStage);
	const supabase = createClient();

	const setCurrentStage = async (stage: number): Promise<void> => {
		if (!(1 <= stage && stage <= 4)) {
			console.error("유효하지 않은 단계:", stage);
			return;
		}

		if (!user) {
			return
		}

		setCurrentStageState(stage);

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
	};

	return {
		currentStage,
		setCurrentStage,
	};
}