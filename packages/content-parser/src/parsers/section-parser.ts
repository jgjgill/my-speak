import { filter, find, pipe, some } from "@fxts/core";
import type { ContentSection } from "../types/content-types";

/**
 * 마크다운 콘텐츠를 섹션별로 분리합니다.
 */
export function parseSections(content: string): ContentSection[] {
	const sections = content.split(/^# /m).filter(Boolean);
	return sections.map((section) => {
		const lines = section.trim().split("\n");
		const title = lines[0] ?? "";

		return {
			title,
			lines,
			content: section.trim(),
		};
	});
}

/**
 * 섹션 제목이 특정 패턴과 일치하는지 확인합니다.
 */
const matchesPattern = (patterns: string[]) => (section: ContentSection) =>
	pipe(
		patterns,
		some(
			(pattern) =>
				section.title.includes(pattern) ||
				section.title.toLowerCase().includes(pattern.toLowerCase()),
		),
	);

/**
 * 특정 패턴으로 섹션을 찾습니다.
 */
export const findSection =
	(patterns: string[]) => (sections: ContentSection[]) =>
		pipe(sections, find(matchesPattern(patterns)));

/**
 * 여러 패턴으로 섹션들을 찾습니다.
 */
export const findSections =
	(patterns: string[]) => (sections: ContentSection[]) =>
		pipe(sections, filter(matchesPattern(patterns)));
