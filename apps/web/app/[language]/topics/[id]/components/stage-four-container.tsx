"use client";

import { useStageFourData } from "../hooks/use-stage-four-data";
import type { KeywordSpeech } from "../queries/stage-four-queries";

interface StageFourContainerProps {
	topicId: string;
}

const levelMetadata = {
	1: {
		title: "Level 1: 70% 정보 제공",
		color: "border-green-300 bg-green-50",
		description: "상세한 키워드로 문장 구성 연습",
	},
	2: {
		title: "Level 2: 50% 정보 제공",
		color: "border-green-400 bg-green-100",
		description: "핵심 키워드로 문장 만들기",
	},
	3: {
		title: "Level 3: 30% 정보 제공",
		color: "border-green-500 bg-green-200",
		description: "최소 키워드로 완전한 문장 구성",
	},
	4: {
		title: "Level 4: 외국어 키워드",
		color: "border-green-600 bg-green-300",
		description: "외국어 키워드만으로 자유로운 표현",
	},
};

export default function StageFourContainer({
	topicId,
}: StageFourContainerProps) {
	const { data: keywordSpeeches } = useStageFourData(topicId);

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
		<div className="border p-4">
			<h2 className="text-xl font-bold mb-4">4단계: 키워드 스피치</h2>
			<p className="mb-4">키워드를 보고 완전한 문장을 만들어보세요.</p>

			<div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
				<h3 className="font-semibold mb-2">🎯 학습 진행 방식</h3>
				<div className="text-sm space-y-1">
					<p>
						• <strong>Level 1</strong>부터 순차적으로 진행하세요.
					</p>
					<p>• 레벨이 올라갈수록 키워드가 줄어들어요.</p>
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
								<summary className="cursor-pointer p-4 hover:bg-opacity-75 transition-colors">
									<div className="flex items-center justify-between">
										<div>
											<h3 className="text-lg font-bold">{metadata.title}</h3>
											<p className="text-sm text-gray-600 mt-1">
												{metadata.description}
											</p>
										</div>

										<div className="flex items-center gap-2">
											<span className="text-sm bg-white px-2 py-1 rounded border">
												{levelSpeeches.length}개 문항
											</span>
											<span className="group-open:rotate-180 transition-transform duration-200">
												▼
											</span>
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
													<span className="font-semibold text-sm bg-gray-100 px-2 py-1 rounded">
														{index + 1}번
													</span>

													<span className="text-sm text-gray-500">
														난이도:{" "}
														{speech.difficulty_percentage
															? `${speech.difficulty_percentage}%`
															: "외국어 키워드"}
													</span>
												</div>

												<div className="flex flex-wrap gap-1">
													<span className="text-sm font-medium mr-2">
														키워드:
													</span>

													{speech.keywords.map((keyword) => (
														<span
															key={keyword}
															className="px-2 py-1 bg-yellow-200 text-sm rounded"
														>
															{keyword}
														</span>
													))}
												</div>
											</div>

											<details>
												<summary className="cursor-pointer text-blue-600 text-sm hover:text-blue-800">
													💡 목표 문장 보기
												</summary>

												<div className="mt-3 p-3 bg-gray-50 rounded border-l-4 border-blue-400">
													<p className="text-sm font-medium">
														{speech.target_sentence}
													</p>
												</div>
											</details>
										</div>
									))}

									<div className="mt-4 p-3 bg-white border-2 border-dashed border-gray-300 rounded text-center">
										<p className="text-sm text-gray-600">
											✅ {metadata.title} 완료 후 다음 레벨로 진행하세요
										</p>
									</div>
								</div>
							</details>
						</div>
					);
				})}
			</div>

			<div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded">
				<h3 className="font-bold text-green-800 mb-2">🏆 모든 레벨 완료</h3>
				<p className="text-sm text-green-700">Cool!</p>
			</div>
		</div>
	);
}
