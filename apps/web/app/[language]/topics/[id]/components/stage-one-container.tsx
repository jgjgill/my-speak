"use client";

import { useAuth } from "../../../../contexts/auth-context";
import { useStageOnePublicData } from "../hooks/use-stage-one-public-data";
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
		<div className="border p-4 mb-6">
			<h2 className="text-xl font-bold mb-4">1단계: 한글 스크립트</h2>

			<div className="mb-6">
				<h3 className="font-bold mb-3">전체 한글 스크립트</h3>
				<div>
					{koreanScripts.map((script, index) => (
						<span key={script.id}>
							{script.korean_text}
							{index < koreanScripts.length - 1 && " "}
						</span>
					))}
				</div>
			</div>

			<div className="mb-4 p-3 border">
				<strong>미션:</strong> 아래 한글 문장들을 영어로 번역해보세요. 완벽하지
				않아도 괜찮습니다!
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
