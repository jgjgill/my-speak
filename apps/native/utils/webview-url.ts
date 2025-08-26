import Constants from "expo-constants";
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

	// 개발환경: 플랫폼별 적절한 주소 사용
	let hostname: string;

	if (Platform.OS === "android") {
		// 실제 기기에서는 Expo 개발 서버의 실제 IP 사용
		// 에뮬레이터에서는 10.0.2.2 사용
		hostname = Constants.expoConfig?.hostUri?.split(":")[0] || "10.0.2.2";
	} else {
		hostname = "localhost";
	}

	return `http://${hostname}:3000?native=true&hideHeader=true`;
}
