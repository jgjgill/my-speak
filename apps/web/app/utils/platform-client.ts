/**
 * 클라이언트에서 네이티브 웹뷰 환경인지 확인합니다.
 * @returns boolean 네이티브 웹뷰에서 접근하는 경우 true
 */
export function isNativeWebViewClient(): boolean {
	if (typeof window === "undefined") return false;
	
	const userAgent = navigator.userAgent;
	return (
		(userAgent.includes("MySpeak") && userAgent.includes("ReactNative")) ||
		window.ReactNativeWebView !== undefined
	);
}