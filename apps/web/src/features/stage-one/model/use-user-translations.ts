import type { User } from "@supabase/supabase-js";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getUserTranslations } from "@/entities/topic";
import { userDataKeys } from "@/shared/api/query-keys";

export const getEmptyUserTranslations = async (): Promise<never[]> => [];

export function useUserTranslations(
	topicId: string,
	language: string,
	user: User | null,
) {
	return useSuspenseQuery({
		queryKey: userDataKeys.translations(topicId, language, user?.id ?? null),
		queryFn: user
			? () => getUserTranslations(topicId, language, user)
			: getEmptyUserTranslations,
	});
}
