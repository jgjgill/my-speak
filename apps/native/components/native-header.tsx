import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "@/context/auth";

interface NativeHeaderProps {
	onBackPress?: () => void;
	showBackButton?: boolean;
	onWebViewBack?: () => void;
	currentUrl?: string;
}

export default function NativeHeader({
	onBackPress,
	showBackButton = false,
	onWebViewBack,
	currentUrl = "",
}: NativeHeaderProps) {
	const { user } = useAuth();

	// URL에 따라 웹뷰 뒤로가기 버튼 표시 여부 결정
	const shouldShowWebViewBackButton =
		currentUrl.includes("/topics/") || currentUrl.includes("/topics");

	const handleProfilePress = () => {
		if (user) {
			router.push("/profile");
		} else {
			router.push("/login");
		}
	};

	return (
		<View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200 h-14">
			{/* 좌측: 뒤로가기 버튼 */}
			<View className="flex-1 items-start">
				{showBackButton && onBackPress && (
					<TouchableOpacity
						onPress={onBackPress}
						className="w-11 h-11 justify-center items-center"
						activeOpacity={0.7}
					>
						<Ionicons name="chevron-back" size={24} color="#1e9aff" />
					</TouchableOpacity>
				)}
				{shouldShowWebViewBackButton && onWebViewBack && (
					<TouchableOpacity
						onPress={onWebViewBack}
						className="w-11 h-11 justify-center items-center"
						activeOpacity={0.7}
					>
						<Ionicons name="chevron-back" size={24} color="#1e9aff" />
					</TouchableOpacity>
				)}
			</View>

			<View className="flex-2 items-center">
				<TouchableOpacity
					onPress={() => router.replace("/")}
					activeOpacity={0.7}
				>
					<Text className="text-xl font-bold text-primary">My Speak</Text>
				</TouchableOpacity>
			</View>

			<View className="flex-1 items-end">
				<TouchableOpacity
					onPress={handleProfilePress}
					className="w-11 h-11 justify-center items-center"
					activeOpacity={0.7}
				>
					{user ? (
						<View className="w-9 h-9 rounded-full overflow-hidden">
							{user.user_metadata?.avatar_url ? (
								<Image
									source={{ uri: user.user_metadata.avatar_url }}
									className="w-9 h-9 rounded-full"
								/>
							) : (
								<View className="w-9 h-9 rounded-full bg-stage-1 justify-center items-center">
									<Ionicons name="person" size={20} color="#FFFFFF" />
								</View>
							)}
						</View>
					) : (
						<View className="w-9 h-9 justify-center items-center">
							<Ionicons
								name="person-circle-outline"
								size={32}
								color="#1e9aff"
							/>
						</View>
					)}
				</TouchableOpacity>
			</View>
		</View>
	);
}
