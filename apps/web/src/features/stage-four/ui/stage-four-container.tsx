"use client";

import { useParams } from "next/navigation";
import type { KeywordSpeech } from "@/entities/topic";
import { useStageFourData } from "../model/use-stage-four-data";

const levelMetadata = {
	1: {
		title: "Level 1: 70% 정보 제공",
		color: "border-purple-200 bg-purple-50",
		description: "상세한 키워드로 문장 구성 연습",
	},
	2: {
		title: "Level 2: 50% 정보 제공",
		color: "border-purple-300 bg-purple-100",
		description: "핵심 키워드로 문장 만들기",
	},
	3: {
		title: "Level 3: 30% 정보 제공",
		color: "border-purple-400 bg-purple-200",
		description: "최소 키워드로 완전한 문장 구성",
	},
	4: {
		title: "Level 4: 외국어 키워드",
		color: "border-purple-500 bg-purple-300",
		description: "외국어 키워드만으로 자유로운 표현",
	},
};

export default function StageFourContainer() {
	const params = useParams<{ language: string; id: string }>();
	const topicId = params.id;
	const language = params.language;

	const { data: keywordSpeeches } = useStageFourData(topicId, language);

	const keywordSpeechesByLevel = keywordSpeeches.reduce(
		(acc, speech) => {
			const level = speech.level || 1;
			if (!acc[level]) {
				acc[level] = [];
			}
			acc[level]?.push(speech);
			return acc;
		},
		{} as Record<number, KeywordSpeech[]>,
	);

	return (
		<div className="topic-card">
			{/* 4단계 헤더 - 보라색 계열 */}
			<div className="flex items-center gap-3 mb-6">
				<div className="w-8 h-8 bg-myspeak-stage-4 text-white rounded-full flex items-center justify-center text-sm font-bold">
					4
				</div>
				<h2 className="text-title font-bold text-text-myspeak-primary">
					키워드 스피치
				</h2>
			</div>

			{/* 미션 안내 */}
			<div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
				<div className="flex items-start gap-3">
					<div className="w-6 h-6 bg-gray-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
						💬
					</div>
					<div>
						<h4 className="font-semibold text-text-myspeak-primary mb-1">
							키워드 스피치 미션
						</h4>
						<p className="text-myspeak-text-secondary text-sm">
							키워드를 보고 완전한 문장을 만들어보세요.
						</p>
					</div>
				</div>
			</div>

			<div className="bg-purple-50 border border-myspeak-stage-4 rounded-lg p-4 mb-6">
				<div className="flex items-start gap-3">
					<div className="w-6 h-6 bg-myspeak-stage-4 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
						🎯
					</div>
					<div>
						<h4 className="font-semibold text-text-myspeak-primary mb-1">
							학습 진행 방식
						</h4>
						<div className="text-sm space-y-1 text-myspeak-text-secondary">
							<p>
								• <strong>Level 1</strong>부터 순차적으로 진행하세요.
							</p>
							<p>• 레벨이 올라갈수록 키워드가 줄어들어요.</p>
						</div>
					</div>
				</div>
			</div>

			<div className="space-y-4">
				{[1, 2, 3, 4].map((level) => {
					const levelSpeeches = keywordSpeechesByLevel[level] || [];
					const metadata = levelMetadata[level as keyof typeof levelMetadata];

					if (levelSpeeches.length === 0) return null;

					return (
						<div key={level} className={`border rounded-lg ${metadata.color}`}>
							<details className="group" open={level === 1}>
								<summary className="cursor-pointer p-4 hover:bg-gray-50 transition-all duration-200 rounded-lg">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 bg-myspeak-stage-4 text-white rounded-full flex items-center justify-center text-sm font-bold">
												{level}
											</div>
											<div>
												<h3 className="text-lg font-bold text-text-myspeak-primary">
													{metadata.title}
												</h3>
												<p className="text-sm text-myspeak-text-secondary mt-1">
													{metadata.description}
												</p>
											</div>
										</div>

										<div className="flex items-center gap-3">
											<span className="text-sm bg-white px-3 py-1 rounded-full border text-myspeak-text-secondary">
												{levelSpeeches.length}개 문항
											</span>
											<div className="w-6 h-6 flex items-center justify-center">
												<svg
													className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform duration-200"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<title>펼치기/접기</title>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M19 9l-7 7-7-7"
													/>
												</svg>
											</div>
										</div>
									</div>
								</summary>

								<div className="px-4 pb-4 space-y-3">
									{levelSpeeches.map((speech, index) => (
										<div
											key={speech.id}
											className="bg-white p-3 border rounded"
										>
											<div className="mb-3">
												<div className="flex items-center gap-2 mb-2">
													<div className="w-6 h-6 bg-myspeak-stage-4 text-white rounded-full flex items-center justify-center text-xs font-bold">
														{index + 1}
													</div>

													<div className="flex flex-wrap gap-1">
														{speech.keywords.map((keyword) => (
															<span
																key={keyword}
																className="px-2 py-1 bg-purple-100 text-purple-700 border border-purple-200 text-sm rounded"
															>
																{keyword}
															</span>
														))}
													</div>
												</div>
											</div>

											<details>
												<summary className="cursor-pointer text-gray-600 text-sm hover:text-gray-800 hover:underline">
													💡 목표 문장 보기
												</summary>

												<div className="mt-3 p-3 bg-gray-50 rounded border-l-4 border-gray-400">
													<p className="text-sm font-medium text-myspeak-text-secondary">
														{speech.target_sentence}
													</p>
												</div>
											</details>
										</div>
									))}
								</div>
							</details>
						</div>
					);
				})}
			</div>

			<div className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6 text-center">
				<div className="flex items-center justify-center gap-2 mb-2">
					<div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full flex items-center justify-center">
						🏆
					</div>
					<h3 className="text-lg font-bold text-text-myspeak-primary">
						모든 레벨 완료!
					</h3>
				</div>
			</div>
		</div>
	);
}
