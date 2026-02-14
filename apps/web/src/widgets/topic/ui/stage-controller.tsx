"use client";

import dynamic from "next/dynamic";
import { useProgress } from "@/features/progress";
import { StageFourContainer } from "@/features/stage-four";
import { StageOneContainer } from "@/features/stage-one";
import { StageThreeContainer } from "@/features/stage-three";
import { StageTwoContainer } from "@/features/stage-two";
import { useAuth } from "@/shared/lib";
import StageNavigation from "./stage-navigation";

const ScrollToTopButton = dynamic(() => import("./scroll-to-top-button"), {
	ssr: false,
});

interface StageControllerProps {
	topicId: string;
	language: string;
	maxAvailableStage: number;
}

export default function StageController({
	topicId,
	language,
	maxAvailableStage,
}: StageControllerProps) {
	const { user } = useAuth();
	const { currentStage, changeCurrentStage, completeStage } = useProgress({
		topicId,
		language,
		user,
		maxAvailableStage,
	});

	return (
		<>
			<StageNavigation
				currentStage={currentStage}
				maxAvailableStage={maxAvailableStage}
				onStageChange={changeCurrentStage}
			/>

			{currentStage === 1 && (
				<StageOneContainer
					onStageComplete={() => {
						if (maxAvailableStage > 1) {
							changeCurrentStage(2);
						} else {
							completeStage(1);
						}
						window.scrollTo({ top: 0, behavior: "instant" });
					}}
				/>
			)}
			{currentStage === 2 && (
				<StageTwoContainer
					onStageComplete={() => {
						if (maxAvailableStage > 2) {
							changeCurrentStage(3);
						} else {
							completeStage(2);
						}
						window.scrollTo({ top: 0, behavior: "instant" });
					}}
				/>
			)}
			{currentStage === 3 && (
				<StageThreeContainer
					onStageComplete={() => {
						if (maxAvailableStage > 3) {
							changeCurrentStage(4);
						} else {
							completeStage(3);
						}
						window.scrollTo({ top: 0, behavior: "instant" });
					}}
				/>
			)}
			{currentStage === 4 && <StageFourContainer />}

			<ScrollToTopButton />
		</>
	);
}
