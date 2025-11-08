"use client";

interface UserTranslationDisplayProps {
	user_translation?: string;
}

export default function UserTranslationDisplay({
	user_translation = "",
}: UserTranslationDisplayProps) {
	return (
		<details>
			<summary className="cursor-pointer text-sm font-light">내 번역</summary>
			<p className="bg-blue-50 text-sm p-2 font-light rounded">
				{user_translation}
			</p>
		</details>
	);
}
