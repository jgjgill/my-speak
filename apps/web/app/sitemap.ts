import type { MetadataRoute } from "next";
import {
	getSupportedLanguages,
	getTopicsForSitemap,
} from "@/shared/lib/sitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = "https://my-speak.com";
	const supportedLanguages = getSupportedLanguages();
	const topics = await getTopicsForSitemap();

	const staticPages: MetadataRoute.Sitemap = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${baseUrl}/login`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.5,
		},
		{
			url: `${baseUrl}/terms`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.3,
		},
		{
			url: `${baseUrl}/privacy`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.3,
		},
	];

	// 언어별 topics 페이지
	const languageTopicsPages: MetadataRoute.Sitemap = supportedLanguages.map(
		(language) => ({
			url: `${baseUrl}/${language}/topics`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.9,
		}),
	);

	// 개별 토픽 상세 페이지
	const topicDetailPages: MetadataRoute.Sitemap = [];

	for (const topic of topics) {
		for (const language of supportedLanguages) {
			topicDetailPages.push({
				url: `${baseUrl}/${language}/topics/${topic.id}`,
				lastModified: new Date(topic.created_at),
				changeFrequency: "daily",
				priority: 0.9,
			});
		}
	}

	return [...staticPages, ...languageTopicsPages, ...topicDetailPages];
}
