import type { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "../utils/supabase/client";

async function getUser(): Promise<User | null> {
	const supabase = createClient();
	const { data, error } = await supabase.auth.getUser();

	if (error) {
		console.log("User not authenticated:", error.message);
		return null;
	}
	return data.user;
}

export function useUser(initialUser?: User | null) {
	return useQuery({
		queryKey: ["user"],
		queryFn: getUser,
		staleTime: 15 * 60 * 1000,
		gcTime: Infinity,
		initialData: initialUser,
	});
}
