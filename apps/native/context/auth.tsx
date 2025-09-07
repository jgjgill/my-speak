import type { Session, User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import {
	AppleAuthenticationScope,
	signInAsync,
} from "expo-apple-authentication";
import {
	type AuthError,
	type AuthRequestConfig,
	type DiscoveryDocument,
	makeRedirectUri,
	useAuthRequest,
} from "expo-auth-session";
import {
	CryptoDigestAlgorithm,
	digestStringAsync,
	randomUUID,
} from "expo-crypto";
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
	signInWithApple: () => Promise<void>;
	signInWithAppleWebBrowser: () => Promise<void>;
	deleteAccount: () => Promise<void>;
	isLoading: boolean;
	error: AuthError | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const config: AuthRequestConfig = {
	clientId: "google",
	scopes: ["openid", "profile", "email"],
	redirectUri: makeRedirectUri(),
};

const appleConfig: AuthRequestConfig = {
	clientId: "apple",
	scopes: ["name", "email"],
	redirectUri: makeRedirectUri(),
};

const discovery: DiscoveryDocument = {
	authorizationEndpoint: `${BASE_URL}/api/auth/authorize`,
	tokenEndpoint: `${BASE_URL}/api/auth/token`,
};

const appleDiscovery: DiscoveryDocument = {
	authorizationEndpoint: `${BASE_URL}/api/auth/apple/authorize`,
	tokenEndpoint: `${BASE_URL}/api/auth/apple/token`,
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
	const { data: user = null, isLoading } = useUser();
	const [error, setError] = useState<AuthError | null>(null);

	const queryClient = useQueryClient();

	const [request, response, promptAsync] = useAuthRequest(config, discovery);
	const [appleRequest, appleResponse, promptAppleAsync] = useAuthRequest(
		appleConfig,
		appleDiscovery,
	);

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

			// 로컬 세션 정리
			await supabase.auth.signOut();
		} catch (error) {
			console.error("❌ Account deletion failed:", error);
			throw error;
		}
	};

	const signInWithApple = async () => {
		try {
			const rawNonce = randomUUID();
			const hashedNonce = await digestStringAsync(
				CryptoDigestAlgorithm.SHA256,
				rawNonce,
			);

			const credential = await signInAsync({
				requestedScopes: [
					AppleAuthenticationScope.FULL_NAME,
					AppleAuthenticationScope.EMAIL,
				],
				nonce: hashedNonce,
			});

			if (!credential.identityToken) {
				throw new Error("Apple 인증에 실패했습니다.");
			}

			const { data: supabaseData, error } =
				await supabase.auth.signInWithIdToken({
					provider: "apple",
					token: credential.identityToken,
					nonce: rawNonce,
				});

			if (error) {
				throw error;
			}

			if (credential.fullName?.givenName && credential.email) {
				console.log("🍎 첫 번째 로그인 - 사용자 정보:", {
					email: credential.email,
					name: `${credential.fullName.givenName} ${credential.fullName.familyName}`,
				});
			}

			await supabase.auth.setSession({
				access_token: supabaseData.session.access_token,
				refresh_token: supabaseData.session.refresh_token,
			});
		} catch (error) {
			console.error("Apple 로그인 실패:", error);
			setError(error as AuthError);
		}
	};

	const signInWithAppleWebBrowser = async () => {
		try {
			if (!appleRequest) {
				console.log("No appleRequest");
				return;
			}
			await promptAppleAsync();
		} catch (e) {
			console.log(e);
		}
	};

	useAuthStateEffect();

	useEffect(() => {
		const handleResponse = async () => {
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

		handleResponse();
	}, [response]);

	useEffect(() => {
		const handleAppleResponse = async () => {
			if (appleResponse?.type === "success") {
				const { code } = appleResponse.params;

				try {
					const tokenResponse = await fetch(
						`${BASE_URL}/api/auth/apple/token`,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								code,
							}),
						},
					);

					const token = (await tokenResponse.json()) as TokenResponse;

					if (!token.user || !token.session) {
						return;
					}

					await supabase.auth.setSession({
						access_token: token.session.access_token,
						refresh_token: token.session.refresh_token,
					});
				} catch (err) {
					console.error("Apple OAuth 토큰 처리 중 오류:", err);
				}
			} else if (appleResponse?.type === "error") {
				setError(appleResponse.error as AuthError);
			}
		};

		handleAppleResponse();
	}, [appleResponse]);

	return (
		<AuthContext.Provider
			value={{
				user,
				signIn,
				signOut,
				signInWithApple,
				signInWithAppleWebBrowser,
				deleteAccount,
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
