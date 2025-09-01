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

export default function TermsPage() {
	const handleBackPress = () => {
		router.back();
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
					<Ionicons name="chevron-back" size={24} color="#1E40AF" />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>서비스 이용약관</Text>
				<View style={styles.placeholder} />
			</View>

			<ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>서비스 소개</Text>
					<Text style={styles.sectionText}>
						My Speak은 영어 스피킹 학습을 위한 개인 프로젝트입니다. 4단계 체계적
						학습을 통해 외국어 스피킹 실력 향상을 목표로 합니다.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>이용 조건</Text>
					<Text style={styles.bulletPoint}>
						• 본 서비스는 학습 목적으로만 이용해주세요
					</Text>
					<Text style={styles.bulletPoint}>
						• Google 또는 Apple 계정을 통해 로그인할 수 있습니다
					</Text>
					<Text style={styles.bulletPoint}>• 서비스는 무료로 제공됩니다</Text>
					<Text style={styles.bulletPoint}>
						• 부적절한 사용은 제한될 수 있습니다
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>개인정보 보호</Text>
					<Text style={styles.sectionText}>
						로그인 시 필요한 최소한의 정보(이메일, 프로필 사진)만 수집하며, 학습
						진도 관리를 위해 사용됩니다. 자세한 내용은 개인정보 처리방침을
						참고해주세요.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>면책사항</Text>
					<Text style={styles.sectionText}>
						본 서비스는 개인 프로젝트로, 서비스 중단이나 데이터 손실에 대한
						책임을 지지 않습니다. 학습 효과는 개인차가 있을 수 있습니다.
					</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>문의</Text>
					<Text style={styles.sectionText}>
						서비스 관련 문의나 제안사항이 있으시면 언제든 연락해주세요.
					</Text>
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
	},
	bulletPoint: {
		fontSize: 16,
		lineHeight: 24,
		color: "#374151",
		marginBottom: 8,
	},
});
