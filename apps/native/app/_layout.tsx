import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TrackingTransparency } from "@/components/tracking-transparency";
import { AuthProvider } from "@/context/auth";
import { DeepLinkProvider } from "@/context/deep-link-context";
import { WebViewProvider } from "@/context/webview-context";
import { QueryProvider } from "@/providers/query-provider";
import "../global.css";

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<QueryProvider>
				<DeepLinkProvider>
					<WebViewProvider>
						<AuthProvider>
							<TrackingTransparency />
							<Stack
								screenOptions={{
									headerShown: false,
									animation: "fade",
									animationDuration: 300,
									statusBarStyle: "dark",
								}}
							>
								<Stack.Screen name="index" options={{ animation: "none" }} />
								<Stack.Screen
									name="login"
									options={{ statusBarStyle: "light" }}
								/>
							</Stack>
						</AuthProvider>
					</WebViewProvider>
				</DeepLinkProvider>
			</QueryProvider>
		</SafeAreaProvider>
	);
}
