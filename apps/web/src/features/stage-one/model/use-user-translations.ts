import type { User } from "@supabase/supabase-js";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getUserTranslations } from "../../../../app/[language]/topics/[id]/queries/stage-queries";

export const getEmptyUserTranslations = async (): Promise<never[]> => [];

export function useUserTranslations(topicId: string, user: User | null) {
	return useSuspenseQuery({
		queryKey: ["user-translations", topicId, user ? user.id : "guest"],
		queryFn: user
			? () => getUserTranslations(topicId, user)
			: getEmptyUserTranslations,
	});
}
