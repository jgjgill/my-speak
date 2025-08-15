"use client";

import type { User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createClient } from "../../../../utils/supabase/client";

interface UseProgressProps {
	topicId: string;
	user: User | null;
	maxAvailableStage: number;
}

interface UseProgressResult {
	currentStage: number;
	changeCurrentStage: (stage: number) => void;
	completeStage: (stage: number) => Promise<void>;
}

export function useProgress({
	topicId,
	user,
	maxAvailableStage,
}: UseProgressProps): UseProgressResult {
	const queryClient = useQueryClient();
	const supabase = createClient();

	// 현재 보고 있는 단계 (클라이언트 상태)
	const [currentStage, setCurrentStageState] =
		useState<number>(maxAvailableStage);

	const changeCurrentStage = (stage: number): void => {
		if (!(1 <= stage && stage <= maxAvailableStage)) {
			console.error("접근할 수 없는 단계:", stage);
			return;
		}
		setCurrentStageState(stage);
	};

	const completeStage = async (stage: number): Promise<void> => {
		const nextStage = stage + 1;
		if (nextStage <= 4 && user) {
			try {
				// DB에서 maxAvailableStage 업데이트
				const { error } = await supabase.from("user_progress").upsert(
					{
						user_id: user.id,
						topic_id: topicId,
						current_stage: nextStage,
					},
					{ onConflict: "user_id,topic_id" },
				);

				if (error) {
					throw error;
				}

				// 쿼리 데이터 업데이트
				queryClient.setQueryData(
					["user-progress", topicId, user.id],
					nextStage,
				);

				// 클라이언트 상태도 업데이트
				setCurrentStageState(nextStage);
			} catch (error) {
				console.error("단계 완료 저장 중 오류:", error);
				throw error;
			}
		}
	};

	return {
		currentStage,
		changeCurrentStage,
		completeStage,
	};
}
