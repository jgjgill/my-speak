import {
	APP_SCHEME,
	APPLE_AUTH_URL,
	APPLE_CLIENT_ID_WEB,
	APPLE_REDIRECT_URI,
	BASE_URL,
} from "@/utils/constants";

export async function GET(request: Request) {
	if (!APPLE_CLIENT_ID_WEB) {
		return Response.json(
			{ error: "Missing Apple OAuth client configuration" },
			{ status: 500 },
		);
	}

	const url = new URL(request.url);
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

	const params = new URLSearchParams({
		client_id: APPLE_CLIENT_ID_WEB,
		redirect_uri: APPLE_REDIRECT_URI,
		response_type: "code",
		scope: url.searchParams.get("scope") || "name email",
		state: state,
		response_mode: "form_post",
	});

	return Response.redirect(`${APPLE_AUTH_URL}?${params.toString()}`, 302);
}
