/**
 * UUID 형식이 유효한지 검증합니다.
 */
export function isValidUUID(uuid: string): boolean {
	const uuidRegex =
		/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
	return uuidRegex.test(uuid);
}

/**
 * UUID를 검증하고 유효하지 않으면 경고를 출력합니다.
 */
export function validateAndWarnUUID(
	uuid: string | undefined,
	context: string = "UUID",
): string | undefined {
	if (!uuid || typeof uuid !== "string") {
		return undefined;
	}

	if (isValidUUID(uuid)) {
		return uuid;
	}

	console.warn(`⚠️  Invalid UUID format in ${context}: ${uuid}`);
	return undefined;
}
