import { APP_SCHEME, BASE_URL } from "@/utils/constants";

export async function GET(request: Request) {
	const incomingParams = new URLSearchParams(request.url.split("?")[1]);
	const combinedPlatformAndState = incomingParams.get("state");

	if (!combinedPlatformAndState) {
		return Response.json({ error: "Invalid state" }, { status: 400 });
	}

	// strip platform to return state as it was set on the client
	const platform = combinedPlatformAndState.split("|")[0];
	const state = combinedPlatformAndState.split("|")[1];

	const outgoingParams = new URLSearchParams({
		code: incomingParams.get("code")?.toString() || "",
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
