import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/context/auth";
import { QueryProvider } from "@/providers/query-provider";

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<QueryProvider>
				<AuthProvider>
					<Stack screenOptions={{ headerShown: false }} />
				</AuthProvider>
			</QueryProvider>
		</SafeAreaProvider>
	);
}
