"use client";

import { useState } from "react";
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
	const [currentStage, setCurrentStage] = useState(initialStage);

	const handleStageChange = async (stage: number) => {
		setCurrentStage(stage);

		// TODO: 사용자 진행도 업데이트 로직 필요
		// mutation 을 통해 user_progress 테이블 업데이트
	};

	return (
		<>
			<StageNavigation
				currentStage={currentStage}
				onStageChange={handleStageChange}
			/>

			{currentStage === 1 && <StageOneContainer topicId={topicId} />}
			{currentStage === 2 && <StageTwoContainer topicId={topicId} />}
			{currentStage === 3 && <StageThreeContainer topicId={topicId} />}
			{currentStage === 4 && <StageFourContainer topicId={topicId} />}
		</>
	);
}
