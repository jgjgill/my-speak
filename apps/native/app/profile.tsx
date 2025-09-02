import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
	ActivityIndicator,
	Alert,
	Image,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/auth";

export default function ProfilePage() {
	const { user, signOut, deleteAccount, isLoading } = useAuth();

	const handleBackPress = () => {
		router.back();
	};

	const handleLogout = async () => {
		await signOut();
		router.replace("/");
	};

	const handleDeleteAccount = () => {
		Alert.alert(
			"회원탈퇴",
			"정말로 계정을 삭제하시겠습니까?\n\n• 모든 학습 기록이 삭제됩니다\n• 이 작업은 되돌릴 수 없습니다",
			[
				{ text: "취소", style: "cancel" },
				{
					text: "탈퇴",
					style: "destructive",
					onPress: async () => {
						try {
							await deleteAccount();
							router.replace("/login");
							Alert.alert("완료", "회원탈퇴가 완료되었습니다.", [
								{ text: "확인" },
							]);
						} catch (error) {
							console.error(error);
							Alert.alert(
								"오류",
								"회원탈퇴에 실패했습니다. 다시 시도해주세요.",
							);
						}
					},
				},
			],
		);
	};

	if (isLoading) {
		return (
			<View className="flex-1 justify-center items-center">
				<ActivityIndicator />
			</View>
		);
	}

	if (!user) {
		router.replace("/login");
		return null;
	}

	return (
		<SafeAreaView className="flex-1 bg-white">
			{/* 헤더 */}
			<View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 h-14">
				<TouchableOpacity
					onPress={handleBackPress}
					className="w-11 h-11 justify-center items-center"
				>
					<Ionicons name="chevron-back" size={24} color="#1e9aff" />
				</TouchableOpacity>
				<Text className="text-xl font-bold text-primary">프로필</Text>
				<View className="w-11" />
			</View>

			{/* 프로필 내용 */}
			<View className="flex-1 p-6">
				<View className="items-center mb-12">
					{user.user_metadata?.avatar_url ? (
						<Image
							source={{ uri: user.user_metadata.avatar_url }}
							className="w-20 h-20 rounded-full mb-4"
						/>
					) : (
						<View className="w-20 h-20 rounded-full bg-stage-1 justify-center items-center mb-4">
							<Ionicons name="person" size={40} color="#FFFFFF" />
						</View>
					)}

					<Text className="text-2xl font-bold text-text-primary mb-1">
						{user.user_metadata?.full_name || user.email}
					</Text>
					<Text className="text-base text-text-secondary">{user.email}</Text>
				</View>

				<View className="flex-1">
					<TouchableOpacity
						className="flex-row items-center justify-center bg-red-500 py-3 px-6 rounded-lg gap-2"
						onPress={handleLogout}
					>
						<Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
						<Text className="text-white text-base font-semibold">로그아웃</Text>
					</TouchableOpacity>

					<TouchableOpacity
						className="flex-row items-center justify-center bg-red-600 py-3 px-6 rounded-lg gap-2 mt-3"
						onPress={handleDeleteAccount}
					>
						<Ionicons name="person-remove-outline" size={20} color="#FFFFFF" />
						<Text className="text-white text-base font-semibold">회원탈퇴</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
}
