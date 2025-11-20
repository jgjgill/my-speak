"use client";

import type {
	CompletionStatus,
	DifficultyLevel,
	TopicFilterOptions,
	TopicSortOption,
} from "@/entities/topic/api";
import { useTopicsFilterParams } from "../model/use-topics-filter-params";

const SORT_OPTIONS: { value: TopicSortOption; label: string }[] = [
	{ value: "latest", label: "최신순" },
	{ value: "oldest", label: "오래된순" },
	{ value: "most_sentences", label: "문항수 많은순" },
	{ value: "least_sentences", label: "문항수 적은순" },
];

const DIFFICULTY_OPTIONS: { value: DifficultyLevel; label: string }[] = [
	{ value: "초급", label: "초급" },
	{ value: "중급", label: "중급" },
	{ value: "고급", label: "고급" },
];

const COMPLETION_STATUS_OPTIONS: { value: CompletionStatus; label: string }[] =
	[
		{ value: "all", label: "전체" },
		{ value: "not_started", label: "미시작" },
		{ value: "in_progress", label: "진행중" },
		{ value: "completed", label: "완료" },
	];

const DIFFICULTY_COLORS: Record<
	DifficultyLevel,
	{ selected: string; unselected: string }
> = {
	초급: {
		selected: "bg-green-50 text-green-700 border-green-300",
		unselected: "bg-gray-50 text-gray-600 border-gray-200",
	},
	중급: {
		selected: "bg-yellow-50 text-yellow-700 border-yellow-300",
		unselected: "bg-gray-50 text-gray-600 border-gray-200",
	},
	고급: {
		selected: "bg-red-50 text-red-700 border-red-300",
		unselected: "bg-gray-50 text-gray-600 border-gray-200",
	},
};

interface TopicsFilterControlsProps {
	showCompletionFilter?: boolean;
	onFilterChange?: (params: {
		sortBy: TopicSortOption;
		filters: TopicFilterOptions;
	}) => void;
}

export function TopicsFilterControls({
	showCompletionFilter = false,
	onFilterChange,
}: TopicsFilterControlsProps) {
	const [params, setParams] = useTopicsFilterParams();

	const handleSortChange = (value: TopicSortOption) => {
		setParams({ sortBy: value });
		onFilterChange?.({
			sortBy: value,
			filters: {
				difficulties: params.difficulties || undefined,
				completionStatus: params.completionStatus,
			},
		});
	};

	const handleDifficultyToggle = (difficulty: "초급" | "중급" | "고급") => {
		const currentDifficulties = params.difficulties || [];
		const newDifficulties = currentDifficulties.includes(difficulty)
			? currentDifficulties.filter((d) => d !== difficulty)
			: [...currentDifficulties, difficulty];

		setParams({
			difficulties: newDifficulties.length > 0 ? newDifficulties : null,
		});
		onFilterChange?.({
			sortBy: params.sortBy,
			filters: {
				difficulties: newDifficulties.length > 0 ? newDifficulties : undefined,
				completionStatus: params.completionStatus,
			},
		});
	};

	const handleCompletionStatusChange = (
		status: "all" | "completed" | "in_progress" | "not_started",
	) => {
		setParams({ completionStatus: status });
		onFilterChange?.({
			sortBy: params.sortBy,
			filters: {
				difficulties: params.difficulties || undefined,
				completionStatus: status,
			},
		});
	};

	return (
		<div className="mb-4 border-b border-gray-200 pb-4">
			<div className="flex flex-wrap items-start gap-x-6 gap-y-4">
				{/* 정렬 */}
				<div className="flex flex-wrap items-center gap-2">
					<span className="text-xs font-medium text-gray-500">정렬:</span>
					<div className="flex flex-wrap gap-1.5">
						{SORT_OPTIONS.map((option) => {
							const isSelected = params.sortBy === option.value;
							return (
								<button
									key={option.value}
									type="button"
									onClick={() => handleSortChange(option.value)}
									className={`min-h-[36px] rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
										isSelected
											? "border-primary bg-primary-light text-primary shadow-sm"
											: "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
									}`}
								>
									{option.label}
								</button>
							);
						})}
					</div>
				</div>

				{/* 난이도 필터 */}
				<div className="flex flex-wrap items-center gap-2">
					<span className="text-xs font-medium text-gray-500">난이도:</span>
					<div className="flex flex-wrap gap-1.5">
						{DIFFICULTY_OPTIONS.map((option) => {
							const isSelected =
								params.difficulties?.includes(option.value) ?? false;
							const colorClass = isSelected
								? DIFFICULTY_COLORS[option.value].selected
								: DIFFICULTY_COLORS[option.value].unselected;
							return (
								<button
									key={option.value}
									type="button"
									onClick={() => handleDifficultyToggle(option.value)}
									className={`min-h-[36px] rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${colorClass} ${
										isSelected
											? "shadow-sm"
											: "hover:border-gray-300 hover:bg-gray-100"
									}`}
								>
									{option.label}
								</button>
							);
						})}
					</div>
				</div>

				{/* 풀이 현황 필터 (로그인 사용자만) */}
				{showCompletionFilter && (
					<div className="flex flex-wrap items-center gap-2">
						<span className="text-xs font-medium text-gray-500">
							풀이 현황:
						</span>
						<div className="flex flex-wrap gap-1.5">
							{COMPLETION_STATUS_OPTIONS.map((option) => {
								const isSelected = params.completionStatus === option.value;
								return (
									<button
										key={option.value}
										type="button"
										onClick={() => handleCompletionStatusChange(option.value)}
										className={`min-h-[36px] rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
											isSelected
												? "border-gray-700 bg-gray-700 text-white shadow-sm"
												: "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
										}`}
									>
										{option.label}
									</button>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
