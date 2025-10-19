export const languageInfo = {
	en: { name: "영어", nativeName: "English", topicsText: "Topics", flag: "🇺🇸" },
	jp: {
		name: "일본어",
		nativeName: "日本語",
		topicsText: "トピック",
		flag: "🇯🇵",
	},
} as const;

export type LanguageCode = keyof typeof languageInfo;
