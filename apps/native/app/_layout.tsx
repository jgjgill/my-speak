import { Stack } from "expo-router";
import { AuthProvider } from "@/context/auth";
import { QueryProvider } from "@/providers/query-provider";

export default function RootLayout() {
	return (
		<QueryProvider>
			<AuthProvider>
				<Stack
					screenOptions={{
						headerShown: false,
					}}
				/>
			</AuthProvider>
		</QueryProvider>
	);
}
