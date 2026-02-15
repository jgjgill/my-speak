import type { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/entities/user";
import { userKeys } from "@/shared/api/query-keys";

export function useUser(initialUser?: User | null) {
	return useQuery({
		queryKey: userKeys.all,
		queryFn: getUser,
		staleTime: 15 * 60 * 1000,
		gcTime: Infinity,
		initialData: initialUser,
	});
}
