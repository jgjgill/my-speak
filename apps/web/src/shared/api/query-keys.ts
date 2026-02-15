/**
 * TanStack Query Key Factory
 *
 * 모든 쿼리 키를 중앙에서 관리하여 쿼리 정의와 invalidation 간의 불일치를 방지합니다.
 * 쿼리 키를 변경할 때 이 파일만 수정하면 됩니다.
 */

const toUserId = (userId: string | null): string => userId ?? "guest";

export const userKeys = {
	all: ["user"] as const,
} as const;

export const topicKeys = {
	detail: (topicId: string, language: string) =>
		["topic", topicId, language] as const,
	infinite: () => ["topics", "infinite"] as const,
} as const;

export const topicContentKeys = {
	koreanScripts: (topicId: string, language: string) =>
		["korean-scripts", topicId, language] as const,
	foreignScripts: (topicId: string, language: string) =>
		["foreign-scripts", topicId, language] as const,
	learningPoints: (topicId: string, language: string) =>
		["learning-points", topicId, language] as const,
	keywordSpeeches: (topicId: string, language: string) =>
		["keyword-speeches", topicId, language] as const,
} as const;

export const userDataKeys = {
	progress: (topicId: string, language: string, userId: string | null) =>
		["user-progress", topicId, language, toUserId(userId)] as const,
	translations: (topicId: string, language: string, userId: string | null) =>
		["user-translations", topicId, language, toUserId(userId)] as const,
	selectedPoints: (topicId: string, language: string, userId: string | null) =>
		["user-selected-points", topicId, language, toUserId(userId)] as const,
} as const;

export const expressionKeys = {
	list: (languageCode: string) => ["expressions", languageCode] as const,
	detail: (slug: string, languageCode: string) =>
		["expression", slug, languageCode] as const,
} as const;
