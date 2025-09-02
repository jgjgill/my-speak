/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			colors: {
				// My Speak Brand Colors (웹앱과 동일)
				primary: {
					DEFAULT: "#1e9aff", // 앱 아이콘 메인 블루
					dark: "#0070f0", // 호버, 액티브 상태
					light: "#e6f2ff", // 배경, 하이라이트
				},
				// 텍스트 색상 계층
				text: {
					primary: "#1f2937", // 메인 텍스트
					secondary: "#6b7280", // 보조 텍스트
					muted: "#9ca3af", // 비활성 텍스트
				},
				// 5단계 학습 시스템 색상
				stage: {
					1: "#3b82f6", // 파랑 - 번역
					2: "#10b981", // 초록 - 문장완성
					3: "#ec4899", // 딥 핑크 - 스피킹
					4: "#8b5cf6", // 보라 - 자유발화
					completed: "#f59e0b", // 골드 - 완료
				},
			},
		},
	},
	plugins: [],
};
