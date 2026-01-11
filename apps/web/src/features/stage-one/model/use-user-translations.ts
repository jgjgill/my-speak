import type { User } from "@supabase/supabase-js";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getUserTranslations } from "@/entities/topic";

export const getEmptyUserTranslations = async (): Promise<never[]> => [];

export function useUserTranslations(
	topicId: string,
	language: string,
	user: User | null,
) {
	return useSuspenseQuery({
		queryKey: ["user-translations", topicId, language, user ? user.id : "guest"],
		queryFn: user
			? () => getUserTranslations(topicId, language, user)
			: getEmptyUserTranslations,
	});
}
