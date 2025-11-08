"use client";

import { useAuth } from "@/shared/lib";
import { useStageOnePublicData } from "../model/use-stage-one-public-data";
import StageOnePractice from "./stage-one-practice";

interface StageOneContainerProps {
	topicId: string;
	onStageComplete: () => void;
}

export default function StageOneContainer({
	topicId,
	onStageComplete,
}: StageOneContainerProps) {
	const { user } = useAuth();
	const [
		{ data: koreanScripts },
		{ data: learningPoints },
		{ data: userSelectedPoints },
	] = useStageOnePublicData(topicId, user);

	const learningPointsByOrder = learningPoints.reduce(
		(acc, point) => {
			if (!acc[point.sentence_order]) {
				acc[point.sentence_order] = [];
			}

			acc[point.sentence_order]?.push(point);
			return acc;
		},
		{} as Record<number, typeof learningPoints>,
	);

	const initialSelectedPoints = new Set(
		userSelectedPoints
			.map((point) => {
				const learningPoint = learningPoints.find(
					(lp) => lp.id === point.learning_point_id,
				);
				return learningPoint
					? `${learningPoint.sentence_order}-${point.learning_point_id}`
					: "";
			})
			.filter(Boolean),
	);

	return (
		<div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm mb-6">
			{/* 1단계 헤더 */}
			<div className="flex items-center gap-3 mb-6">
				<div className="w-8 h-8 bg-stage-1 text-white rounded-full flex items-center justify-center text-sm font-bold">
					1
				</div>
				<h2 className="text-title font-bold text-text-primary">한글 번역</h2>
			</div>

			{/* 전체 스크립트 영역 */}
			<div className="mb-6">
				<h3 className="text-heading font-semibold text-text-primary mb-3 flex items-center gap-2">
					<div className="w-2 h-2 bg-stage-1 rounded-full"></div>
					전체 한글 스크립트
				</h3>
				<div className="bg-primary-light rounded-lg p-4 text-text-secondary text-korean">
					{koreanScripts.map((script, index) => (
						<span key={script.id}>
							{script.korean_text}
							{index < koreanScripts.length - 1 && " "}
						</span>
					))}
				</div>
			</div>

			{/* 미션 안내 */}
			<div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
				<div className="flex items-start gap-3">
					<div className="w-6 h-6 bg-gray-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
						!
					</div>
					<div>
						<h4 className="font-semibold text-text-primary mb-1">학습 미션</h4>
						<p className="text-text-secondary text-sm">
							아래 한글 문장들을 영어로 번역해보세요. 완벽하지 않아도
							괜찮습니다!
						</p>
					</div>
				</div>
			</div>

			<StageOnePractice
				koreanScripts={koreanScripts}
				learningPointsByOrder={learningPointsByOrder}
				topicId={topicId}
				initialSelectedPoints={initialSelectedPoints}
				onStageComplete={onStageComplete}
			/>
		</div>
	);
}
