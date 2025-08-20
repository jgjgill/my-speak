import {
	AppleAuthenticationButton,
	AppleAuthenticationButtonStyle,
	AppleAuthenticationButtonType,
} from "expo-apple-authentication";
import { StyleSheet } from "react-native";
import { useAuth } from "@/context/auth";

export function SignInWithAppleButton() {
	const { signInWithApple } = useAuth();

	return (
		<AppleAuthenticationButton
			buttonType={AppleAuthenticationButtonType.SIGN_IN}
			buttonStyle={AppleAuthenticationButtonStyle.WHITE}
			cornerRadius={12}
			style={styles.button}
			onPress={signInWithApple}
		/>
	);
}

const styles = StyleSheet.create({
	button: {
		width: "100%",
		height: 44,
		fontSize: 12,
	},
});
