import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
	ActivityIndicator,
	Alert,
	Image,
	Linking,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/auth";
import { getAvatarColor, getDisplayName, getInitials } from "@/utils/avatar";

export default function ProfilePage() {
	const { user, signOut, deleteAccount, isLoading } = useAuth();

	const handleBackPress = () => {
		router.back();
	};

	const handleLogout = async () => {
		Alert.alert("로그아웃", "계정에서 로그아웃하시겠습니까?", [
			{ text: "취소", style: "cancel" },
			{
				text: "로그아웃",
				style: "default",
				onPress: async () => {
					await signOut();
					router.replace("/");
				},
			},
		]);
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

	const handleCustomerSupport = () => {
		Linking.openURL("https://forms.gle/hqLHcjeWRvMExb6v8");
	};

	if (isLoading) {
		return (
			<SafeAreaView className="flex-1 bg-white">
				<View className="flex-1 justify-center items-center">
					<ActivityIndicator size="large" color="#1E40AF" />
				</View>
			</SafeAreaView>
		);
	}

	if (!user) {
		router.replace("/login");
		return null;
	}

	const displayName = getDisplayName(user);
	const initials = getInitials(displayName);
	const avatarColor = getAvatarColor(displayName);

	return (
		<SafeAreaView className="flex-1 bg-gray-50">
			<View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200 h-14">
				<TouchableOpacity
					onPress={handleBackPress}
					className="w-11 h-11 justify-center items-center"
					activeOpacity={0.7}
				>
					<Ionicons name="chevron-back" size={24} color="#1E40AF" />
				</TouchableOpacity>
				<Text className="text-xl font-bold" style={{ color: "#1E40AF" }}>
					프로필
				</Text>
				<View className="w-11" />
			</View>

			<ScrollView className="flex-1 px-4 py-6">
				<View className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
					<Text className="text-lg font-semibold text-gray-900 mb-6">
						계정 정보
					</Text>

					<View className="flex-row items-start gap-4">
						<View className="flex-shrink-0">
							{user.user_metadata?.avatar_url ? (
								<Image
									source={{ uri: user.user_metadata.avatar_url }}
									className="w-16 h-16 rounded-full border-2 border-gray-200"
									resizeMode="cover"
								/>
							) : (
								<View
									className="w-16 h-16 rounded-full border-2 border-gray-200 justify-center items-center"
									style={{ backgroundColor: avatarColor }}
								>
									<Text className="text-white font-bold text-xl">
										{initials}
									</Text>
								</View>
							)}
						</View>

						<View className="flex-1">
							<View className="space-y-4">
								<View>
									<Text className="text-sm font-medium text-gray-700 mb-1">
										이름
									</Text>
									<Text className="text-gray-900 font-medium text-base">
										{displayName}
									</Text>
								</View>
								<View>
									<Text className="text-sm font-medium text-gray-700 mb-1">
										이메일
									</Text>
									<Text className="text-gray-600 text-base">{user.email}</Text>
								</View>
							</View>
						</View>
					</View>
				</View>

				<View className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
					<Text className="text-lg font-semibold text-gray-900 mb-4">
						계정 관리
					</Text>

					<View className="space-y-3">
						<TouchableOpacity
							onPress={handleLogout}
							className="flex-row items-center p-4 bg-gray-50 rounded-lg gap-3"
							activeOpacity={0.7}
						>
							<Ionicons name="log-out-outline" size={20} color="#6B7280" />
							<View className="flex-1">
								<Text className="font-medium text-gray-900 text-base">
									로그아웃
								</Text>
								<Text className="text-sm text-gray-500">
									계정에서 로그아웃합니다.
								</Text>
							</View>
							<Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
						</TouchableOpacity>

						<View className="border-t border-gray-100 my-4" />

						<TouchableOpacity
							onPress={handleDeleteAccount}
							className="flex-row items-center p-4 bg-red-50 rounded-lg gap-3"
							activeOpacity={0.7}
						>
							<Ionicons
								name="person-remove-outline"
								size={20}
								color="#EF4444"
							/>
							<View className="flex-1">
								<Text className="font-medium text-red-600 text-base">
									계정 삭제
								</Text>
								<Text className="text-sm text-red-500">
									모든 데이터가 영구적으로 삭제됩니다.
								</Text>
							</View>
							<Ionicons name="chevron-forward" size={16} color="#F87171" />
						</TouchableOpacity>
					</View>
				</View>

				{/* 고객지원 섹션 */}
				<View className="bg-white rounded-xl border border-gray-100 p-6">
					<Text className="text-lg font-semibold text-gray-900 mb-4">
						도움말
					</Text>

					<TouchableOpacity
						onPress={handleCustomerSupport}
						className="flex-row items-center p-4 bg-blue-50 rounded-lg gap-3"
						activeOpacity={0.7}
					>
						<Ionicons name="help-circle-outline" size={20} color="#1E40AF" />
						<View className="flex-1">
							<Text className="font-medium text-blue-700 text-base">
								고객지원 문의
							</Text>
							<Text className="text-sm text-blue-600">
								문제가 있으시면 언제든지 문의하세요.
							</Text>
						</View>
						<Ionicons name="open-outline" size={16} color="#3B82F6" />
					</TouchableOpacity>
				</View>

				{/* 하단 여백 */}
				<View className="h-8" />
			</ScrollView>
		</SafeAreaView>
	);
}
