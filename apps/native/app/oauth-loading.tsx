import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/auth";

export default function OAuthLoading() {
	const { code, state } = useLocalSearchParams();
	const router = useRouter();
	const { user } = useAuth();
	const [status, setStatus] = useState<"processing" | "success" | "error">(
		"processing",
	);

	useEffect(() => {
		if (!code || !state) {
			console.error("OAuth 파라미터 누락:", { code, state });
			setStatus("error");
			setTimeout(() => router.replace("/login"), 2000);
			return;
		}

		console.log("📍 OAuth 로딩 화면 표시, expo-auth-session 트리거 대기 중...");
	}, [code, state, router]);

	// 사용자 상태 변경 감지 (토큰 교환 성공 시)
	useEffect(() => {
		if (user) {
			console.log("✅ OAuth 인증 성공 감지");
			setStatus("success");

			// 성공 메시지 표시 후 홈으로 이동 (전체 스택 초기화)
			setTimeout(() => {
				router.dismissAll();
				router.replace("/");
			}, 1500);
		}
	}, [user, router]);

	return (
		<SafeAreaView className="flex-1 bg-white">
			<View className="absolute inset-0 bg-white justify-center items-center px-6">
				<View className="mb-8">
					<Text className="text-3xl font-bold text-primary text-center">
						My Speak
					</Text>
				</View>

				<ActivityIndicator size="large" color="#1e9aff" className="my-6" />

				<View className="items-center mt-4">
					{status === "processing" && (
						<>
							<Text className="text-lg font-semibold text-gray-800 text-center mb-2">
								로그인 처리 중...
							</Text>
							<Text className="text-sm text-stage-1 text-center opacity-80">
								인증 정보를 확인하고 있습니다.
							</Text>
						</>
					)}

					{status === "success" && (
						<>
							<Text className="text-lg font-semibold text-green-600 text-center mb-2">
								로그인 성공!
							</Text>
							<Text className="text-sm text-stage-1 text-center opacity-80">
								잠시만 기다려주세요.
							</Text>
						</>
					)}

					{status === "error" && (
						<>
							<Text className="text-lg font-semibold text-red-600 text-center mb-2">
								로그인 실패
							</Text>
							<Text className="text-sm text-stage-1 text-center opacity-80">
								로그인 페이지로 돌아갑니다.
							</Text>
						</>
					)}
				</View>
			</View>
		</SafeAreaView>
	);
}
