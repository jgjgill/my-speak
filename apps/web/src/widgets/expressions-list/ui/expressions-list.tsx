"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useExpressions } from "@/entities/expression/api/use-expressions";

export function ExpressionsList() {
	const params = useParams<{ language: string }>();
	const language = params.language;

	const { data: expressions } = useExpressions(language);

	if (!expressions || expressions.length === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-gray-500">No expressions available yet.</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{expressions.map((expression, index) => (
				<Link
					key={expression.id}
					href={`/${language}/expressions/${expression.slug}`}
					className="block border rounded-lg p-4 hover:shadow-md transition-shadow"
				>
					{expression.thumbnail_url && (
						<div className="relative w-full h-40 mb-3 rounded overflow-hidden">
							<Image
								src={expression.thumbnail_url}
								alt={expression.title}
								fill
								priority={index === 0}
							/>
						</div>
					)}
					<h3 className="font-bold text-lg mb-2">{expression.title}</h3>
					<p className="text-sm text-gray-600 mb-2">
						{expression.highlight_sentence}
					</p>
					<div className="flex items-center gap-2 text-xs text-gray-500">
						<span>{expression.total_blanks} expressions</span>
					</div>
				</Link>
			))}
		</div>
	);
}
