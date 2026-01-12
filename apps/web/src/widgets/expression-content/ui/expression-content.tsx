"use client";

import Image from "next/image";
import { useState } from "react";
import { useExpressionBySlug } from "@/entities/expression/api/use-expressions";

interface ExpressionContentProps {
	slug: string;
}

export function ExpressionContent({ slug }: ExpressionContentProps) {
	const { data: expression } = useExpressionBySlug(slug);
	const [hiddenBlanks, setHiddenBlanks] = useState<Set<number>>(new Set());

	if (!expression) {
		return <div>Expression not found</div>;
	}

	const toggleBlank = (sequenceOrder: number) => {
		setHiddenBlanks((prev) => {
			const next = new Set(prev);
			if (next.has(sequenceOrder)) {
				next.delete(sequenceOrder);
			} else {
				next.add(sequenceOrder);
			}
			return next;
		});
	};

	// 빈칸 패턴을 찾아서 렌더링
	const renderScript = () => {
		let script = expression.english_script;
		const sortedBlanks = [...expression.blanks].sort(
			(a, b) => a.sequence_order - b.sequence_order,
		);

		// 각 빈칸을 버튼으로 교체
		for (const blank of sortedBlanks) {
			const pattern = `**${blank.blank_text}**{${blank.sequence_order}}`;
			const isHidden = hiddenBlanks.has(blank.sequence_order);

			const replacement = isHidden
				? `<button class="blank-hidden" data-order="${blank.sequence_order}">______</button>`
				: `<button class="blank-visible" data-order="${blank.sequence_order}">${blank.blank_text}</button>`;

			script = script.replace(pattern, replacement);
		}

		return script;
	};

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
				<h2 className="text-xl font-bold mb-3">English Script</h2>
				<button
					type="button"
					className="prose max-w-none"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: 빈칸 렌더링을 위해 필요
					dangerouslySetInnerHTML={{ __html: renderScript() }}
					onClick={(e) => {
						const target = e.target as HTMLElement;
						if (target.tagName === "BUTTON") {
							const order = Number(target.dataset.order);
							toggleBlank(order);
						}
					}}
				/>
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
											{detail.usage_examples.map((example, idx) => (
												<li key={idx}>{example}</li>
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

			<style>{`
				.blank-visible {
					background-color: #dbeafe;
					color: #1e40af;
					padding: 2px 8px;
					border-radius: 4px;
					border: 1px solid #3b82f6;
					cursor: pointer;
					font-weight: 600;
				}
				.blank-hidden {
					background-color: #f3f4f6;
					color: #6b7280;
					padding: 2px 8px;
					border-radius: 4px;
					border: 1px dashed #9ca3af;
					cursor: pointer;
				}
				.blank-visible:hover,
				.blank-hidden:hover {
					opacity: 0.8;
				}
			`}</style>
		</>
	);
}
