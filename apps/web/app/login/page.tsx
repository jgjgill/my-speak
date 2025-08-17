"use client";

import Link from "next/link";
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
		<div className="min-h-screen bg-gradient-to-br from-blue-800 to-blue-900">
			{/* 웹 네이티브 브레드크럼 네비게이션 */}
			<div className="bg-white/10 backdrop-blur-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<nav className="flex py-3 text-sm">
						<ol className="flex items-center space-x-2 text-white/80">
							<li>
								<Link href="/" className="hover:text-white transition-colors">
									홈
								</Link>
							</li>
							<li className="flex items-center">
								<svg
									className="w-4 h-4 mx-2"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<title>브레드크럼 화살표</title>
									<path
										fillRule="evenodd"
										d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
										clipRule="evenodd"
									/>
								</svg>
								<span className="text-white font-medium">로그인</span>
							</li>
						</ol>
					</nav>
				</div>
			</div>

			{/* 데스크톱 중심 좌우 분할 레이아웃 */}
			<div className="flex-1 grid lg:grid-cols-2 gap-0 min-h-[calc(100vh-60px)]">
				{/* 왼쪽: 브랜딩 섹션 */}
				<div className="flex flex-col justify-center items-center px-8 py-16 lg:px-16">
					<div className="max-w-md w-full text-center">
						<div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-white/10 flex items-center justify-center mb-8 mx-auto">
							<svg
								className="w-12 h-12 lg:w-16 lg:h-16 text-white"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<title>My Speak 로고</title>
								<path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v1a7 7 0 0 1-14 0v-1a1 1 0 0 1 2 0v1a5 5 0 0 0 10 0v-1a1 1 0 0 1 2 0zM12 18.1a1 1 0 0 1-1-1v-1.1a1 1 0 0 1 2 0v1.1a1 1 0 0 1-1 1z" />
							</svg>
						</div>

						<h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
							My Speak
						</h1>
						<p className="text-lg lg:text-xl text-white/80 leading-relaxed mb-8">
							5단계 시스템으로 영어 스피킹을
							<br />
							체계적으로 학습해보세요
						</p>

						{/* 기능 하이라이트 */}
						<div className="space-y-4 text-left">
							<div className="flex items-start gap-4">
								<div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
									<svg
										className="w-4 h-4 text-white"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<title>체계적 학습 단계 아이콘</title>
										<path
											fillRule="evenodd"
											d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<div>
									<h3 className="text-white font-semibold mb-1">
										체계적 학습 단계
									</h3>
									<p className="text-white/70 text-sm">
										번역 → 문장완성 → 스피킹
									</p>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
									<svg
										className="w-4 h-4 text-white"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<title>실시간 발음 피드백 아이콘</title>
										<path
											fillRule="evenodd"
											d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12c0-2.21-.895-4.21-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 12a5.984 5.984 0 01-.757 2.828 1 1 0 01-1.415-1.414A3.984 3.984 0 0013 12a3.983 3.983 0 00-.172-1.414 1 1 0 010-1.415z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<div>
									<h3 className="text-white font-semibold mb-1">
										실시간 발음 피드백
									</h3>
									<p className="text-white/70 text-sm">
										즉석에서 발음을 교정하고 개선
									</p>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
									<svg
										className="w-4 h-4 text-white"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<title>개인별 진행 관리 아이콘</title>
										<path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
									</svg>
								</div>
								<div>
									<h3 className="text-white font-semibold mb-1">
										개인별 진행 관리
									</h3>
									<p className="text-white/70 text-sm">
										학습 기록 및 성취도 저장
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* 오른쪽: 로그인 폼 섹션 */}
				<div className="bg-white/5 backdrop-blur-sm flex flex-col justify-center px-8 py-16 lg:px-16">
					<div className="max-w-sm w-full mx-auto">
						<div className="text-center mb-8">
							<h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
								시작하기
							</h2>
							<p className="text-white/70">
								계정으로 로그인하여 학습을 시작하세요
							</p>
						</div>

						<div className="space-y-4">
							<button
								type="button"
								onClick={signInWithGoogle}
								className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
							>
								<svg className="w-5 h-5" viewBox="0 0 24 24">
									<title>Google 로그인</title>
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
								Google로 계속하기
							</button>

							<button
								type="button"
								disabled
								className="w-full bg-white/10 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 opacity-50 cursor-not-allowed"
							>
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Apple 로그인 (준비중)</title>
									<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
								</svg>
								Apple로 계속하기 (준비중)
							</button>
						</div>

						<div className="mt-8 pt-6 border-t border-white/20">
							<p className="text-xs text-white/60 text-center leading-relaxed">
								계속 진행하면{" "}
								<Link href="/terms" className="underline hover:text-white/80">
									서비스 약관
								</Link>{" "}
								및{" "}
								<Link href="/privacy" className="underline hover:text-white/80">
									개인정보 처리방침
								</Link>
								에 동의하는 것으로 간주됩니다.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
