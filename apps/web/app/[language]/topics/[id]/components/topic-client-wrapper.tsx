"use client";

import dynamic from "next/dynamic";
import { useAuth } from "../../../../contexts/auth-context";
import { useProgress } from "../hooks/use-progress";
import { useUserProgress } from "../hooks/use-user-progress";
import StageFourContainer from "./stage-four-container";
import StageNavigation from "./stage-navigation";
import StageOneContainer from "./stage-one-container";
import StageThreeContainer from "./stage-three-container";
import StageTwoContainer from "./stage-two-container";

const ScrollToTopButton = dynamic(() => import("./scroll-to-top-button"), {
	ssr: false,
});

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

	// @test 임시 주석
	// useEffect(() => {
	// 	alert(user?.email);
	// }, [user]);

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
					topicId={topicId}
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
					topicId={topicId}
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
			{currentStage === 4 && <StageFourContainer topicId={topicId} />}

			<ScrollToTopButton />
		</>
	);
}
