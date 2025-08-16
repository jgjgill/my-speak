"use client";

import { type SubmitHandler, useForm } from "react-hook-form";
import { useAuth } from "../../../../contexts/auth-context";
import { useUserTranslations } from "../hooks/use-user-translations";

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
	const { data: userTranslations } = useUserTranslations(topicId, user);

	const userTranslation = userTranslations.find(
		(t) => t.sentence_order === sentenceOrder,
	);

	const {
		register,
		handleSubmit,
		formState: { isValid },
	} = useForm<Inputs>({
		mode: "onChange",
		defaultValues: {
			translated: userTranslation?.user_translation ?? "",
		},
	});

	const onSubmit: SubmitHandler<Inputs> = ({ translated }) => {
		onTranslationSubmit(sentenceOrder, translated);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
			<label className="text-sm font-medium block">
				영어 번역을 입력하세요:
				<textarea
					{...register("translated", { required: true })}
					rows={2}
					placeholder="여기에 영어 번역을 입력하세요..."
					className="w-full mt-1 p-2 border rounded resize-none"
				/>
			</label>

			<div className="flex gap-2">
				<input
					type="submit"
					value="등록"
					disabled={!user || !isValid}
					className={`px-3 py-1 rounded transition-colors ${
						user && isValid
							? "bg-blue-500 text-white hover:bg-blue-600"
							: "bg-gray-300 text-gray-500 cursor-not-allowed"
					}`}
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
