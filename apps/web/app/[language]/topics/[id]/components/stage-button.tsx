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
								? "bg-blue-500 border-blue-500 shadow-lg shadow-blue-200 scale-110 animate-pulse"
								: isCompleted
									? "bg-green-500 border-green-500 shadow-lg shadow-green-200"
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
						<div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 animate-ping" />
					)}
				</div>

				<div className="mt-2 sm:mt-3 text-center px-1">
					<div
						className={`font-semibold text-xs sm:text-sm mb-1 ${
							isActive
								? "text-blue-700"
								: isCompleted
									? "text-green-700"
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
								? "text-blue-600"
								: isCompleted
									? "text-green-600"
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
						${isCompleted ? "bg-green-300 shadow-sm" : "bg-gray-200"}
					`}
				/>
			)}
		</div>
	);
}
