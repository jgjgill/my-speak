import { useEffect } from "react";
import { Platform } from "react-native";

export function TrackingTransparency() {
	useEffect(() => {
		const requestTracking = async () => {
			// 웹 환경에서는 tracking transparency가 필요 없음
			if (Platform.OS === "web") {
				console.log("🌐 Web environment - No tracking permission needed");
				return;
			}

			if (Platform.OS === "ios") {
				try {
					// 동적 import로 네이티브 환경에서만 로드
					const { requestTrackingPermissionsAsync } = await import("expo-tracking-transparency");
					const { status } = await requestTrackingPermissionsAsync();

					if (status === "granted") {
						console.log(
							"✅ Tracking permission granted - Full analytics enabled",
						);
					} else {
						console.log(
							"❌ Tracking permission denied - Anonymous analytics only",
						);
					}
				} catch (error) {
					console.log("⚠️ Tracking transparency not available:", error);
				}
			}
		};

		requestTracking();
	}, []);

	return null;
}
