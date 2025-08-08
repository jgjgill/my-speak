import { useSuspenseQuery } from "@tanstack/react-query";
import { getUser } from "../queries/user-auth-queries";

export function useUser() {
	return useSuspenseQuery({
		queryKey: ["user"],
		queryFn: getUser,
		staleTime: 15 * 60 * 1000,
		gcTime: Infinity,
		initialData: null,
	});
}
