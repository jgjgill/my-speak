"use client";

import { useEffect } from "react";

interface ErrorPageProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
	useEffect(() => {
		console.error("Application error:", error);
	}, [error]);

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
								<title>에러 아이콘</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
								/>
							</svg>
						</div>
						<div>
							<h1 className="text-title font-bold text-text-primary mb-1">
								학습 진행 중 문제가 발생했어요
							</h1>
							<p className="text-text-secondary text-korean">
								일시적인 오류입니다. 다시 시도해 주세요.
							</p>
						</div>
					</div>

					<div className="space-y-3">
						<button
							type="button"
							onClick={reset}
							className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-3 transition-all duration-200"
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title>새로고침</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
								/>
							</svg>
							다시 시도하기
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
						<span>📚</span>
						다른 학습 콘텐츠 살펴보기
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

				{process.env.NODE_ENV === "development" && (
					<details className="mt-6 text-left">
						<summary className="cursor-pointer text-gray-500 text-sm mb-2">
							개발자 정보 (개발 모드)
						</summary>
						<div className="bg-gray-100 rounded-lg p-3 text-xs font-mono text-gray-700 overflow-auto max-h-32">
							<div className="mb-2">
								<strong>Error:</strong> {error.message}
							</div>
							{error.digest && (
								<div>
									<strong>Digest:</strong> {error.digest}
								</div>
							)}
						</div>
					</details>
				)}
			</div>
		</div>
	);
}
