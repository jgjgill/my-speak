"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useExpressionBySlug } from "@/entities/expression/api/use-expressions";
import { parseScript } from "../lib/parse-script";
import { useBlankToggle } from "../lib/use-blank-toggle";
import { BlankButton } from "./blank-button";

interface ExpressionContentProps {
	slug: string;
}

export function ExpressionContent({ slug }: ExpressionContentProps) {
	const params = useParams<{ language: string }>();
	const language = params.language;

	const { data: expression } = useExpressionBySlug(slug, language);
	const allBlankOrders = expression.blanks.map((b) => b.sequence_order);
	const { hiddenBlanks, toggle, toggleAll } = useBlankToggle(allBlankOrders);

	const segments = parseScript(expression.english_script, expression.blanks);
	const isAllHidden =
		allBlankOrders.length > 0 &&
		allBlankOrders.every((order) => hiddenBlanks.has(order));

	return (
		<>
			{/* 썸네일 */}
			{expression.thumbnail_url && (
				<div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
					<Image src={expression.thumbnail_url} alt={expression.title} fill />
				</div>
			)}

			{/* 제목 */}
			<h1 className="text-2xl font-bold mb-4">{expression.title}</h1>

			{/* 하이라이트 문장 */}
			<div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
				<p className="text-lg">{expression.highlight_sentence}</p>
			</div>

			{/* 영어 스크립트 (빈칸 토글) */}
			<div className="mb-8">
				<div className="flex items-center gap-3 mb-3">
					<h2 className="text-xl font-bold">English Script</h2>
					<button
						type="button"
						onClick={toggleAll}
						className="text-sm px-3 py-1 rounded border cursor-pointer transition-colors hover:bg-gray-50"
					>
						{isAllHidden ? "Show All" : "Hide All"}
					</button>
				</div>
				<div className="prose max-w-none">
					{segments.map((segment) =>
						segment.type === "text" ? (
							<span key={segment.value}>{segment.value}</span>
						) : (
							<BlankButton
								key={`blank-${segment.blank.sequence_order}`}
								text={segment.blank.blank_text}
								hidden={hiddenBlanks.has(segment.blank.sequence_order)}
								onToggle={() => toggle(segment.blank.sequence_order)}
							/>
						),
					)}
				</div>
			</div>

			{/* 한글 번역 */}
			<div className="mb-8">
				<h2 className="text-xl font-bold mb-3">Korean Translation</h2>
				<p className="text-gray-700">{expression.korean_translation}</p>
			</div>

			{/* Expression Details */}
			<div>
				<h2 className="text-xl font-bold mb-4">Expression Details</h2>
				<div className="space-y-6">
					{expression.details.map((detail) => {
						const blank = expression.blanks.find(
							(b) => b.id === detail.blank_id,
						);
						if (!blank) return null;

						return (
							<div key={detail.id} className="border rounded-lg p-4">
								<h3 className="font-bold text-lg mb-2">
									{blank.blank_text} ({blank.sequence_order})
								</h3>
								<div className="space-y-2">
									<p>
										<strong>의미:</strong> {detail.meaning}
									</p>
									<div>
										<strong>활용 예시:</strong>
										<ul className="list-disc list-inside ml-2 mt-1">
											{detail.usage_examples.map((example) => (
												<li key={example}>{example}</li>
											))}
										</ul>
									</div>
									{detail.usage_tips && (
										<p>
											<strong>사용 팁:</strong> {detail.usage_tips}
										</p>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
}
