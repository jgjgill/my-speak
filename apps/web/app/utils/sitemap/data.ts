import { createClient } from "../supabase/server";

export interface TopicSitemapData {
	id: string;
	created_at: string;
}

/**
 * 지원하는 언어 정보 (topics page의 languageInfo와 동일)
 */
export const languageInfo = {
	en: { name: "영어", nativeName: "English", topicsText: "Topics", flag: "🇺🇸" },
	jp: {
		name: "일본어",
		nativeName: "日本語",
		topicsText: "トピック",
		flag: "🇯🇵",
	},
} as const;

export type SupportedLanguage = keyof typeof languageInfo;

/**
 * 사이트맵 생성을 위한 토픽 데이터 조회
 */
export async function getTopicsForSitemap(): Promise<TopicSitemapData[]> {
	try {
		const supabase = await createClient();

		const { data, error } = await supabase
			.from("topics")
			.select("id, created_at")
			.order("created_at", { ascending: false });

		if (error) {
			console.error("Error fetching topics for sitemap:", error);
			return [];
		}

		console.log("Topics fetched for sitemap:", data?.length || 0, "topics");
		return data || [];
	} catch (error) {
		console.error("Error in getTopicsForSitemap:", error);
		return [];
	}
}

/**
 * 지원하는 언어 코드 목록 반환
 */
export function getSupportedLanguages(): SupportedLanguage[] {
	return Object.keys(languageInfo) as SupportedLanguage[];
}
