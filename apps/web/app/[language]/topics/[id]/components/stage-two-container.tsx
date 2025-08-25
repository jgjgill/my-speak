"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useAuth } from "../../../../contexts/auth-context";
import { useStageTwoPublicData } from "../hooks/use-stage-two-public-data";
import { useUserTranslations } from "../hooks/use-user-translations";
import {
	createSelectedLearningPointsByOrder,
	getSelectedEnglishKeywords,
	getSelectedKoreanKeywords,
} from "../utils/learning-points";
import TextHighlighter from "./text-highlighter/text-highlighter";
import VoiceRecorder from "./voice-recorder";

const UserTranslationDisplay = dynamic(
	() => import("./user-translation-display"),
	{ ssr: false },
);

interface StageTwoContainerProps {
	topicId: string;
	onStageComplete: () => void;
}

export default function StageTwoContainer({
	topicId,
	onStageComplete,
}: StageTwoContainerProps) {
	const { user } = useAuth();
	const [hasRecorded, setHasRecorded] = useState(false);

	const [
		{ data: koreanScripts },
		{ data: englishScripts },
		{ data: learningPoints },
		{ data: userSelectedPoints },
	] = useStageTwoPublicData(topicId, user);
	const { data: userTranslations } = useUserTranslations(topicId, user);

	const selectedLearningPointsByOrder = createSelectedLearningPointsByOrder(
		userSelectedPoints,
		learningPoints,
	);

	return (
		<div className="border p-4 mb-6">
			<h2 className="text-xl font-bold mb-4">2단계: 영어 스크립트</h2>

			<div className="mb-6">
				<h3 className="font-bold mb-3">한글 ↔ 영어 비교</h3>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<h4 className="font-semibold mb-2">한글</h4>

						<div>
							{koreanScripts.map((script, index) => (
								<span key={script.id}>
									{script.korean_text}
									{index < koreanScripts.length - 1 && " "}
								</span>
							))}
						</div>
					</div>

					<div>
						<h4 className="font-semibold mb-2">영어</h4>

						<div>
							{englishScripts.map((script, index) => (
								<span key={script.id}>
									{script.english_text}
									{index < englishScripts.length - 1 && " "}
								</span>
							))}
						</div>
					</div>
				</div>
			</div>

			<div className="mb-6">
				<h3 className="font-bold mb-3">문장별 한영 비교</h3>

				<div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded">
					<h4 className="font-semibold mb-2">1단계에서 체크한 학습 포인트</h4>

					<div className="flex items-center gap-2 text-sm">
						<span className="bg-orange-200 px-2 py-1 rounded">강조 표현</span>
					</div>
				</div>

				{koreanScripts.map((script, index) => {
					const userTranslation = userTranslations.find(
						(t) => t.sentence_order === script.sentence_order,
					);
					const selectedKoreanKeywords = getSelectedKoreanKeywords(
						selectedLearningPointsByOrder,
						script.sentence_order,
					);
					const selectedEnglishKeywords = getSelectedEnglishKeywords(
						selectedLearningPointsByOrder,
						script.sentence_order,
					);

					return (
						<div key={script.id} className="mb-4 p-2 border">
							<span className="font-semibold">문장 {index + 1}</span>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
								<div>
									<span className="text-sm font-medium">한글</span>
									<div className="leading-relaxed">
										<TextHighlighter
											text={script.korean_text}
											keywords={selectedKoreanKeywords}
										/>
									</div>
								</div>

								<div>
									<span className="text-sm font-medium">번역</span>
									<div className="leading-relaxed">
										<TextHighlighter
											text={englishScripts[index]?.english_text || ""}
											keywords={selectedEnglishKeywords}
										/>
									</div>
								</div>

								{userTranslation && (
									<UserTranslationDisplay userTranslation={userTranslation} />
								)}
							</div>
						</div>
					);
				})}
			</div>

			<div className="mb-6">
				<h3 className="font-bold mb-3">끊어읽기 발음 연습</h3>
				<p className="text-sm mb-4">
					| 표시된 곳에서 잠깐 멈춤, || 표시된 곳에서 긴 호흡을 하며 읽어보세요.
				</p>

				{englishScripts.map((script, index) => (
					<div key={script.id} className="mb-3 p-2 border">
						<span className="text-sm">발음 연습 {index + 1}</span>
						<p>{script.chunked_text}</p>
					</div>
				))}

				<div className="mt-6 p-3 border">
					<h4 className="font-bold mb-3">전체 끊어읽기 스크립트</h4>

					<p className="text-sm mb-3">이제 전체를 한 번에 따라 읽어보세요.</p>

					<div className="mb-4">
						{englishScripts.map((script, index) => (
							<span key={script.id}>
								{script.chunked_text}
								{index < englishScripts.length - 1 && " || "}
							</span>
						))}
					</div>

					<VoiceRecorder
						onRecordingComplete={(recorded) => {
							if (recorded) {
								setHasRecorded(true);
							}
						}}
					/>

					{hasRecorded && (
						<div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
							<div className="flex items-center justify-between">
								<div>
									<h4 className="font-bold text-green-800 mb-1">
										🎉 2단계 완료!
									</h4>
									<p className="text-sm text-green-700">
										녹음을 완료했습니다. 3단계로 진행해보세요.
									</p>
								</div>
								{user ? (
									<button
										type="button"
										onClick={onStageComplete}
										className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
									>
										3단계로 이동하기
									</button>
								) : (
									<div className="text-sm text-gray-500">
										로그인하면 다음 단계로 진행할 수 있습니다.
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
