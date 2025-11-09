import { createClient } from "@/shared/api/supabase/server";
import {
	languageInfo,
	type LanguageCode as SupportedLanguage,
} from "@/shared/config";

export interface TopicSitemapData {
	id: string;
	created_at: string;
}

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
