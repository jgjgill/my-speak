import {
	AppleAuthenticationButton,
	AppleAuthenticationButtonStyle,
	AppleAuthenticationButtonType,
} from "expo-apple-authentication";
import { useAuth } from "@/context/auth";

export function SignInWithAppleButton() {
	const { signInWithApple } = useAuth();

	return (
		<AppleAuthenticationButton
			buttonType={AppleAuthenticationButtonType.SIGN_IN}
			buttonStyle={AppleAuthenticationButtonStyle.WHITE}
			cornerRadius={12}
			style={{
				width: "100%",
				height: 40,
			}}
			onPress={signInWithApple}
		/>
	);
}
