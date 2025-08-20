import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { useAuth } from "@/context/auth";
import { ThemedText } from "./theme-text";

export function SignInWithAppleButton() {
	const { signInWithAppleWebBrowser } = useAuth();

	return (
		<Pressable onPress={signInWithAppleWebBrowser}>
			<View style={styles.container}>
				<Ionicons name="logo-apple" size={16} />
				<ThemedText style={styles.text}>Apple로 로그인</ThemedText>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		height: 44,
		gap: 4,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	icon: {
		width: 24,
		height: 24,
		marginRight: 6,
	},
	text: {
		color: "#1F2937",
		fontSize: 16,
		fontWeight: "600",
	},
});
