import fs from "node:fs";
import type { ParsedContent } from "../types/content-types.js";

/**
 * 파일을 읽어서 문자열로 반환합니다.
 */
export function readFile(filePath: string): string {
	try {
		return fs.readFileSync(filePath, "utf-8");
	} catch (error) {
		throw new Error(`Failed to read file ${filePath}: ${error}`);
	}
}

/**
 * 파싱된 콘텐츠를 JSON 파일로 저장합니다.
 */
export function saveToJsonFile(data: ParsedContent, outputPath: string): void {
	try {
		const jsonContent = JSON.stringify(data, null, 2);
		fs.writeFileSync(outputPath, jsonContent, "utf-8");
		console.log(`✅ JSON saved to: ${outputPath}`);
	} catch (error) {
		throw new Error(`Failed to save JSON file ${outputPath}: ${error}`);
	}
}
