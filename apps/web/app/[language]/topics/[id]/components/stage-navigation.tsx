"use client";

interface StageNavigationProps {
	currentStage: number;
	onStageChange: (stage: number) => void;
}

const stages = [
	{ number: 1, title: "1단계", description: "한글 번역" },
	{ number: 2, title: "2단계", description: "영어 스크립트" },
	{ number: 3, title: "3단계", description: "읽기 연습" },
	{ number: 4, title: "4단계", description: "키워드 스피치" },
];

export default function StageNavigation({
	currentStage,
	onStageChange,
}: StageNavigationProps) {
	return (
		<div className="mb-6">
			<div className="flex flex-wrap gap-2">
				{stages.map((stage) => {
					const isActive = currentStage === stage.number;

					return (
						<button
							key={stage.number}
							type="button"
							onClick={() => onStageChange(stage.number)}
							className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
								isActive
									? "bg-blue-600 text-white border-blue-600"
									: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
							}`}
						>
							<div className="text-center">
								<div className="font-semibold">{stage.title}</div>
								<div className="text-xs opacity-75">{stage.description}</div>
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}
