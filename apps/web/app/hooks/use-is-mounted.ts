import { useEffect, useState } from "react";

/**
 * 컴포넌트가 마운트되었는지 확인하는 훅
 * 하이드레이션 에러 방지를 위해 클라이언트에서만 렌더링이 필요한 경우 사용
 *
 * @returns 컴포넌트 마운트 여부
 *
 * @example
 * ```tsx
 * const isMounted = useIsMounted();
 *
 * // 클라이언트에서만 렌더링
 * const value = isMounted && someClientOnlyValue;
 * ```
 */
export function useIsMounted() {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return isMounted;
}
