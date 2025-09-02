"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../contexts/auth-context";

export default function LoginPage() {
	const { user, signInWithGoogle, signInWithApple } = useAuth();
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
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			{/* 메인 컨테이너 - 메인 페이지와 동일한 레이아웃 */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
				<div className="max-w-md mx-auto">
					{/* 로고 및 타이틀 - 메인 페이지와 일관된 스타일 */}
					<div className="text-center mb-12">
						<div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary flex items-center justify-center overflow-hidden">
							<Image
								src="/app-icon.png"
								alt="My Speak 로고"
								width={80}
								height={80}
								className="w-full h-full object-cover"
							/>
						</div>

						<h1 className="text-hero font-bold text-korean text-primary mb-4">
							My Speak
						</h1>
						<p className="text-gray-600 mb-2">
							4단계 체계적 학습으로 외국어 스피킹을 자연스럽게 마스터하세요
						</p>
						<p className="text-sm text-gray-500">
							계정으로 로그인하여 학습을 시작하세요
						</p>
					</div>

					{/* 로그인 카드 - topic-card와 유사한 스타일 */}
					<div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
						<div className="space-y-4">
							<button
								type="button"
								onClick={signInWithGoogle}
								className="w-full min-h-[44px] bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-4 rounded-lg border border-gray-300 hover:border-gray-400 flex items-center justify-center gap-3 transition-all duration-200"
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
								onClick={signInWithApple}
								className="w-full min-h-[44px] bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-4 rounded-lg border border-gray-300 hover:border-gray-400 flex items-center justify-center gap-3 transition-all duration-200"
							>
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Apple 로그인</title>
									<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
								</svg>
								Apple로 계속하기
							</button>
						</div>

						{/* 개인정보 처리방침 */}
						<div className="mt-6 pt-4 border-t border-gray-200">
							<p className="text-xs text-gray-500 text-center leading-relaxed">
								로그인 시{" "}
								<Link
									href="/terms"
									className="text-primary hover:text-primary-dark underline"
								>
									서비스 약관
								</Link>{" "}
								및{" "}
								<Link
									href="/privacy"
									className="text-primary hover:text-primary-dark underline"
								>
									개인정보 처리방침
								</Link>
								에 동의하게 됩니다.
							</p>
						</div>
					</div>

					{/* 홈으로 돌아가기 링크 */}
					<div className="text-center mt-6">
						<Link
							href="/"
							className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
						>
							← 홈으로 돌아가기
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
