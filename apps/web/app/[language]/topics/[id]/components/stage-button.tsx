"use client";

interface StageButtonProps {
	stage: {
		number: number;
		title: string;
		description: string;
		icon: string;
	};
	isActive: boolean;
	isCompleted: boolean;
	isDisabled: boolean;
	showConnector?: boolean;
	onStageChange: (stage: number) => void;
}

export default function StageButton({
	stage,
	isActive,
	isCompleted,
	isDisabled,
	showConnector = false,
	onStageChange,
}: StageButtonProps) {
	const getStageColor = (stageNumber: number) => {
		switch (stageNumber) {
			case 1:
				return {
					bg: "bg-stage-1",
					border: "border-stage-1",
					shadow: "shadow-blue-200",
					text: "text-blue-700",
					textSecondary: "text-blue-600",
				};
			case 2:
				return {
					bg: "bg-stage-2",
					border: "border-stage-2",
					shadow: "shadow-green-200",
					text: "text-green-700",
					textSecondary: "text-green-600",
				};
			case 3:
				return {
					bg: "bg-stage-3",
					border: "border-stage-3",
					shadow: "shadow-orange-200",
					text: "text-orange-700",
					textSecondary: "text-orange-600",
				};
			case 4:
				return {
					bg: "bg-stage-4",
					border: "border-stage-4",
					shadow: "shadow-purple-200",
					text: "text-purple-700",
					textSecondary: "text-purple-600",
				};
			default:
				return {
					bg: "bg-primary",
					border: "border-primary",
					shadow: "shadow-blue-200",
					text: "text-primary",
					textSecondary: "text-primary-dark",
				};
		}
	};

	const stageColors = getStageColor(stage.number);

	return (
		<div className="flex items-center">
			<button
				type="button"
				onClick={() => !isDisabled && onStageChange(stage.number)}
				disabled={isDisabled}
				className="flex flex-col items-center group transition-all duration-300"
			>
				<div
					className={`
						relative rounded-full border-4 transition-all duration-300 flex items-center justify-center
						w-14 h-14 text-base
						sm:w-16 sm:h-16 sm:text-lg
						${
							isActive
								? `${stageColors.bg} ${stageColors.border} shadow-lg ${stageColors.shadow} scale-110 animate-pulse`
								: isCompleted
									? "bg-stage-completed border-stage-completed shadow-lg shadow-yellow-200"
									: isDisabled
										? "bg-gray-100 border-gray-200 cursor-not-allowed opacity-60"
										: "bg-white border-gray-300 hover:border-gray-400 hover:shadow-md group-hover:scale-105"
						}
					`}
				>
					{isCompleted ? (
						<div className="text-white font-bold text-lg sm:text-xl">✓</div>
					) : (
						<div
							className={`${
								isActive
									? "text-white"
									: isDisabled
										? "text-gray-400"
										: "text-gray-600"
							}`}
						>
							{stage.icon}
						</div>
					)}

					{isActive && (
						<div className={`absolute inset-0 rounded-full opacity-20 animate-ping ${stageColors.bg.replace('bg-', 'bg-')}`} />
					)}
				</div>

				<div className="mt-2 sm:mt-3 text-center px-1">
					<div
						className={`font-semibold text-xs sm:text-sm mb-1 ${
							isActive
								? stageColors.text
								: isCompleted
									? "text-yellow-700"
									: isDisabled
										? "text-gray-400"
										: "text-gray-700"
						}`}
					>
						{stage.title}
					</div>
					<div
						className={`text-xs leading-tight ${
							isActive
								? stageColors.textSecondary
								: isCompleted
									? "text-yellow-600"
									: isDisabled
										? "text-gray-400"
										: "text-gray-500"
						}`}
					>
						{stage.description}
					</div>
				</div>
			</button>

			{showConnector && (
				<div
					className={`
						hidden sm:block transition-all duration-300 rounded-full
						w-16 h-1 mx-4
						${isCompleted ? "bg-stage-completed shadow-sm" : "bg-gray-200"}
					`}
				/>
			)}
		</div>
	);
}
