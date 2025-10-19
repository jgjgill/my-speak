import { headers } from "next/headers";

/**
 * 네이티브 앱의 웹뷰에서 접근하는지 확인합니다.
 * @returns Promise<boolean> 네이티브 웹뷰에서 접근하는 경우 true
 */
export async function isNativeWebView(): Promise<boolean> {
	const userAgent = await getUserAgent();

	return userAgent.includes("MySpeak") && userAgent.includes("ReactNative");
}

/**
 * User-Agent 문자열을 반환합니다.
 * @returns Promise<string> User-Agent 문자열
 */
export async function getUserAgent(): Promise<string> {
	const headersList = await headers();
	return headersList.get("user-agent") || "";
}
