import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoginForm from "@/components/login-form";
import { useAuth } from "@/context/auth";

export default function LoginPage() {
	const { user, isLoading } = useAuth();

	const handleBackPress = () => {
		router.back();
	};

	useEffect(() => {
		if (user && !isLoading) {
			router.replace("/");
		}
	}, [user, isLoading]);

	if (isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator />
			</View>
		);
	}

	if (user) {
		return null; // 이미 useEffect에서 리다이렉트 처리
	}

	return (
		<View style={styles.container}>
			<SafeAreaView style={styles.safeArea}>
				{/* 뒤로가기 버튼 */}
				<View style={styles.header}>
					<TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
						<Ionicons name="chevron-back" size={24} color="#FFFFFF" />
					</TouchableOpacity>
				</View>
			</SafeAreaView>
			<LoginForm />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#1E40AF",
	},
	safeArea: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		zIndex: 10,
		backgroundColor: "transparent",
	},
	header: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		justifyContent: "center",
	},
	backButton: {
		width: 44,
		height: 44,
		justifyContent: "center",
		alignItems: "center",
	},
});
