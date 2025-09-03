import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoginForm from "@/components/login-form";
import { useAuth } from "@/context/auth";

export default function LoginPage() {
	const { user, isLoading } = useAuth();

	const handleBackPress = () => {
		router.back();
	};

	if (isLoading) {
		return (
			<View className="flex-1 justify-center items-center">
				<ActivityIndicator />
			</View>
		);
	}

	if (user) {
		return null; // 이미 useEffect에서 리다이렉트 처리
	}

	return (
		<SafeAreaView className="flex-1 bg-primary">
			<View className="px-4 py-2 justify-center">
				<TouchableOpacity
					onPress={handleBackPress}
					className="w-11 h-11 justify-center items-center"
				>
					<Ionicons name="chevron-back" size={24} color="#FFFFFF" />
				</TouchableOpacity>
			</View>
			<LoginForm />
		</SafeAreaView>
	);
}
