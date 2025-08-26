import { Ionicons } from "@expo/vector-icons";
import {
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { useAuth } from "@/context/auth";
import { SignInWithAppleButton } from "./sign-in-with-apple-button";

export default function LoginForm() {
	const { signIn } = useAuth();

	return (
		<ScrollView style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor="#1E40AF" />

			<View style={styles.backgroundGradient}>
				<View style={styles.content}>
					<View style={styles.headerSection}>
						<View style={styles.logoContainer}>
							<Ionicons name="mic" size={60} color="#FFFFFF" />
						</View>
						<Text style={styles.title}>My Speak</Text>
						<Text style={styles.subtitle}>
							영어 스피킹을 쉽고 재미있게 배워보세요
						</Text>
					</View>

					<View style={styles.descriptionSection}>
						<View style={styles.featureItem}>
							<Ionicons name="book" size={24} color="#FFFFFF" />
							<Text style={styles.featureText}>4단계 학습 시스템</Text>
						</View>
						<View style={styles.featureItem}>
							<Ionicons name="volume-high" size={24} color="#FFFFFF" />
							<Text style={styles.featureText}>말하기 연습</Text>
						</View>
						<View style={styles.featureItem}>
							<Ionicons name="trophy" size={24} color="#FFFFFF" />
							<Text style={styles.featureText}>개인 학습 데이터 보관</Text>
						</View>
					</View>

					<View style={styles.loginSection}>
						<TouchableOpacity style={styles.googleButton} onPress={signIn}>
							<Ionicons name="logo-google" size={16} />
							<Text style={styles.googleButtonText}>Google로 로그인</Text>
						</TouchableOpacity>

						<SignInWithAppleButton />

						<Text style={styles.termsText}>
							계속하면 서비스 약관 및 개인정보 처리방침에 동의하는 것으로
							간주됩니다.
						</Text>
					</View>
				</View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#1E40AF",
	},
	backgroundGradient: {
		flex: 1,
		backgroundColor: "#1E40AF",
		// 실제 그라데이션은 expo-linear-gradient 패키지가 필요하지만,
		// 단순화를 위해 단색으로 처리
	},
	content: {
		flex: 1,
		paddingHorizontal: 32,
		paddingTop: 60,
		paddingBottom: 40,
	},
	headerSection: {
		flex: 2,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 32,
	},
	logoContainer: {
		width: 120,
		height: 120,
		borderRadius: 60,
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 24,
	},
	title: {
		fontSize: 36,
		fontWeight: "bold",
		color: "#FFFFFF",
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		color: "rgba(255, 255, 255, 0.8)",
		textAlign: "center",
		lineHeight: 24,
	},
	descriptionSection: {
		flex: 1,
		justifyContent: "center",
		gap: 20,
		marginBottom: 40,
	},
	featureItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	featureText: {
		fontSize: 16,
		color: "#FFFFFF",
		fontWeight: "500",
	},
	loginSection: {
		flex: 1,
		justifyContent: "flex-end",
		gap: 20,
		paddingTop: 20,
	},
	googleButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		height: 48,
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
	googleButtonText: {
		color: "#1F2937",
		fontSize: 16,
		fontWeight: "600",
		lineHeight: 24,
	},
	termsText: {
		fontSize: 12,
		color: "rgba(255, 255, 255, 0.7)",
		textAlign: "center",
		lineHeight: 16,
		marginTop: 8,
	},
});
