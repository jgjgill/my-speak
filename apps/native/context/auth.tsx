import type { Session, User } from "@supabase/supabase-js";
import {
	type AuthError,
	type AuthRequestConfig,
	type DiscoveryDocument,
	makeRedirectUri,
	useAuthRequest,
} from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import {
	createContext,
	type PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";
import { useAuthStateEffect } from "@/hooks/use-auth-state-effect";
import { useUser } from "@/hooks/use-user";
import { BASE_URL } from "@/utils/constants";
import { supabase } from "@/utils/supabase/client";

interface TokenResponse {
	user: User;
	session: Session;
	accessToken: string;
	refreshToken?: string;
}

WebBrowser.maybeCompleteAuthSession();

export type AuthUser = User;

interface AuthContextType {
	user: AuthUser | null;
	signIn: () => Promise<void>;
	signOut: () => Promise<void>;
	isLoading: boolean;
	error: AuthError | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const config: AuthRequestConfig = {
	clientId: "google",
	scopes: ["openid", "profile", "email"],
	redirectUri: makeRedirectUri(),
};

const discovery: DiscoveryDocument = {
	authorizationEndpoint: `${BASE_URL}/api/auth/authorize`,
	tokenEndpoint: `${BASE_URL}/api/auth/token`,
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
	const { data: user = null, isLoading } = useUser();
	const [error, setError] = useState<AuthError | null>(null);

	useAuthStateEffect();

	const [request, response, promptAsync] = useAuthRequest(config, discovery);

	const signIn = async () => {
		try {
			if (!request) {
				console.log("No request");
				return;
			}

			await promptAsync();
		} catch (e) {
			console.log(e);
		}
	};
	const signOut = async () => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) {
				console.error("로그아웃 실패:", error.message);
			}
		} catch (err) {
			console.error("로그아웃 중 오류:", err);
		}
	};

	useEffect(() => {
		const handleReseponse = async () => {
			if (response?.type === "success") {
				const { code } = response.params;

				try {
					const tokenResponse = await fetch(`${BASE_URL}/api/auth/token`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							code,
						}),
					});

					const token = (await tokenResponse.json()) as TokenResponse;

					if (!token.user || !token.session) {
						return;
					}

					await supabase.auth.setSession({
						access_token: token.session.access_token,
						refresh_token: token.session.refresh_token,
					});
				} catch (err) {
					console.error("OAuth 토큰 처리 중 오류:", err);
				}
			} else if (response?.type === "error") {
				setError(response.error as AuthError);
			}
		};

		handleReseponse();
	}, [response]);

	return (
		<AuthContext.Provider
			value={{
				user,
				signIn,
				signOut,
				isLoading,
				error,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
};
