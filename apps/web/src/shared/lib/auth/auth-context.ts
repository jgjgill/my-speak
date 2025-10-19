import type { User } from "@supabase/supabase-js";
import { createSafeContext } from "../create-safe-context";

export interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	signInWithGoogle: () => Promise<void>;
	signInWithApple: () => Promise<void>;
	signOut: () => Promise<void>;
	deleteAccount: () => Promise<void>;
}

export const [AuthProvider, useAuth] =
	createSafeContext<AuthContextType>("Auth");
