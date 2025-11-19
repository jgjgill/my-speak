"use client";

import type { TopicFilterOptions, TopicSortOption } from "@/entities/topic/api";
import { useTopicsFilterParams } from "../model/use-topics-filter-params";

const SORT_OPTIONS: { value: TopicSortOption; label: string }[] = [
	{ value: "latest", label: "최신순" },
	{ value: "oldest", label: "오래된순" },
	{ value: "most_sentences", label: "문항수 많은순" },
	{ value: "least_sentences", label: "문항수 적은순" },
];

const DIFFICULTY_OPTIONS = [
	{ value: "초급", label: "초급" },
	{ value: "중급", label: "중급" },
	{ value: "고급", label: "고급" },
] as const;

const COMPLETION_STATUS_OPTIONS = [
	{ value: "all", label: "전체" },
	{ value: "not_started", label: "미시작" },
	{ value: "in_progress", label: "진행중" },
	{ value: "completed", label: "완료" },
] as const;

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
		<div className="mb-6 space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
			{/* 정렬 */}
			<div className="flex items-center gap-3">
				<label
					htmlFor="sort-select"
					className="text-sm font-medium text-gray-700"
				>
					정렬:
				</label>
				<select
					id="sort-select"
					value={params.sortBy}
					onChange={(e) => handleSortChange(e.target.value as TopicSortOption)}
					className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					{SORT_OPTIONS.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</div>

			{/* 난이도 필터 */}
			<div>
				<div className="mb-2 text-sm font-medium text-gray-700">난이도:</div>
				<div className="flex flex-wrap gap-2">
					{DIFFICULTY_OPTIONS.map((option) => {
						const isSelected =
							params.difficulties?.includes(option.value) ?? false;
						return (
							<button
								key={option.value}
								type="button"
								onClick={() => handleDifficultyToggle(option.value)}
								className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
									isSelected
										? "bg-blue-500 text-white hover:bg-blue-600"
										: "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
				<div>
					<div className="mb-2 text-sm font-medium text-gray-700">
						풀이 현황:
					</div>
					<div className="flex flex-wrap gap-2">
						{COMPLETION_STATUS_OPTIONS.map((option) => {
							const isSelected = params.completionStatus === option.value;
							return (
								<button
									key={option.value}
									type="button"
									onClick={() => handleCompletionStatusChange(option.value)}
									className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
										isSelected
											? "bg-green-500 text-white hover:bg-green-600"
											: "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
	);
}
