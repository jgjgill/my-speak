"use client";

import { useAuth } from "../../../../contexts/auth-context";
import { useStageThreePublicData } from "../hooks/use-stage-three-public-data";
import {
	createSelectedLearningPointsByOrder,
	getSelectedKoreanKeywords,
} from "../utils/learning-points";
import TextHighlighter from "./text-highlighter/text-highlighter";

interface StageThreeContainerProps {
	topicId: string;
	onStageComplete: () => void;
}

export default function StageThreeContainer({
	topicId,
	onStageComplete,
}: StageThreeContainerProps) {
	const { user } = useAuth();

	const [
		{ data: koreanScripts },
		{ data: foreignScripts },
		{ data: learningPoints },
		{ data: userSelectedPoints },
	] = useStageThreePublicData(topicId, user);

	const selectedLearningPointsByOrder = createSelectedLearningPointsByOrder(
		userSelectedPoints,
		learningPoints,
	);

	return (
		<div className="border p-4 mb-6">
			<h2 className="text-xl font-bold mb-4">3단계: 스피킹 연습</h2>
			<p className="mb-4">한글을 보고 영어로 말해보세요.</p>

			<div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded">
				<h4 className="font-semibold mb-2">1단계에서 체크한 학습 포인트</h4>
				<div className="flex items-center gap-2 text-sm">
					<span className="bg-orange-200 px-2 py-1 rounded">강조 표현</span>
					<span>← 로그인 사용자만 표시됩니다</span>
				</div>
			</div>

			{koreanScripts.map((script, index) => {
				const selectedKoreanKeywords = getSelectedKoreanKeywords(
					selectedLearningPointsByOrder,
					script.sentence_order,
				);

				return (
					<div key={script.id} className="mb-3 p-2 border">
						<div className="mb-2">
							<strong className="mr-2">{index + 1}.</strong>
							<span className="text-lg leading-relaxed">
								<TextHighlighter
									text={script.korean_text}
									keywords={selectedKoreanKeywords}
								/>
							</span>
						</div>

						<details>
							<summary className="cursor-pointer text-blue-600">
								답안 보기
							</summary>
							<p className="mt-2 p-2 bg-gray-100">
								{foreignScripts[index]?.chunked_text}
							</p>
						</details>
					</div>
				);
			})}

			<div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
				<div className="flex items-center justify-between">
					<div>
						<h4 className="font-bold text-blue-800 mb-1">
							🎯 3단계 스피킹 연습 완료!
						</h4>
						<p className="text-sm text-blue-700">
							모든 문장을 연습해보셨나요? 이제 4단계로 진행해보세요.
						</p>
					</div>
					<button
						type="button"
						onClick={onStageComplete}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
					>
						4단계로 이동하기
					</button>
				</div>
			</div>
		</div>
	);
}
