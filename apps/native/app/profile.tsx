import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
	ActivityIndicator,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/auth";

export default function ProfilePage() {
	const { user, signOut, isLoading } = useAuth();

	const handleBackPress = () => {
		router.back();
	};

	const handleLogout = async () => {
		await signOut();
		router.replace("/");
	};

	if (isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator />
			</View>
		);
	}

	if (!user) {
		router.replace("/login");
		return null;
	}

	return (
		<SafeAreaView style={styles.container}>
			{/* 헤더 */}
			<View style={styles.header}>
				<TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
					<Ionicons name="chevron-back" size={24} color="#1E40AF" />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>프로필</Text>
				<View style={styles.headerSpacer} />
			</View>

			{/* 프로필 내용 */}
			<View style={styles.content}>
				<View style={styles.profileSection}>
					{user.user_metadata?.avatar_url ? (
						<Image
							source={{ uri: user.user_metadata.avatar_url }}
							style={styles.profileImage}
						/>
					) : (
						<View style={styles.profileImagePlaceholder}>
							<Ionicons name="person" size={40} color="#FFFFFF" />
						</View>
					)}

					<Text style={styles.userName}>
						{user.user_metadata?.full_name || user.email}
					</Text>
					<Text style={styles.userEmail}>{user.email}</Text>
				</View>

				<View style={styles.actionsSection}>
					<TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
						<Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
						<Text style={styles.logoutButtonText}>로그아웃</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#E5E7EB",
		height: 56,
	},
	backButton: {
		width: 44,
		height: 44,
		justifyContent: "center",
		alignItems: "center",
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#1E40AF",
	},
	headerSpacer: {
		width: 44,
	},
	content: {
		flex: 1,
		padding: 24,
	},
	profileSection: {
		alignItems: "center",
		marginBottom: 48,
	},
	profileImage: {
		width: 80,
		height: 80,
		borderRadius: 40,
		marginBottom: 16,
	},
	profileImagePlaceholder: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: "#3B82F6",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 16,
	},
	userName: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#1F2937",
		marginBottom: 4,
	},
	userEmail: {
		fontSize: 16,
		color: "#6B7280",
	},
	actionsSection: {
		flex: 1,
	},
	logoutButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#EF4444",
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 8,
		gap: 8,
	},
	logoutButtonText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "600",
	},
});
