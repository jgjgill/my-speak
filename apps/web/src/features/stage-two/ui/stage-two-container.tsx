"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useState } from "react";
import { AudioRecorderManager } from "@/features/audio-recorder";
import { useUserTranslations } from "@/features/stage-one";
import { TTSManager } from "@/features/text-to-speech";
import {
	createSelectedLearningPointsByOrder,
	getSelectedForeignKeywords,
	getSelectedKoreanKeywords,
	useAuth,
	useIsMounted,
} from "@/shared/lib";
import { useStageTwoPublicData } from "../model/use-stage-two-public-data";
import TextHighlighter from "./text-highlighter/text-highlighter";

const UserTranslationDisplay = dynamic(
	() => import("./user-translation-display"),
	{ ssr: false },
);

interface StageTwoContainerProps {
	onStageComplete: () => void;
}

export default function StageTwoContainer({
	onStageComplete,
}: StageTwoContainerProps) {
	const params = useParams<{ language: string; id: string }>();
	const topicId = params.id;
	const language = params.language;

	const { user } = useAuth();
	const isMounted = useIsMounted();
	const [hasRecorded, setHasRecorded] = useState(false);

	const [
		{ data: koreanScripts },
		{ data: foreignScripts },
		{ data: learningPoints },
		{ data: userSelectedPoints },
	] = useStageTwoPublicData(topicId, language, user);
	const { data: userTranslations } = useUserTranslations(
		topicId,
		language,
		user,
	);

	const selectedLearningPointsByOrder = createSelectedLearningPointsByOrder(
		userSelectedPoints,
		learningPoints,
	);

	return (
		<div className="topic-card mb-6">
			{/* 2단계 헤더 - 초록색 계열 */}
			<div className="flex items-center gap-3 mb-6">
				<div className="w-8 h-8 bg-stage-2 text-white rounded-full flex items-center justify-center text-sm font-bold">
					2
				</div>
				<h2 className="text-title font-bold text-text-primary">
					영어 문장완성
				</h2>
			</div>

			<div className="mb-8">
				<h3 className="text-heading font-semibold text-text-primary mb-4 flex items-center gap-2">
					<div className="w-2 h-2 bg-stage-2 rounded-full"></div>
					한글 ↔ 영어 비교
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="bg-gray-50 rounded-lg p-4">
						<h4 className="font-semibold mb-3 text-text-primary flex items-center gap-2">
							🇰🇷 한글
						</h4>
						<div className="text-text-secondary text-korean leading-relaxed">
							{koreanScripts.map((script, index) => (
								<span key={script.id}>
									{script.korean_text}
									{index < koreanScripts.length - 1 && " "}
								</span>
							))}
						</div>
					</div>

					<div className="bg-green-50 rounded-lg p-4 border border-green-200">
						<h4 className="font-semibold mb-3 stage-2 flex items-center gap-2">
							🇺🇸 영어
						</h4>
						<div className="text-text-secondary leading-relaxed">
							{foreignScripts.map((script, index) => (
								<span key={script.id}>
									{script.foreign_text}
									{index < foreignScripts.length - 1 && " "}
								</span>
							))}
						</div>
					</div>
				</div>
			</div>

			<div className="mb-8">
				<h3 className="text-heading font-semibold text-text-primary mb-4 flex items-center gap-2">
					<div className="w-2 h-2 bg-stage-2 rounded-full"></div>
					문장별 한영 비교
				</h3>

				<div className="mb-6 bg-green-50 border border-stage-2 rounded-lg p-4">
					<div className="flex items-start gap-3">
						<div className="w-6 h-6 bg-stage-2 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
							💡
						</div>
						<div>
							<h4 className="font-semibold text-text-primary mb-1">
								1단계에서 체크한 학습 포인트
							</h4>
							<div className="flex items-center gap-2 text-sm">
								<span className="bg-green-200 px-3 py-1 rounded-full text-green-800 font-medium">
									강조 표현
								</span>
							</div>
						</div>
					</div>
				</div>

				{koreanScripts.map((script, index) => {
					const userTranslation = userTranslations.find(
						(t) => t.sentence_order === script.sentence_order,
					);
					const selectedKoreanKeywords = isMounted
						? getSelectedKoreanKeywords(
								selectedLearningPointsByOrder,
								script.sentence_order,
							)
						: [];
					const selectedForeignKeywords = isMounted
						? getSelectedForeignKeywords(
								selectedLearningPointsByOrder,
								script.sentence_order,
							)
						: [];

					return (
						<div key={script.id} className="topic-card mb-4">
							<div className="flex items-center gap-2 mb-3">
								<div className="w-6 h-6 bg-stage-2 text-white rounded-full flex items-center justify-center text-xs font-bold">
									{index + 1}
								</div>
								<span className="font-medium text-text-secondary">
									문장 {index + 1}
								</span>
							</div>

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
											text={foreignScripts[index]?.foreign_text || ""}
											keywords={selectedForeignKeywords}
										/>
									</div>
								</div>

								<UserTranslationDisplay
									user_translation={userTranslation?.user_translation}
								/>
							</div>
						</div>
					);
				})}
			</div>

			<div className="mb-8">
				<h3 className="text-heading font-semibold text-text-primary mb-4 flex items-center gap-2">
					<div className="w-2 h-2 bg-stage-2 rounded-full"></div>
					끊어읽기 발음 연습
				</h3>

				<div className="bg-green-50 border border-stage-2 rounded-lg p-4 mb-6">
					<div className="flex items-start gap-3">
						<div className="w-6 h-6 bg-stage-2 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
							📢
						</div>
						<div>
							<h4 className="font-semibold stage-2 mb-1">발음 가이드</h4>
							<p className="text-text-secondary text-sm">
								| 표시된 곳에서 잠깐 멈춤, || 표시된 곳에서 긴 호흡을 하며
								읽어보세요.
							</p>
						</div>
					</div>
				</div>

				{foreignScripts.map((script, index) => (
					<div key={script.id} className="topic-card mb-4">
						<div className="flex items-center justify-between mb-3">
							<div className="flex items-center gap-2">
								<div className="w-6 h-6 bg-stage-2 text-white rounded-full flex items-center justify-center text-xs font-bold">
									{index + 1}
								</div>
								<span className="text-sm font-medium text-text-secondary">
									발음 연습 {index + 1}
								</span>
							</div>
							<TTSManager
								text={script.chunked_text}
								language={language}
								id={`script-${index}`}
							/>
						</div>
						<p className="text-text-secondary leading-relaxed">
							{script.chunked_text}
						</p>
					</div>
				))}

				<div className="topic-card mt-6">
					<div className="flex items-center gap-3 mb-4">
						<div className="w-8 h-8 bg-stage-2 text-white rounded-full flex items-center justify-center text-sm font-bold">
							🎯
						</div>
						<h4 className="text-heading font-bold text-text-primary">
							전체 끊어읽기 스크립트
						</h4>
					</div>

					<div className="bg-green-50 border border-stage-2 rounded-lg p-4 mb-4">
						<p className="text-text-secondary text-sm">
							이제 전체를 한 번에 따라 읽어보세요.
						</p>
					</div>

					<div className="mb-4">
						{foreignScripts.map((script, index) => (
							<span key={script.id}>
								{script.chunked_text}
								{index < foreignScripts.length - 1 && " || "}
							</span>
						))}
					</div>

					<AudioRecorderManager
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
										className="px-4 py-2 cursor-pointer bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
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
