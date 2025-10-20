"use client";

import type { User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
	createContext,
	type PropsWithChildren,
	useContext,
	useEffect,
} from "react";
import { useUser } from "@/entities/user";
import { createBrowserClient as createClient } from "@/shared/api/supabase";

/**
 * @link
 * https://supabase.com/docs/guides/auth/social-login/auth-google?queryGroups=platform&platform=web&queryGroups=framework&framework=nextjs
 */

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	signInWithGoogle: () => Promise<void>;
	signInWithApple: () => Promise<void>;
	signOut: () => Promise<void>;
	deleteAccount: () => Promise<void>;
}

interface AuthProviderProps extends PropsWithChildren {
	initialUser?: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
	children,
	initialUser = null,
}: AuthProviderProps) {
	const { data: user = null, isLoading } = useUser(initialUser);
	const queryClient = useQueryClient();
	const router = useRouter();
	const supabase = createClient();

	const signInWithGoogle = async () => {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${location.origin}/auth/callback`,
			},
		});

		if (error) {
			console.error("Google 로그인 실패:", error.message);
		}
	};

	const signInWithApple = async () => {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "apple",
			options: {
				redirectTo: `${location.origin}/auth/callback`,
			},
		});
		if (error) {
			console.error("Apple 로그인 실패:", error.message);
		}
	};

	const signOut = async () => {
		// 로그아웃 요청 시 즉시 캐시 정리 (UI 빠른 반응)
		queryClient.setQueryData(["user"], null);
		queryClient.clear();

		supabase.auth.signOut().catch(() => {
			console.log(
				"Supabase signOut error ignored (session may already be cleared)",
			);
		});
	};

	const deleteAccount = async () => {
		try {
			if (!user) {
				throw new Error("로그인이 필요합니다.");
			}

			console.log("🗑️ Starting account deletion process...");

			// Supabase Client 방식으로 Edge Function 호출
			const { data, error } = await supabase.functions.invoke("delete-user");

			if (error) {
				console.error("❌ Edge Function error:", error);
				throw new Error(error.message || "회원탈퇴에 실패했습니다.");
			}

			console.log("✅ Account deletion successful:", data.message);

			// 로컬 세션 정리 후 홈으로 이동
			await supabase.auth.signOut();
			router.push("/");
		} catch (error) {
			console.error("❌ Account deletion failed:", error);
			throw error;
		}
	};

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			if (event === "SIGNED_IN" && session) {
				queryClient.setQueryData(["user"], session.user);
			} else if (event === "SIGNED_OUT") {
				queryClient.setQueryData(["user"], null); // 즉시 UI에 반영
			}
		});

		return () => subscription.unsubscribe();
	}, [supabase.auth, queryClient]);

	const value = {
		user,
		isLoading,
		signInWithGoogle,
		signInWithApple,
		signOut,
		deleteAccount,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth는 AuthProvider 내에서 사용되어야 합니다");
	}
	return context;
}
