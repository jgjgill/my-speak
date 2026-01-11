"use client";

import { useParams } from "next/navigation";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useAuth } from "@/shared/lib";
import { useUserTranslations } from "../model/use-user-translations";

interface TranslationInputFormProps {
	sentenceOrder: number;
	onTranslationSubmit: (sentenceOrder: number, translated: string) => void;
}

type Inputs = {
	translated: string;
};

export default function TranslationInputForm({
	sentenceOrder,
	onTranslationSubmit,
}: TranslationInputFormProps) {
	const params = useParams();
	const topicId = params.id as string;
	const language = params.language as string;
	const { user } = useAuth();
	const { data: userTranslations } = useUserTranslations(
		topicId,
		language,
		user,
	);

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
					placeholder="영어 번역을 입력하세요."
					className="form-textarea mt-1"
				/>
			</label>

			<div className="flex gap-2">
				<input
					type="submit"
					value="등록"
					disabled={!user || !isValid}
					className={`px-3 py-1 rounded transition-colors ${
						user && isValid
							? "bg-primary text-white hover:bg-primary-dark"
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
