import {
	APP_SCHEME,
	BASE_URL,
	GOOGLE_AUTH_URL,
	GOOGLE_CLIENT_ID,
} from "@/utils/constants";

export async function GET(request: Request) {
	if (!GOOGLE_CLIENT_ID) {
		return Response.json(
			{ error: "Missing GOOGLE_CLIENT_ID environment variable" },
			{ status: 500 },
		);
	}

	const url = new URL(request.url);
	const internalClient = url.searchParams.get("client_id");
	const redirectUri = url.searchParams.get("redirect_uri");

	let platform: string;

	if (redirectUri === APP_SCHEME) {
		platform = "mobile";
	} else if (redirectUri === BASE_URL) {
		platform = "web";
	} else {
		return Response.json({ error: "Invalid redirect_uri" }, { status: 400 });
	}

	// use state to drive redirect back to platform
	const state = `${platform}|${url.searchParams.get("state")}`;

	if (internalClient === "google") {
		const params = new URLSearchParams({
			client_id: GOOGLE_CLIENT_ID,
			redirect_uri: `${BASE_URL}/api/auth/callback`,
			response_type: "code",
			scope: url.searchParams.get("scope") || "identity",
			state: state,
			prompt: "select_account",
		});

		return Response.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`, 302);
	} else {
		return Response.json({ error: "Invalid client" }, { status: 400 });
	}
}
