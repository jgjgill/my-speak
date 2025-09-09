import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import { useEffect } from "react";
import { Platform } from "react-native";

export function TrackingTransparency() {
	useEffect(() => {
		const requestTracking = async () => {
			if (Platform.OS === "ios") {
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
			}
		};

		requestTracking();
	}, []);

	return null;
}
