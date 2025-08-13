import { Button, Text, View } from "react-native";
import { useAuth } from "@/context/auth";

export default function LoginForm() {
	const { signIn } = useAuth();

	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Text>Login</Text>
			<Button title="Sign in with Google" onPress={signIn} />
		</View>
	);
}
