"use client";

import { useParams } from "next/navigation";
import { TextHighlighter } from "@/features/stage-two";
import {
	createSelectedLearningPointsByOrder,
	getSelectedKoreanKeywords,
	useAuth,
	useIsMounted,
} from "@/shared/lib";
import { useStageThreePublicData } from "../model/use-stage-three-public-data";

interface StageThreeContainerProps {
	onStageComplete: () => void;
}

export default function StageThreeContainer({
	onStageComplete,
}: StageThreeContainerProps) {
	const params = useParams<{ language: string; id: string }>();
	const topicId = params.id;
	const language = params.language;

	const { user } = useAuth();
	const isMounted = useIsMounted();

	const [
		{ data: koreanScripts },
		{ data: foreignScripts },
		{ data: learningPoints },
		{ data: userSelectedPoints },
	] = useStageThreePublicData(topicId, language, user);

	const selectedLearningPointsByOrder = createSelectedLearningPointsByOrder(
		userSelectedPoints,
		learningPoints,
	);

	return (
		<div className="topic-card mb-6">
			{/* 3단계 헤더 - 딥 핑크색 계열 */}
			<div className="flex items-center gap-3 mb-6">
				<div className="w-8 h-8 bg-myspeak-stage-3 text-white rounded-full flex items-center justify-center text-sm font-bold">
					3
				</div>
				<h2 className="text-title font-bold text-text-myspeak-primary">
					스피킹 연습
				</h2>
			</div>

			{/* 미션 안내 */}
			<div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
				<div className="flex items-start gap-3">
					<div className="w-6 h-6 bg-gray-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
						🎤
					</div>
					<div>
						<h4 className="font-semibold text-text-myspeak-primary mb-1">
							스피킹 미션
						</h4>
						<p className="text-myspeak-text-secondary text-sm">
							한글을 보고 영어로 말해보세요.
						</p>
					</div>
				</div>
			</div>

			{/* 학습 포인트 */}
			<div className="mb-6 bg-pink-50 border border-myspeak-stage-3 rounded-lg p-4">
				<div className="flex items-start gap-3">
					<div className="w-6 h-6 bg-myspeak-stage-3 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
						💡
					</div>
					<div>
						<h4 className="font-semibold text-text-myspeak-primary mb-1">
							1단계에서 체크한 학습 포인트
						</h4>
						<div className="flex items-center gap-2 text-sm">
							<span className="bg-pink-200 px-3 py-1 rounded-full text-pink-800 font-medium">
								강조 표현
							</span>
						</div>
					</div>
				</div>
			</div>

			{koreanScripts.map((script, index) => {
				const selectedKoreanKeywords = isMounted
					? getSelectedKoreanKeywords(
							selectedLearningPointsByOrder,
							script.sentence_order,
						)
					: [];

				return (
					<div key={script.id} className="topic-card mb-4">
						<div className="flex items-start gap-3 mb-3">
							<div className="w-6 h-6 bg-myspeak-stage-3 text-white rounded-full flex items-center justify-center text-xs font-bold mt-1">
								{index + 1}
							</div>
							<div className="flex-1">
								<span className="text-lg leading-relaxed text-korean">
									<TextHighlighter
										text={script.korean_text}
										keywords={selectedKoreanKeywords}
									/>
								</span>
							</div>
						</div>

						<details className="ml-9">
							<summary className="cursor-pointer text-gray-600 font-medium hover:text-gray-800 hover:underline">
								답안 보기
							</summary>
							<div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
								<p className="text-myspeak-text-secondary leading-relaxed">
									{foreignScripts[index]?.chunked_text}
								</p>
							</div>
						</details>
					</div>
				);
			})}

			<div className="mt-6 p-4 bg-pink-50 border border-myspeak-stage-3 rounded-lg">
				<div className="flex items-center justify-between">
					<div>
						<h4 className="font-bold text-pink-800 mb-1">
							🎯 3단계 스피킹 연습 완료!
						</h4>
						<p className="text-sm text-pink-700">
							모든 문장을 연습해보셨나요? 이제 4단계로 진행해보세요.
						</p>
					</div>
					<button
						type="button"
						onClick={onStageComplete}
						className="px-4 py-2 cursor-pointer bg-myspeak-stage-3 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors"
					>
						4단계로 이동하기
					</button>
				</div>
			</div>
		</div>
	);
}
