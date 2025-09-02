import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { useAuth } from "@/context/auth";
import { ThemedText } from "./theme-text";

export function SignInWithAppleButton() {
	const { signInWithAppleWebBrowser } = useAuth();

	return (
		<Pressable onPress={signInWithAppleWebBrowser}>
			<View className="flex-row items-center justify-center bg-white rounded-xl h-12 gap-1 shadow-lg">
				<Ionicons name="logo-apple" size={16} />
				<ThemedText className="text-text-primary text-base font-semibold">
					Apple로 로그인
				</ThemedText>
			</View>
		</Pressable>
	);
}
