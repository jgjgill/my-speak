"use client";

interface UserTranslationDisplayProps {
	userTranslation: {
		user_translation: string;
	};
}

export default function UserTranslationDisplay({
	userTranslation,
}: UserTranslationDisplayProps) {
	return (
		<details>
			<summary className="cursor-pointer text-sm font-light">내 번역</summary>
			<p className="bg-blue-50 text-sm p-2 font-light rounded">
				{userTranslation.user_translation}
			</p>
		</details>
	);
}
