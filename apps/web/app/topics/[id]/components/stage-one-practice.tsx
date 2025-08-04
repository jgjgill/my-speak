"use client";

import type { Tables } from "@repo/typescript-config/supabase-types";
import { useState } from "react";
import Highlighter from "react-highlight-words";
import { useAuth } from "../../../contexts/auth-context";
import { createClient } from "../../../utils/supabase/client";

type KoreanScript = Tables<"korean_scripts">;
type LearningPoint = Tables<"learning_points">;

interface UserProgressItem {
	translation?: string;
	isCompleted?: boolean;
	timestamp?: Date;
}

interface UserProgress {
	[sentenceOrder: number]: UserProgressItem;
}

interface StageOnePracticeProps {
	koreanScripts: KoreanScript[];
	learningPointsByOrder: Record<number, LearningPoint[]>;
	topicId: string;
	initialUserProgress: UserProgress;
	initialSelectedPoints: Set<string>;
}

export default function StageOnePractice({
	koreanScripts,
	learningPointsByOrder,
	topicId,
	initialUserProgress,
	initialSelectedPoints,
}: StageOnePracticeProps) {
	const [userProgress, setUserProgress] =
		useState<UserProgress>(initialUserProgress);
	const [selectedPoints, setSelectedPoints] = useState<Set<string>>(
		initialSelectedPoints,
	);
	const { user } = useAuth();
	const supabase = createClient();

	const getLearningPointKeywords = (sentenceOrder: number) => {
		const points = learningPointsByOrder[sentenceOrder] || [];
		return points
			.map((point) => point.korean_phrase)
			.filter((phrase) => phrase !== null && phrase !== undefined) as string[];
	};

	const getLearningPointInfo = (
		sentenceOrder: number,
		highlightedText: string,
	) => {
		const points = learningPointsByOrder[sentenceOrder] || [];
		return points.find((point) => point.korean_phrase === highlightedText);
	};

	const isSelectedLearningPoint = (sentenceOrder: number, text: string) => {
		const pointInfo = getLearningPointInfo(sentenceOrder, text);
		if (!pointInfo) return false;
		const pointKey = `${sentenceOrder}-${pointInfo.id}`;
		return selectedPoints.has(pointKey);
	};

	const handleTranslationChange = (
		sentenceOrder: number,
		translation: string,
	) => {
		setUserProgress((prev) => ({
			...prev,
			[sentenceOrder]: {
				...prev[sentenceOrder],
				translation,
			},
		}));
	};

	const handleTranslationToggle = async (sentenceOrder: number) => {
		const progress = userProgress[sentenceOrder];
		const newIsCompleted = !progress?.isCompleted;

		setUserProgress((prev) => ({
			...prev,
			[sentenceOrder]: {
				...prev[sentenceOrder],
				isCompleted: newIsCompleted,
				timestamp: new Date(),
			},
		}));

		if (user) {
			try {
				const { error } = await supabase.from("user_translations").upsert(
					{
						user_id: user.id,
						topic_id: topicId,
						sentence_order: sentenceOrder,
						korean_text:
							koreanScripts.find((s) => s.sentence_order === sentenceOrder)
								?.korean_text || "",
						user_translation: progress?.translation || "",
						is_completed: newIsCompleted,
					},
					{ onConflict: "user_id,topic_id,sentence_order" },
				);

				if (error) {
					console.error("번역 저장 실패:", error.message);
				}
			} catch (error) {
				console.error("번역 저장 중 오류:", error);
			}
		}
	};

	// 학습 포인트 클릭 처리
	const handleLearningPointClick = async (
		sentenceOrder: number,
		highlightedText: string,
	) => {
		const pointInfo = getLearningPointInfo(sentenceOrder, highlightedText);

		if (pointInfo) {
			alert(`💡 ${pointInfo.english_phrase}`);

			if (user) {
				const pointKey = `${sentenceOrder}-${pointInfo.id}`;
				const isSelected = selectedPoints.has(pointKey);

				setSelectedPoints((prev) => {
					const newSet = new Set(prev);

					isSelected ? newSet.delete(pointKey) : newSet.add(pointKey);

					return newSet;
				});

				try {
					if (isSelected) {
						const { error } = await supabase
							.from("user_selected_points")
							.delete()
							.eq("user_id", user.id)
							.eq("learning_point_id", pointInfo.id);

						if (error) {
							throw error;
						}
					} else {
						const { error } = await supabase
							.from("user_selected_points")
							.insert({
								user_id: user.id,
								topic_id: topicId,
								learning_point_id: pointInfo.id,
							});

						if (error) {
							throw error;
						}
					}
				} catch (error) {
					console.error("학습 포인트 처리 중 오류:", error);
				}
			}
		}
	};

	const completedCount = Object.values(userProgress).filter(
		(p) => p.isCompleted,
	).length;
	const progressPercentage = Math.round(
		(completedCount / koreanScripts.length) * 100,
	);

	return (
		<div className="mb-4">
			<div className="flex justify-between items-center mb-4">
				<h3 className="font-bold">문장별 번역 연습</h3>
				<div className="text-sm text-gray-600">
					진행률: {completedCount}/{koreanScripts.length} ({progressPercentage}
					%)
				</div>
			</div>

			<div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
				<h4 className="font-semibold mb-2">학습 포인트 안내</h4>
				<div className="flex flex-wrap gap-4 text-sm">
					<div className="flex items-center gap-2">
						<span className="bg-yellow-200 px-2 py-1 rounded">
							기본 학습 포인트
						</span>
						<span>← 클릭하면 영어 표현 확인</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="bg-orange-200 px-2 py-1 rounded">
							내가 선택한 포인트
						</span>
						<span>← 체크포인트로도 저장됨 (로그인 사용자만)</span>
					</div>
				</div>
			</div>

			{koreanScripts.map((script, index) => {
				const sentenceOrder = script.sentence_order;
				const progress = userProgress[sentenceOrder];
				const isCompleted = progress?.isCompleted || false;
				const isSelectedHighlight = getLearningPointKeywords(
					sentenceOrder,
				).some((keyword) => isSelectedLearningPoint(sentenceOrder, keyword));

				const highlightVariants = {
					default: "bg-yellow-200",
					selected: "bg-orange-200",
				};

				return (
					<div
						key={script.id}
						className={`mb-4 p-3 border rounded transition-colors ${
							isCompleted ? "bg-green-50 border-green-300" : "bg-white"
						}`}
					>
						<div className="mb-3">
							<div className="flex justify-between items-start mb-2">
								<span className="text-sm font-medium text-gray-600">
									문장 {index + 1}
									{isCompleted && (
										<span className="ml-2 text-green-600">✅</span>
									)}
								</span>
							</div>
							<div className="text-lg leading-relaxed">
								<Highlighter
									searchWords={getLearningPointKeywords(sentenceOrder)}
									textToHighlight={script.korean_text}
									highlightClassName={`${highlightVariants[isSelectedHighlight ? "selected" : "default"]} px-1 rounded cursor-pointer hover:bg-yellow-300 transition-colors`}
									highlightTag="mark"
									onClick={(e: React.MouseEvent<HTMLElement>) => {
										const target = e.target as HTMLElement;

										if (!target.textContent) {
											throw new Error("구문 강조 과정에서 에러 발생");
										}

										handleLearningPointClick(sentenceOrder, target.textContent);
									}}
								/>
							</div>
						</div>

						<div className="space-y-3">
							<label className="text-sm font-medium block">
								영어 번역을 입력하세요:
								<textarea
									className={`w-full p-3 border rounded resize-none mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
										isCompleted
											? "bg-gray-100 text-gray-600 cursor-not-allowed"
											: ""
									}`}
									rows={2}
									placeholder="여기에 영어 번역을 입력하세요..."
									value={progress?.translation || ""}
									disabled={isCompleted}
									onChange={(e) =>
										handleTranslationChange(sentenceOrder, e.target.value)
									}
								/>
							</label>

							<div className="flex gap-2">
								<button
									type="button"
									onClick={() => handleTranslationToggle(sentenceOrder)}
									className={`px-4 py-2 rounded transition-colors ${
										isCompleted
											? "bg-green-600 text-white hover:bg-green-700"
											: "bg-gray-200 text-gray-700 hover:bg-gray-300"
									}`}
								>
									{isCompleted ? "✅ 완료됨" : "등록"}
								</button>
								{!user && (
									<span className="text-xs text-gray-500 self-center">
										(로그인하면 번역 내용을 저장할 수 있습니다.)
									</span>
								)}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
