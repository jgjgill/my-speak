import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TermsPage() {
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
					서비스 이용약관
				</Text>
				<View className="w-11" />
			</View>

			<ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
				<View className="mt-6 mb-2">
					<Text className="text-lg font-bold text-text-primary mb-3">
						서비스 소개
					</Text>
					<Text className="text-base leading-6 text-text-secondary">
						My Speak은 외국어 스피킹 학습을 위한 개인 프로젝트입니다. 4단계
						체계적 학습을 통해 외국어 스피킹 실력 향상을 목표로 합니다.
					</Text>
				</View>

				<View className="mt-6 mb-2">
					<Text className="text-lg font-bold text-text-primary mb-3">
						이용 조건
					</Text>
					<Text className="text-base leading-6 text-text-secondary mb-2">
						• 본 서비스는 학습 목적으로만 이용해주세요
					</Text>
					<Text className="text-base leading-6 text-text-secondary mb-2">
						• Google 또는 Apple 계정을 통해 로그인할 수 있습니다
					</Text>
					<Text className="text-base leading-6 text-text-secondary mb-2">
						• 서비스는 무료로 제공됩니다
					</Text>
					<Text className="text-base leading-6 text-text-secondary mb-2">
						• 부적절한 사용은 제한될 수 있습니다
					</Text>
				</View>

				<View className="mt-6 mb-2">
					<Text className="text-lg font-bold text-text-primary mb-3">
						개인정보 보호
					</Text>
					<Text className="text-base leading-6 text-text-secondary">
						로그인 시 필요한 최소한의 정보(이메일, 프로필 사진)만 수집하며, 학습
						진도 관리를 위해 사용됩니다. 자세한 내용은 개인정보 처리방침을
						참고해주세요.
					</Text>
				</View>

				<View className="mt-6 mb-2">
					<Text className="text-lg font-bold text-text-primary mb-3">
						면책사항
					</Text>
					<Text className="text-base leading-6 text-text-secondary">
						본 서비스는 개인 프로젝트로, 서비스 중단이나 데이터 손실에 대한
						책임을 지지 않습니다. 학습 효과는 개인차가 있을 수 있습니다.
					</Text>
				</View>

				<View className="mt-6 mb-2">
					<Text className="text-lg font-bold text-text-primary mb-3">문의</Text>
					<Text className="text-base leading-6 text-text-secondary">
						서비스 관련 문의나 제안사항이 있으시면 언제든 연락해주세요.
					</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
