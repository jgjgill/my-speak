"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useAuth } from "../../../../contexts/auth-context";
import { getUserTranslations } from "../queries/stage-one-queries";

interface TranslationInputFormProps {
	sentenceOrder: number;
	topicId: string;
	onTranslationSubmit: (sentenceOrder: number, translated: string) => void;
}

type Inputs = {
	translated: string;
};

export default function TranslationInputForm({
	sentenceOrder,
	topicId,
	onTranslationSubmit,
}: TranslationInputFormProps) {
	const { user } = useAuth();
	const { data: userTranslations } = useSuspenseQuery({
		queryKey: ["user-translations", topicId, user ? user.id : "guest"],
		queryFn: user
			? () => getUserTranslations(topicId, user)
			: () => Promise.resolve([]),
	});

	const [isCompleted, setIsCompleted] = useState(false);

	const userTranslation = userTranslations.find(
		(t) => t.sentence_order === sentenceOrder,
	);

	const { register, handleSubmit } = useForm<Inputs>({
		defaultValues: {
			translated: userTranslation?.user_translation ?? "",
		},
	});

	const onSubmit: SubmitHandler<Inputs> = ({ translated }) => {
		if (isCompleted) {
			setIsCompleted(false);
			return;
		}

		onTranslationSubmit(sentenceOrder, translated);
		setIsCompleted(true);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
			<label className="text-sm font-medium block">
				영어 번역을 입력하세요:
				<textarea
					{...register("translated")}
					rows={2}
					placeholder="여기에 영어 번역을 입력하세요..."
					className="w-full mt-1 p-2 border rounded resize-none"
				/>
			</label>

			<div className="flex gap-2">
				<input
					type="submit"
					value="등록"
					className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
				/>

				{!user && (
					<span className="text-xs text-gray-500 self-center">
						(로그인하면 번역 내용을 저장할 수 있습니다.)
					</span>
				)}
			</div>
		</form>
	);
}
