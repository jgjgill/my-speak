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
import { useUser } from "../hooks/use-user";
import { createClient } from "../utils/supabase/client";

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

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (_event, session) => {
			queryClient.setQueryData(["user"], session?.user ?? null);
		});

		return () => subscription.unsubscribe();
	}, [supabase.auth, queryClient]);

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
		const { error } = await supabase.auth.signOut();

		if (error) {
			console.error("로그아웃 실패:", error.message);
		} else {
			router.push("/");
		}
	};

	const deleteAccount = async () => {
		try {
			if (!user) {
				throw new Error('로그인이 필요합니다.');
			}

			console.log('🗑️ Starting account deletion process...');

			// Supabase Client 방식으로 Edge Function 호출
			const { data, error } = await supabase.functions.invoke('delete-user');

			if (error) {
				console.error('❌ Edge Function error:', error);
				throw new Error(error.message || '회원탈퇴에 실패했습니다.');
			}

			console.log('✅ Account deletion successful:', data.message);

			// 로컬 세션 정리 후 홈으로 이동
			await supabase.auth.signOut();
			router.push('/');
			
		} catch (error) {
			console.error('❌ Account deletion failed:', error);
			throw error;
		}
	};

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
