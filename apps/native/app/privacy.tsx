import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyPage() {
	const handleBackPress = () => {
		router.back();
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
					<Ionicons name="chevron-back" size={24} color="#1E40AF" />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>개인정보 처리방침</Text>
				<View style={styles.placeholder} />
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>어떤 정보를 수집하나요?</Text>
					<Text style={styles.sectionText}>
						Google이나 Apple로 로그인할 때:
					</Text>
					<Text style={styles.bulletPoint}>• 이메일 주소</Text>
					<Text style={styles.bulletPoint}>• 프로필 사진</Text>
					<Text style={styles.bulletPoint}>• 이름</Text>
					<Text style={styles.sectionText}>학습하면서 생기는 정보:</Text>
					<Text style={styles.bulletPoint}>• 어떤 주제를 학습했는지</Text>
					<Text style={styles.bulletPoint}>• 진도 기록</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>왜 수집하나요?</Text>
					<Text style={styles.bulletPoint}>
						• 로그인해서 내 학습 기록을 볼 수 있도록
					</Text>
					<Text style={styles.bulletPoint}>
						• 어디까지 공부했는지 기억할 수 있도록
					</Text>
					<Text style={styles.bulletPoint}>
						• 더 나은 학습 경험을 제공하기 위해
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>정보를 어떻게 보호하나요?</Text>
					<Text style={styles.sectionText}>
						안전한 암호화 방식을 사용하고, 필요한 최소한의 정보만 수집합니다.
						다른 사람에게 개인정보를 넘기지 않습니다.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>언제까지 보관하나요?</Text>
					<Text style={styles.sectionText}>
						계속 서비스를 이용하는 동안만 보관하고, 탈퇴하거나 삭제를 요청하면
						바로 지워집니다.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>내 정보를 삭제하고 싶다면?</Text>
					<Text style={styles.sectionText}>
						언제든지 계정을 삭제할 수 있고, 그러면 모든 정보가 완전히
						사라집니다. 특별한 요청이나 문의사항이 있으면 언제든 연락해주세요.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>정책이 바뀌면?</Text>
					<Text style={styles.sectionText}>
						이 방침이 바뀌는 경우 서비스에서 미리 알려드립니다.
					</Text>
				</View>

				<View style={[styles.section, { marginBottom: 40 }]}>
					<Text style={styles.effectiveDate}>2025년 8월 30일부터 적용</Text>
				</View>
			</ScrollView>
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
	},
	backButton: {
		width: 44,
		height: 44,
		justifyContent: "center",
		alignItems: "center",
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#111827",
	},
	placeholder: {
		width: 44,
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
	},
	section: {
		marginTop: 24,
		marginBottom: 8,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#111827",
		marginBottom: 12,
	},
	sectionText: {
		fontSize: 16,
		lineHeight: 24,
		color: "#374151",
		marginBottom: 8,
	},
	bulletPoint: {
		fontSize: 16,
		lineHeight: 24,
		color: "#374151",
		marginBottom: 6,
	},
	effectiveDate: {
		fontSize: 14,
		color: "#6B7280",
		fontStyle: "italic",
	},
});
