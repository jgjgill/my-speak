import { ActivityIndicator, Button, Text, View } from "react-native";
import LoginForm from "@/components/login-form";
import { useAuth } from "@/context/auth";

export default function Index() {
	const { user, isLoading, signOut } = useAuth();

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
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Text>{JSON.stringify(user.email)}</Text>

			<Text>{user.user_metadata?.full_name}</Text>
			<Button title="Sign Out" onPress={signOut} />
		</View>
	);
}
