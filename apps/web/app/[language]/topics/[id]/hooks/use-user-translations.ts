import type { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { getUserTranslations } from "../queries/stage-one-queries";

export const getEmptyUserTranslations = async (): Promise<never[]> => [];

export function useUserTranslations(topicId: string, user: User | null) {
	return useQuery({
		queryKey: ["user-translations", topicId, user ? user.id : "guest"],
		queryFn: user
			? () => getUserTranslations(topicId, user)
			: getEmptyUserTranslations,
		enabled: !!user,
		initialData: [],
	});
}
