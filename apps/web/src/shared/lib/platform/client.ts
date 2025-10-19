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

/**
 * 클라이언트에서 모바일 환경인지 확인합니다.
 * @returns boolean 모바일 환경인 경우 true
 */
export function isMobileClient(): boolean {
	if (typeof window === "undefined") return false;

	const userAgent = navigator.userAgent;
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		userAgent,
	);
}

/**
 * 클라이언트에서 iOS 환경인지 확인합니다.
 * @returns boolean iOS 환경인 경우 true
 */
export function isIOSClient(): boolean {
	if (typeof window === "undefined") return false;

	const userAgent = navigator.userAgent;
	return /iPhone|iPad|iPod/.test(userAgent);
}

/**
 * 클라이언트에서 Android 환경인지 확인합니다.
 * @returns boolean Android 환경인 경우 true
 */
export function isAndroidClient(): boolean {
	if (typeof window === "undefined") return false;

	const userAgent = navigator.userAgent;
	return /Android/.test(userAgent);
}

/**
 * 클라이언트에서 데스크톱 환경인지 확인합니다.
 * @returns boolean 데스크톱 환경인 경우 true
 */
export function isDesktopClient(): boolean {
	return !isMobileClient();
}

/**
 * 네이티브 웹뷰가 아닌 일반 모바일 브라우저인지 확인합니다.
 * @returns boolean 일반 모바일 브라우저인 경우 true
 */
export function isMobileWebClient(): boolean {
	return isMobileClient() && !isNativeWebViewClient();
}
