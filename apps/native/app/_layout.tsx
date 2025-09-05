import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/context/auth";
import { WebViewProvider } from "@/context/webview-context";
import { QueryProvider } from "@/providers/query-provider";
import "../global.css";

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<QueryProvider>
				<WebViewProvider>
					<AuthProvider>
						<Stack
							screenOptions={{
								headerShown: false,
								animation: "fade",
								animationDuration: 300,
							}}
						>
							<Stack.Screen name="index" options={{ animation: "none" }} />
						</Stack>
					</AuthProvider>
				</WebViewProvider>
			</QueryProvider>
		</SafeAreaProvider>
	);
}
