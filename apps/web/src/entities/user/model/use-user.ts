import type { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/entities/user";

export function useUser(initialUser?: User | null) {
	return useQuery({
		queryKey: ["user"],
		queryFn: getUser,
		staleTime: 15 * 60 * 1000,
		gcTime: Infinity,
		initialData: initialUser,
	});
}
