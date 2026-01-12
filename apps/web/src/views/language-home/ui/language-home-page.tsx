import Link from "next/link";
import { type LanguageCode, languageInfo } from "@/shared/config/languages";

interface LanguageHomePageProps {
	params: Promise<{ language: string }>;
}

export default async function LanguageHomePage({
	params,
}: LanguageHomePageProps) {
	const { language } = await params;
	const currentLanguage = languageInfo[language as LanguageCode];

	return (
		<div className="min-h-screen">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
				<div className="text-center mb-12">
					<div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary flex items-center justify-center text-white font-bold text-3xl">
						{currentLanguage?.flag || language.toUpperCase()}
					</div>
					<h1 className="text-hero font-bold text-korean text-primary mb-4">
						{currentLanguage?.nativeName || language.toUpperCase()}{" "}
						{currentLanguage?.name || language}
					</h1>
					<p className="text-title text-gray-600">
						학습 방법을 선택하세요
					</p>
				</div>

				<div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
					{/* Topics 학습 */}
					<Link
						href={`/${language}/topics`}
						className="block p-8 rounded-xl border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all group"
					>
						<div className="flex items-center mb-4">
							<div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mr-4">
								<svg
									className="w-7 h-7 text-blue-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Topics 아이콘</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
									/>
								</svg>
							</div>
							<div>
								<h2 className="text-heading font-bold text-korean mb-1">
									Topics 학습
								</h2>
								<p className="text-caption text-gray-500">4단계 체계 학습</p>
							</div>
						</div>

						<p className="text-body text-gray-600 mb-4">
							실생활 주제별 대화를 통해 한글 번역부터 키워드 스피치까지
							체계적으로 학습하세요.
						</p>

						<div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
							<span className="px-2 py-1 bg-blue-50 text-blue-600 rounded">
								1단계: 한글 번역
							</span>
							<span className="px-2 py-1 bg-green-50 text-green-600 rounded">
								2단계: 문장 완성
							</span>
						</div>
						<div className="flex items-center gap-2 text-sm text-gray-500">
							<span className="px-2 py-1 bg-pink-50 text-pink-600 rounded">
								3단계: 스피킹
							</span>
							<span className="px-2 py-1 bg-purple-50 text-purple-600 rounded">
								4단계: 키워드
							</span>
						</div>

						<div className="mt-6 flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform">
							<span>학습 시작하기</span>
							<svg
								className="w-4 h-4 ml-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title>화살표</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</div>
					</Link>

					{/* Expressions 학습 */}
					<Link
						href={`/${language}/expressions`}
						className="block p-8 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:shadow-lg transition-all group"
					>
						<div className="flex items-center mb-4">
							<div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mr-4">
								<svg
									className="w-7 h-7 text-purple-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Expressions 아이콘</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
									/>
								</svg>
							</div>
							<div>
								<h2 className="text-heading font-bold text-korean mb-1">
									Expressions 학습
								</h2>
								<p className="text-caption text-gray-500">필수 표현 집중</p>
							</div>
						</div>

						<p className="text-body text-gray-600 mb-4">
							실전에서 자주 쓰이는 필수 표현을 빈칸 채우기로 연습하며 자연스럽게
							익히세요.
						</p>

						<div className="space-y-2 text-sm text-gray-600 mb-4">
							<div className="flex items-start gap-2">
								<svg
									className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<title>체크</title>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
								<span>실생활 맥락에서 표현 이해하기</span>
							</div>
							<div className="flex items-start gap-2">
								<svg
									className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<title>체크</title>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
								<span>빈칸 채우기로 실전 감각 익히기</span>
							</div>
							<div className="flex items-start gap-2">
								<svg
									className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<title>체크</title>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
								<span>활용 예시와 팁으로 완벽 마스터</span>
							</div>
						</div>

						<div className="mt-6 flex items-center text-purple-600 font-medium group-hover:translate-x-1 transition-transform">
							<span>학습 시작하기</span>
							<svg
								className="w-4 h-4 ml-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title>화살표</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</div>
					</Link>
				</div>

				{/* 학습 독려 메시지 */}
				<div className="mt-16 text-center max-w-2xl mx-auto">
					<div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-100">
						<p className="text-lg text-gray-700 mb-2">
							💪 <strong>꾸준한 학습이 실력 향상의 비결입니다</strong>
						</p>
						<p className="text-body text-gray-600">
							하루 10분씩 꾸준히 학습하면 3개월 후 눈에 띄는 변화를 경험하실 수
							있습니다. 오늘도 화이팅!
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
