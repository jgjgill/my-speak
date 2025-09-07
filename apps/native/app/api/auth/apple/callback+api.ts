import { APP_SCHEME, BASE_URL } from "@/utils/constants";

export async function POST(request: Request) {
	// Parse form data from POST body since Apple uses form_post
	const formData = await request.formData();

	const code = formData.get("code")?.toString();
	const combinedPlatformAndState = formData.get("state")?.toString();
	const userDataStr = formData.get("user")?.toString();

	if (!combinedPlatformAndState) {
		return Response.json({ error: "Invalid state" }, { status: 400 });
	}

	// strip platform to return state as it was set on the client
	const platform = combinedPlatformAndState.split("|")[0];
	const state = combinedPlatformAndState.split("|")[1];

	// Parse user data if available
	if (userDataStr) {
		try {
			JSON.parse(userDataStr);
		} catch (e) {
			console.error("Failed to parse user data:", e);
		}
	}

	const outgoingParams = new URLSearchParams({
		code: code || "",
		state,
	});

	return Response.redirect(
		// OAuth 로딩 페이지로 리다이렉트하여 사용자에게 로딩 상태 표시
		// oauth-loading 페이지에서 토큰 교환 및 인증 처리 수행
		(platform === "web" ? BASE_URL : APP_SCHEME) +
			"/oauth-loading?" +
			outgoingParams.toString(),
		302,
	);
}
