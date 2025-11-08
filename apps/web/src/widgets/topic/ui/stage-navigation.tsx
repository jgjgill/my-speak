"use client";

import StageButton from "./stage-button";

interface StageNavigationProps {
	currentStage: number;
	maxAvailableStage: number;
	onStageChange: (stage: number) => void;
}

const stages = [
	{ number: 1, title: "1단계", description: "한글 번역", icon: "📝" },
	{ number: 2, title: "2단계", description: "영어 스크립트", icon: "📖" },
	{ number: 3, title: "3단계", description: "읽기 연습", icon: "🗣️" },
	{ number: 4, title: "4단계", description: "키워드 스피치", icon: "✨" },
];

export default function StageNavigation({
	currentStage,
	maxAvailableStage,
	onStageChange,
}: StageNavigationProps) {
	return (
		<div className="mb-8">
			<div className="grid grid-cols-2 gap-4 place-items-center sm:flex sm:items-center sm:justify-center sm:gap-0">
				{stages.map((stage, index) => {
					const isActive = currentStage === stage.number;
					const isCompleted = stage.number < currentStage;
					const isDisabled = stage.number > maxAvailableStage;
					const showConnector = index < stages.length - 1;

					return (
						<StageButton
							key={stage.number}
							stage={stage}
							isActive={isActive}
							isCompleted={isCompleted}
							isDisabled={isDisabled}
							showConnector={showConnector}
							onStageChange={onStageChange}
						/>
					);
				})}
			</div>
		</div>
	);
}
