import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "@/context/auth";
import { SignInWithAppleButton } from "./sign-in-with-apple-button";

export default function LoginForm() {
	const { signIn } = useAuth();

	return (
		<ScrollView className="flex-1 bg-primary">
			<StatusBar style="light" />

			<View className="flex-1 bg-primary">
				<View className="flex-1 px-8 pt-15 pb-10">
					<View className="flex-2 justify-center items-center mb-8">
						<View className="w-30 h-30 rounded-full justify-center items-center">
							<Image
								source={require("@/assets/icons/transparent-icon.png")}
								className="w-20 h-20"
								resizeMode="contain"
							/>
						</View>
						<Text className="text-4xl font-bold text-white mb-2">My Speak</Text>
						<Text className="text-base text-white/80 text-center leading-6">
							언어 스피킹을 쉽고 재미있게 배워보세요
						</Text>
					</View>

					<View className="flex-1 justify-center gap-5 mb-10">
						<View className="flex-row items-center gap-3">
							<Ionicons name="book" size={24} color="#FFFFFF" />
							<Text className="text-base text-white font-medium">
								4단계 학습 시스템
							</Text>
						</View>
						<View className="flex-row items-center gap-3">
							<Ionicons name="volume-high" size={24} color="#FFFFFF" />
							<Text className="text-base text-white font-medium">
								말하기 연습
							</Text>
						</View>
						<View className="flex-row items-center gap-3">
							<Ionicons name="trophy" size={24} color="#FFFFFF" />
							<Text className="text-base text-white font-medium">
								개인 학습 데이터 보관
							</Text>
						</View>
					</View>

					<View className="flex-1 justify-end gap-5 pt-5">
						<TouchableOpacity
							className="flex-row items-center justify-center bg-white rounded-xl h-12 gap-1 shadow-lg"
							onPress={signIn}
						>
							<Ionicons name="logo-google" size={16} />
							<Text className="text-text-primary text-base font-semibold leading-6">
								Google로 로그인
							</Text>
						</TouchableOpacity>

						<SignInWithAppleButton />

						<View className="flex-row flex-wrap justify-center items-center mt-2 px-2">
							<Text className="text-xs text-white/70 leading-4">
								로그인 시{" "}
							</Text>
							<TouchableOpacity onPress={() => router.push("/terms")}>
								<Text className="text-xs text-white leading-4 underline font-medium">
									서비스 약관
								</Text>
							</TouchableOpacity>
							<Text className="text-xs text-white/70 leading-4"> 및 </Text>
							<TouchableOpacity onPress={() => router.push("/privacy")}>
								<Text className="text-xs text-white leading-4 underline font-medium">
									개인정보 처리방침
								</Text>
							</TouchableOpacity>
							<Text className="text-xs text-white/70 leading-4">
								에 동의하게 됩니다.
							</Text>
						</View>
					</View>
				</View>
			</View>
		</ScrollView>
	);
}
