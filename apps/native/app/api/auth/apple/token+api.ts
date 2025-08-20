import type { Database } from "@repo/typescript-config/supabase-types";
import { createClient } from "@supabase/supabase-js";
import {
	APPLE_CLIENT_ID_WEB,
	APPLE_CLIENT_SECRET_WEB,
	APPLE_REDIRECT_URI,
} from "@/utils/constants";

interface AppleTokenResponse {
	access_token: string;
	id_token: string;
	refresh_token?: string;
	expires_in: number;
	token_type: string;
}

interface RequestBody {
	code: string;
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request: Request) {
	const body = (await request.json()) as RequestBody;
	const code = body.code;

	if (!supabaseUrl || !supabaseAnonKey) {
		return Response.json(
			{ error: "Missing Supabase configuration" },
			{ status: 500 },
		);
	}

	if (!code) {
		return Response.json(
			{ error: "Missing authorization code" },
			{ status: 400 },
		);
	}

	// Apple 토큰 교환 요청
	const response = await fetch("https://appleid.apple.com/auth/token", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			client_id: APPLE_CLIENT_ID_WEB,
			client_secret: APPLE_CLIENT_SECRET_WEB,
			redirect_uri: APPLE_REDIRECT_URI,
			grant_type: "authorization_code",
			code,
		}).toString(),
	});

	const data = (await response.json()) as AppleTokenResponse;

	if (!data.id_token) {
		return Response.json(
			{ error: "Missing required parameters" },
			{ status: 400 },
		);
	}

	const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

	// Supabase Apple OAuth 연동
	const { data: supabaseData, error } = await supabase.auth.signInWithIdToken({
		provider: "apple",
		token: data.id_token,
	});

	if (error) {
		return Response.json(
			{ error: "Supabase authentication failed", details: error.message },
			{ status: 400 },
		);
	}

	return Response.json({
		user: supabaseData.user,
		session: supabaseData.session,
		accessToken: supabaseData.session?.access_token,
		refreshToken: supabaseData.session?.refresh_token,
	});
}
