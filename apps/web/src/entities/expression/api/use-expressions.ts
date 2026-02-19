"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { expressionKeys } from "@/shared/api/query-keys";
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
		queryKey: expressionKeys.list(languageCode),
		queryFn: () => getExpressions(supabase, languageCode),
	});
}

/**
 * 특정 Expression의 상세 정보를 조회하는 TanStack Query 훅
 */
export function useExpressionBySlug(slug: string, languageCode: string) {
	const supabase = createBrowserClient();

	return useSuspenseQuery<ExpressionComplete>({
		queryKey: expressionKeys.detail(slug, languageCode),
		queryFn: () => getExpressionBySlug(supabase, slug, languageCode),
	});
}
