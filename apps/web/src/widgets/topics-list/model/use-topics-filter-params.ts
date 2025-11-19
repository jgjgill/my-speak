import { parseAsArrayOf, parseAsStringLiteral, useQueryStates } from "nuqs";
import type {
	CompletionStatus,
	DifficultyLevel,
	TopicSortOption,
} from "@/entities/topic/api";

const SORT_VALUES: readonly TopicSortOption[] = [
	"latest",
	"oldest",
	"most_sentences",
	"least_sentences",
] as const;

const DIFFICULTY_VALUES: readonly DifficultyLevel[] = [
	"초급",
	"중급",
	"고급",
] as const;

const COMPLETION_STATUS_VALUES: readonly CompletionStatus[] = [
	"all",
	"completed",
	"in_progress",
	"not_started",
] as const;

export function useTopicsFilterParams() {
	return useQueryStates({
		sortBy: parseAsStringLiteral(SORT_VALUES).withDefault("latest"),
		difficulties: parseAsArrayOf(parseAsStringLiteral(DIFFICULTY_VALUES)),
		completionStatus:
			parseAsStringLiteral(COMPLETION_STATUS_VALUES).withDefault("all"),
	});
}
