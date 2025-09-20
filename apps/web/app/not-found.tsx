"use client";

export default function NotFoundPage() {
	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
			<div className="max-w-lg w-full">
				<div className="topic-card mb-6">
					<div className="flex items-center gap-4 mb-6">
						<div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center border border-red-100">
							<svg
								className="w-8 h-8 text-red-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title>페이지를 찾을 수 없음</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 4h.01"
								/>
							</svg>
						</div>
						<div>
							<h1 className="text-title font-bold text-text-primary mb-1">
								페이지를 찾을 수 없어요
							</h1>
							<p className="text-text-secondary text-korean">
								요청하신 페이지가 존재하지 않습니다.
							</p>
						</div>
					</div>

					<div className="space-y-3">
						<button
							type="button"
							onClick={() => {
								window.history.back();
							}}
							className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-3 transition-all duration-200"
						>
							<svg
								className="w-5 h-5"
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
							이전 페이지로
						</button>

						<button
							type="button"
							onClick={() => {
								window.location.href = "/";
							}}
							className="w-full bg-white hover:bg-gray-50 text-text-primary py-3 px-4 rounded-xl font-medium border border-gray-200 flex items-center justify-center gap-3 transition-all duration-200"
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title>홈</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
								/>
							</svg>
							홈으로 돌아가기
						</button>
					</div>
				</div>

				<div className="topic-card">
					<h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
						<span>🚀</span>
						학습을 시작해보세요
					</h3>
					<div className="flex justify-center">
						<a
							href="/en/topics"
							className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 text-blue-700 border border-blue-200 hover:border-blue-300 w-full max-w-xs"
						>
							<div className="w-8 h-8 bg-stage-1 rounded-lg flex items-center justify-center text-white text-sm font-bold">
								EN
							</div>
							<div>
								<div className="font-medium text-sm text-korean">영어 학습</div>
								<div className="text-xs text-blue-600">English Topics</div>
							</div>
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
