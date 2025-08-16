import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoginForm from "@/components/login-form";
import SimpleWebView from "@/components/simple-webview";
import { useAuth } from "@/context/auth";

export default function Index() {
	const { user, isLoading, signOut, signIn } = useAuth();

	if (isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator />
			</View>
		);
	}

	if (!user) {
		return <LoginForm />;
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
			<SimpleWebView />
		</SafeAreaView>
	);
}
