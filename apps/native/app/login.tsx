import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import {
	ActivityIndicator,
	Platform,
	StyleSheet,
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
		if (user && !isLoading && Platform.OS === "ios") {
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
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
					<Ionicons name="chevron-back" size={24} color="#FFFFFF" />
				</TouchableOpacity>
			</View>
			<LoginForm />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#1E40AF",
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
