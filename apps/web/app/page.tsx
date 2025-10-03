import Image from "next/image";
import Link from "next/link";
import AppDownloadModal from "./components/app-download-modal";
import { isNativeWebView } from "./utils/platform";

export default async function Home() {
	const isNativeApp = await isNativeWebView();

	return (
		<div className="min-h-screen">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
				<div className="text-center">
					<div className="mb-8">
						<div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary flex items-center justify-center overflow-hidden">
							<Image
								src="/app-icon.png"
								alt="My Speak 로고"
								width={80}
								height={80}
								priority
							/>
						</div>
						<h1 className="text-hero font-bold text-korean text-primary mb-4">
							My Speak
						</h1>
						<p className="text-title text-gray-600 max-w-2xl mx-auto leading-relaxed">
							4단계 체계적 학습으로 외국어 스피킹을
							<br />
							자연스럽게 마스터하세요
						</p>
					</div>

					<div className="mb-12">
						<div
							className={`grid ${isNativeApp ? "grid-cols-1 max-w-2xl" : "md:grid-cols-2 max-w-4xl"} gap-6 mx-auto`}
						>
							<Link href="/en/topics" className="topic-card group">
								<div className="flex items-center mb-4">
									<div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg mr-4">
										EN
									</div>
									<div>
										<h3 className="text-heading font-semibold text-korean">
											영어 (English)
										</h3>
									</div>
								</div>
								<div className="flex items-center text-primary font-medium">
									<span>학습 시작하기</span>
									<svg
										className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<title>학습 시작 화살표</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</div>
							</Link>

							{!isNativeApp && (
								<div className="topic-card opacity-60 cursor-not-allowed">
									<div className="flex items-center mb-4">
										<div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-lg mr-4">
											JP
										</div>
										<div>
											<h3 className="text-heading font-semibold text-korean">
												일본어 (Japanese)
											</h3>
										</div>
									</div>

									<div className="flex items-center text-gray-400 font-medium">
										<span>곧 출시 예정</span>
										<svg
											className="w-4 h-4 ml-2"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<title>준비중 아이콘</title>
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{!isNativeApp && (
				<div className="py-12">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
						<h2 className="text-title font-bold text-korean mb-8">
							모바일 앱으로 더 편리하게
						</h2>

						<div className="grid md:grid-cols-2 gap-8 max-w-md mx-auto">
							<div className="text-center">
								<div className="inline-block p-4 bg-white rounded-xl shadow-sm">
									<Image
										src="/app-store-qr-code.png"
										alt="iOS 앱 다운로드 QR 코드"
										width={120}
										height={120}
										className="mx-auto"
									/>
								</div>
								<p className="text-sm text-gray-600 mt-3">iOS App Store</p>
							</div>

							<div className="text-center">
								<div className="inline-block p-4 bg-white rounded-xl shadow-sm">
									<Image
										src="/google-store-qr-code.png"
										alt="Android 앱 다운로드 QR 코드"
										width={120}
										height={120}
										className="mx-auto"
									/>
								</div>
								<p className="text-sm text-gray-600 mt-3">Google Play Store</p>
							</div>
						</div>
					</div>
				</div>
			)}

			<div className="bg-white py-16">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2 className="text-title font-bold text-korean mb-4">
							어떻게 학습하나요?
						</h2>
						<p className="text-body text-gray-600 max-w-2xl mx-auto">
							My Speak의 4단계 학습 시스템으로 체계적으로 언어 실력을
							향상시키세요
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
						<div className="text-center p-6 rounded-xl border border-blue-100 bg-blue-50">
							<div className="w-12 h-12 mx-auto mb-4 rounded-full bg-stage-1 flex items-center justify-center text-white font-bold">
								1
							</div>
							<h3 className="text-heading font-semibold text-korean mb-2">
								한글 번역
							</h3>
							<p className="text-body text-gray-600">
								주어진 한국어 문장을 목표 언어로 번역해보며 기본기를 다집니다
							</p>
						</div>

						<div className="text-center p-6 rounded-xl border border-green-100 bg-green-50">
							<div className="w-12 h-12 mx-auto mb-4 rounded-full bg-stage-2 flex items-center justify-center text-white font-bold">
								2
							</div>
							<h3 className="text-heading font-semibold text-korean mb-2">
								문장 완성
							</h3>
							<p className="text-body text-gray-600">
								부분적으로 제시된 문장을 완성하며 문법과 어휘를 학습합니다
							</p>
						</div>

						<div className="text-center p-6 rounded-xl border border-pink-200 bg-pink-50">
							<div className="w-12 h-12 mx-auto mb-4 rounded-full bg-stage-3 flex items-center justify-center text-white font-bold">
								3
							</div>
							<h3 className="text-heading font-semibold text-korean mb-2">
								스피킹 연습
							</h3>
							<p className="text-body text-gray-600">
								실제로 소리내어 말하며 발음과 억양을 정확히 익힙니다
							</p>
						</div>

						<div className="text-center p-6 rounded-xl border border-purple-100 bg-purple-50">
							<div className="w-12 h-12 mx-auto mb-4 rounded-full bg-stage-4 flex items-center justify-center text-white font-bold">
								4
							</div>
							<h3 className="text-heading font-semibold text-korean mb-2">
								키워드 토킹
							</h3>
							<p className="text-body text-gray-600">
								키워드를 활용한 자유로운 표현으로 실력을 완성합니다
							</p>
						</div>
					</div>
				</div>
			</div>
			<AppDownloadModal />
		</div>
	);
}
