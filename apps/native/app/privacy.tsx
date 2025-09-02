import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyPage() {
	const handleBackPress = () => {
		router.back();
	};

	return (
		<SafeAreaView className="flex-1 bg-white">
			<View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
				<TouchableOpacity
					onPress={handleBackPress}
					className="w-11 h-11 justify-center items-center"
				>
					<Ionicons name="chevron-back" size={24} color="#1e9aff" />
				</TouchableOpacity>
				<Text className="text-lg font-bold text-text-primary">
					개인정보 처리방침
				</Text>
				<View className="w-11" />
			</View>

			<ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
				<View className="mt-6 mb-2">
					<Text className="text-lg font-bold text-text-primary mb-3">
						어떤 정보를 수집하나요?
					</Text>
					<Text className="text-base leading-6 text-text-secondary mb-2">
						Google이나 Apple로 로그인할 때:
					</Text>
					<Text className="text-base leading-6 text-text-secondary mb-2">
						• 이메일 주소
					</Text>
					<Text className="text-base leading-6 text-text-secondary mb-2">
						• 프로필 사진
					</Text>
					<Text className="text-base leading-6 text-text-secondary mb-2">
						• 이름
					</Text>
					<Text className="text-base leading-6 text-text-secondary mb-2">
						학습하면서 생기는 정보:
					</Text>
					<Text className="text-base leading-6 text-text-secondary mb-2">
						• 어떤 주제를 학습했는지
					</Text>
					<Text className="text-base leading-6 text-text-secondary mb-2">
						• 진도 기록
					</Text>
				</View>

				<View className="mt-6 mb-2">
					<Text className="text-lg font-bold text-text-primary mb-3">
						왜 수집하나요?
					</Text>
					<Text className="text-base leading-6 text-text-secondary mb-2">
						• 로그인해서 내 학습 기록을 볼 수 있도록
					</Text>
					<Text className="text-base leading-6 text-text-secondary mb-2">
						• 어디까지 공부했는지 기억할 수 있도록
					</Text>
					<Text className="text-base leading-6 text-text-secondary mb-2">
						• 더 나은 학습 경험을 제공하기 위해
					</Text>
				</View>

				<View className="mt-6 mb-2">
					<Text className="text-lg font-bold text-text-primary mb-3">
						정보를 어떻게 보호하나요?
					</Text>
					<Text className="text-base leading-6 text-text-secondary mb-2">
						안전한 암호화 방식을 사용하고, 필요한 최소한의 정보만 수집합니다.
						다른 사람에게 개인정보를 넘기지 않습니다.
					</Text>
				</View>

				<View className="mt-6 mb-2">
					<Text className="text-lg font-bold text-text-primary mb-3">
						언제까지 보관하나요?
					</Text>
					<Text className="text-base leading-6 text-text-secondary mb-2">
						계속 서비스를 이용하는 동안만 보관하고, 탈퇴하거나 삭제를 요청하면
						바로 지워집니다.
					</Text>
				</View>

				<View className="mt-6 mb-2">
					<Text className="text-lg font-bold text-text-primary mb-3">
						내 정보를 삭제하고 싶다면?
					</Text>
					<Text className="text-base leading-6 text-text-secondary mb-2">
						언제든지 계정을 삭제할 수 있고, 그러면 모든 정보가 완전히
						사라집니다. 특별한 요청이나 문의사항이 있으면 언제든 연락해주세요.
					</Text>
				</View>

				<View className="mt-6 mb-2">
					<Text className="text-lg font-bold text-text-primary mb-3">
						정책이 바뀌면?
					</Text>
					<Text className="text-base leading-6 text-text-secondary mb-2">
						이 방침이 바뀌는 경우 서비스에서 미리 알려드립니다.
					</Text>
				</View>

				<View className="mt-6 mb-2" style={{ marginBottom: 40 }}>
					<Text className="text-sm text-text-muted italic">
						2025년 8월 30일부터 적용
					</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
