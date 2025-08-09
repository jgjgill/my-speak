"use client";

import { useState } from "react";
import { useAuth } from "../../../../contexts/auth-context";
import { useUserProgress } from "../hooks/use-user-progress";
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
	const [currentStage, setCurrentStage] = useState(initialStage);

	const userProgressQuery = useUserProgress(topicId, user);

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

			{currentStage === 1 && (
				<StageOneContainer topicId={topicId} user={user} />
			)}
			{currentStage === 2 && (
				<StageTwoContainer topicId={topicId} user={user} />
			)}
			{currentStage === 3 && (
				<StageThreeContainer topicId={topicId} user={user} />
			)}
			{currentStage === 4 && <StageFourContainer topicId={topicId} />}
		</>
	);
}
