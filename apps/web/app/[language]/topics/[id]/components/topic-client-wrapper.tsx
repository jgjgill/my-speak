"use client";

import { useAuth } from "../../../../contexts/auth-context";
import { useProgress } from "../hooks/use-progress";
import { useUserProgress } from "../hooks/use-user-progress";
import StageFourContainer from "./stage-four-container";
import StageNavigation from "./stage-navigation";
import StageOneContainer from "./stage-one-container";
import StageThreeContainer from "./stage-three-container";
import StageTwoContainer from "./stage-two-container";

interface TopicClientWrapperProps {
	topicId: string;
}

export default function TopicClientWrapper({
	topicId,
}: TopicClientWrapperProps) {
	const { user } = useAuth();
	const { data: maxAvailableStage } = useUserProgress(topicId, user);
	const { currentStage, changeCurrentStage, completeStage } = useProgress({
		topicId,
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
					topicId={topicId}
					onStageComplete={() => completeStage(1)}
				/>
			)}
			{currentStage === 2 && (
				<StageTwoContainer
					topicId={topicId}
					onStageComplete={() => completeStage(2)}
				/>
			)}
			{currentStage === 3 && (
				<StageThreeContainer
					topicId={topicId}
					onStageComplete={() => completeStage(3)}
				/>
			)}
			{currentStage === 4 && <StageFourContainer topicId={topicId} />}
		</>
	);
}
