"use client";

import { useAuth } from "../../../../contexts/auth-context";
import { useProgress } from "../hooks/use-progress";
import StageFourContainer from "./stage-four-container";
import StageNavigation from "./stage-navigation";
import StageOneContainer from "./stage-one-container";
import StageThreeContainer from "./stage-three-container";
import StageTwoContainer from "./stage-two-container";

interface TopicClientWrapperProps {
	topicId: string;
	initialStage: number;
}

export default function TopicClientWrapper({
	topicId,
	initialStage,
}: TopicClientWrapperProps) {
	const { user } = useAuth();
	const { currentStage, setCurrentStage } = useProgress({
		topicId,
		user,
		initialStage,
	});

	return (
		<>
			<StageNavigation
				currentStage={currentStage}
				maxAvailableStage={currentStage}
				onStageChange={setCurrentStage}
			/>

			{currentStage === 1 && <StageOneContainer topicId={topicId} />}
			{currentStage === 2 && <StageTwoContainer topicId={topicId} />}
			{currentStage === 3 && <StageThreeContainer topicId={topicId} />}
			{currentStage === 4 && <StageFourContainer topicId={topicId} />}
		</>
	);
}
