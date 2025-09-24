import {
	isAndroidClient,
	isIOSClient,
	isMobileWebClient,
} from "./platform-client";

const NATIVE_DEEP_LINK_LIST = ["/profile", "/login", "/terms", "/privacy"];

export type DeviceType = "ios" | "android" | "unknown";

/**
 * 현재 디바이스 타입을 감지합니다.
 */
export function getDeviceType(): DeviceType {
	if (isIOSClient()) return "ios";
	if (isAndroidClient()) return "android";
	return "unknown";
}

/**
 * 현재 경로에 대한 딥링크 URL을 생성합니다.
 * 네이티브 라우트는 직접 경로로, 웹 콘텐츠는 쿼리 파라미터로 처리합니다.
 */
export function createDeepLinkUrl(currentPath: string): string {
	const isNativeRoute = NATIVE_DEEP_LINK_LIST.some((route) =>
		currentPath.startsWith(route),
	);

	if (isNativeRoute) {
		return `https://myspeak-native.expo.app${currentPath}`;
	} else {
		return `https://myspeak-native.expo.app?path=${encodeURIComponent(currentPath)}`;
	}
}

/**
 * 현재 페이지를 앱에서 열기 위한 딥링크로 이동합니다.
 */
export function openInApp(): void {
	if (typeof window === "undefined") return;

	const currentPath = window.location.pathname;
	const deepLinkUrl = createDeepLinkUrl(currentPath);
	window.location.href = deepLinkUrl;
}

/**
 * 스토어 링크를 가져옵니다.
 */
export function getStoreLinks() {
	return {
		ios: "https://apps.apple.com/kr/app/myspeak/id6752112155",
		android: "https://play.google.com/store/apps/details?id=com.myspeaknative",
	};
}

/**
 * 모바일 웹 환경에서 앱 다운로드/이동 버튼을 표시해야 하는지 확인합니다.
 */
export function shouldShowAppButton(): boolean {
	return isMobileWebClient();
}