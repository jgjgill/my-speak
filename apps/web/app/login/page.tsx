"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../contexts/auth-context";

export default function LoginPage() {
	const { user, signInWithGoogle } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (user) {
			router.push("/");
		}
	}, [user, router]);

	if (user) {
		return null; // 이미 useEffect에서 리다이렉트 처리
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-800 to-blue-900 flex flex-col">
			<div className="absolute top-4 left-4 z-10">
				<button
					type="button"
					onClick={() => router.back()}
					className="w-11 h-11 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors"
				>
					<svg
						className="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<title>뒤로가기</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>
			</div>

			<div className="flex-1 flex flex-col px-8 py-16">
				{/* 로고 및 타이틀 섹션 */}
				<div className="flex-[2] flex flex-col justify-center items-center text-center">
					<div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center mb-6">
						<svg
							className="w-16 h-16 text-white"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<title>로고</title>
							<path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v1a7 7 0 0 1-14 0v-1a1 1 0 0 1 2 0v1a5 5 0 0 0 10 0v-1a1 1 0 0 1 2 0zM12 18.1a1 1 0 0 1-1-1v-1.1a1 1 0 0 1 2 0v1.1a1 1 0 0 1-1 1z" />
						</svg>
					</div>
					<h1 className="text-5xl font-bold text-white mb-2">My Speak</h1>
					<p className="text-xl text-white/80 leading-relaxed">
						영어 스피킹을 쉽고 재미있게 배워보세요
					</p>
				</div>

				{/* 설명 섹션 */}
				<div className="flex-1 flex flex-col justify-center space-y-4">
					<div className="flex items-center gap-3">
						<svg
							className="w-6 h-6 text-white flex-shrink-0"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<title>차트</title>
							<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
						</svg>
						<span className="text-lg text-white font-medium">
							5단계 학습 시스템
						</span>
					</div>
					<div className="flex items-center gap-3">
						<svg
							className="w-6 h-6 text-white flex-shrink-0"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<title>스피커</title>
							<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
						</svg>
						<span className="text-lg text-white font-medium">말하기 연습</span>
					</div>
					<div className="flex items-center gap-3">
						<svg
							className="w-6 h-6 text-white flex-shrink-0"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<title>보관함</title>
							<path d="M7 4V2C7 1.45 7.45 1 8 1S9 1.45 9 2V4H15V2C15 1.45 15.45 1 16 1S17 1.45 17 2V4H18C19.1 4 20 4.9 20 6V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V6C4 4.9 4.9 4 6 4H7ZM18 8H6V20H18V8ZM12 11L17 14L12 17V11Z" />
						</svg>
						<span className="text-lg text-white font-medium">
							개인 학습 데이터 보관
						</span>
					</div>
				</div>

				{/* 로그인 버튼 섹션 */}
				<div className="flex-1 flex flex-col justify-end space-y-4">
					<button
						type="button"
						onClick={signInWithGoogle}
						className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-lg"
					>
						<svg className="w-5 h-5" viewBox="0 0 24 24">
							<title>구글</title>
							<path
								fill="#4285F4"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="#34A853"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="#FBBC05"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							/>
							<path
								fill="#EA4335"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
						Google로 시작하기
					</button>

					<button
						type="button"
						disabled
						className="w-full bg-white/10 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 opacity-60 cursor-not-allowed"
					>
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<title>애플</title>
							<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
						</svg>
						Apple로 시작하기 (곧 출시)
					</button>

					<p className="text-sm text-white/70 text-center leading-relaxed mt-2">
						계속하면 서비스 약관 및 개인정보 처리방침에 동의하는 것으로
						간주됩니다.
					</p>
				</div>
			</div>
		</div>
	);
}
