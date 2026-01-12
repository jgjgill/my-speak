"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { createBrowserClient } from "@/shared/api/supabase";
import {
	type ExpressionComplete,
	type ExpressionWithBlanks,
	getExpressionBySlug,
	getExpressions,
} from "./expression-queries";

/**
 * Expression 목록을 조회하는 TanStack Query 훅
 */
export function useExpressions(languageCode = "en") {
	const supabase = createBrowserClient();

	return useSuspenseQuery<ExpressionWithBlanks[]>({
		queryKey: ["expressions", languageCode],
		queryFn: () => getExpressions(supabase, languageCode),
	});
}

/**
 * 특정 Expression의 상세 정보를 조회하는 TanStack Query 훅
 */
export function useExpressionBySlug(slug: string, languageCode: string) {
	const supabase = createBrowserClient();

	return useSuspenseQuery<ExpressionComplete | null>({
		queryKey: ["expression", slug, languageCode],
		queryFn: () => getExpressionBySlug(supabase, slug, languageCode),
	});
}
