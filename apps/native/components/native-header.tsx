import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "@/context/auth";

interface NativeHeaderProps {
	onBackPress?: () => void;
	showBackButton?: boolean;
}

export default function NativeHeader({
	onBackPress,
	showBackButton = false,
}: NativeHeaderProps) {
	const { user, signOut } = useAuth();

	const handleProfilePress = () => {
		if (user) {
			// 로그아웃 모달 또는 직접 로그아웃
			signOut();
		} else {
			// 로그인 페이지로 이동 (현재는 이미 로그인 페이지에 있음)
		}
	};

	return (
		<View style={styles.header}>
			{/* 좌측: 뒤로가기 버튼 */}
			<View style={styles.leftSection}>
				{showBackButton && onBackPress && (
					<TouchableOpacity
						onPress={onBackPress}
						style={styles.backButton}
						activeOpacity={0.7}
					>
						<Ionicons name="chevron-back" size={24} color="#1E40AF" />
					</TouchableOpacity>
				)}
			</View>

			{/* 중앙: 로고 */}
			<View style={styles.centerSection}>
				<Text style={styles.logo}>My Speak</Text>
			</View>

			{/* 우측: 프로필 */}
			<View style={styles.rightSection}>
				<TouchableOpacity
					onPress={handleProfilePress}
					style={styles.profileButton}
					activeOpacity={0.7}
				>
					{user ? (
						<View style={styles.profileContainer}>
							{user.user_metadata?.avatar_url ? (
								<Image
									source={{ uri: user.user_metadata.avatar_url }}
									style={styles.avatar}
								/>
							) : (
								<View style={styles.avatarPlaceholder}>
									<Ionicons name="person" size={20} color="#FFFFFF" />
								</View>
							)}
						</View>
					) : (
						<View style={styles.loginButton}>
							<Text style={styles.loginText}>로그인</Text>
						</View>
					)}
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: "#FFFFFF",
		borderBottomWidth: 1,
		borderBottomColor: "#E5E7EB",
		height: 56,
	},
	leftSection: {
		flex: 1,
		alignItems: "flex-start",
	},
	centerSection: {
		flex: 2,
		alignItems: "center",
	},
	rightSection: {
		flex: 1,
		alignItems: "flex-end",
	},
	backButton: {
		width: 44,
		height: 44,
		justifyContent: "center",
		alignItems: "center",
	},
	logo: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#1E40AF",
	},
	profileButton: {
		width: 44,
		height: 44,
		justifyContent: "center",
		alignItems: "center",
	},
	profileContainer: {
		width: 36,
		height: 36,
		borderRadius: 18,
		overflow: "hidden",
	},
	avatar: {
		width: 36,
		height: 36,
		borderRadius: 18,
	},
	avatarPlaceholder: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: "#3B82F6",
		justifyContent: "center",
		alignItems: "center",
	},
	loginButton: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		backgroundColor: "#3B82F6",
		borderRadius: 6,
		minWidth: 60,
		alignItems: "center",
	},
	loginText: {
		color: "#FFFFFF",
		fontSize: 14,
		fontWeight: "600",
	},
});
