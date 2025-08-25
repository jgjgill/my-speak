import { Platform } from "react-native";
import { WEB_APP_URL } from "./constants";

/**
 * 플랫폼별 적절한 WebView URL을 반환합니다.
 */
export function getWebViewUrl(): string {
	// 프로덕션 URL (https://)이 있으면 그대로 사용
	if (WEB_APP_URL && WEB_APP_URL.startsWith("https://")) {
		return `${WEB_APP_URL}?native=true&hideHeader=true`;
	}

	// 개발환경: 플랫폼별 localhost 주소 사용
	const localhost = Platform.OS === "android" ? "10.0.2.2" : "localhost";
	return `http://${localhost}:3000?native=true&hideHeader=true`;
}
