import fs from "node:fs";
import { config } from "dotenv";
import type {
	Database,
	TablesInsert,
} from "@repo/typescript-config/supabase-types";

import { createClient } from "@supabase/supabase-js";
import matter from "gray-matter";

// 환경 변수 로드
config({ path: '.env.local' });

// Supabase 클라이언트 생성
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Supabase 타입 활용
interface ParsedTopicData {
	topic: TablesInsert<"topics">;
	korean_scripts: Omit<TablesInsert<"korean_scripts">, "topic_id">[];
	english_scripts: Omit<TablesInsert<"english_scripts">, "topic_id">[];
	keyword_speeches: Omit<TablesInsert<"keyword_speeches">, "topic_id">[];
}

export async function parseTopicMarkdown(
	filePath: string,
): Promise<ParsedTopicData> {
	const fileContent = fs.readFileSync(filePath, "utf-8");
	const { data: frontmatter, content } = matter(fileContent);

	// 섹션별로 분리
	const sections = content.split(/^# /m).filter(Boolean);

	const korean_scripts: ParsedTopicData["korean_scripts"] = [];
	const english_scripts: ParsedTopicData["english_scripts"] = [];
	const keyword_speeches: ParsedTopicData["keyword_speeches"] = [];

	// 각 섹션 파싱
	for (const section of sections) {
		const lines = section.trim().split("\n");
		const sectionTitle = lines[0] ?? "";

		if (sectionTitle.includes("1단계: 한글 스크립트")) {
			// 한글 스크립트 파싱
			const sentences = lines
				.slice(2)
				.filter((line) => line.trim() && !line.startsWith("#"));
			sentences.forEach((sentence, index) => {
				if (sentence.trim()) {
					korean_scripts.push({
						sentence_order: index + 1,
						korean_text: sentence.trim(),
					});
				}
			});
		}

		if (sectionTitle.includes("2단계: 영어 스크립트")) {
			// 영어 스크립트 파싱 (끊어읽기 아닌 버전)
			const sentences = lines
				.slice(2)
				.filter((line) => line.trim() && !line.startsWith("#"));
			sentences.forEach((sentence, index) => {
				if (sentence.trim()) {
					english_scripts.push({
						sentence_order: index + 1,
						english_text: sentence.trim(),
						chunked_text: sentence.trim(), // 임시로 동일하게 설정
					});
				}
			});
		}

		if (sectionTitle.includes("끊어읽기 버전")) {
			// 끊어읽기 버전으로 업데이트
			const sentences = lines
				.slice(2)
				.filter((line) => line.trim() && !line.startsWith("#"));
			sentences.forEach((sentence, index) => {
				if (sentence.trim() && english_scripts[index]) {
					english_scripts[index].chunked_text = sentence.trim();
				}
			});
		}

		if (sectionTitle.includes("4단계: 키워드 스피치")) {
			// 키워드 스피치 파싱
			const keywordLines = lines.slice(2).filter((line) => line.includes("→"));
			keywordLines.forEach((line, index) => {
				const [keywordPart = "", targetSentence = ""] = line
					.split("→")
					.map((s) => s.trim());
				const keywords = keywordPart.split(",").map((k) => k.trim());

				keyword_speeches.push({
					stage: 4,
					level: 1,
					sequence_order: index + 1,
					keywords,
					target_sentence: targetSentence,
					difficulty_percentage: 70,
				});
			});
		}
	}

	return {
		topic: {
			title: frontmatter.title || "제목 없음",
			category: frontmatter.category || "기타",
			difficulty: frontmatter.difficulty || "초급",
			description: frontmatter.description,
			total_sentences: korean_scripts.length,
		},
		korean_scripts,
		english_scripts,
		keyword_speeches,
	};
}

export async function saveToJsonFile(
	data: ParsedTopicData,
	outputPath: string,
) {
	const jsonContent = JSON.stringify(data, null, 2);
	fs.writeFileSync(outputPath, jsonContent, "utf-8");
	console.log(`✅ JSON saved to: ${outputPath}`);
}

export async function uploadTopicToSupabase(data: ParsedTopicData) {
	try {
		// 1. Topic 삽입
		const { data: topicData, error: topicError } = await supabase
			.from("topics")
			.insert([data.topic])
			.select()
			.single();

		if (topicError) throw topicError;

		console.log("Topic inserted:", topicData);
		const topicId = topicData.id;

		// 2. Korean Scripts 삽입
		if (data.korean_scripts.length > 0) {
			const koreanScriptsWithTopicId = data.korean_scripts.map((script) => ({
				...script,
				topic_id: topicId,
			}));

			const { error: koreanError } = await supabase
				.from("korean_scripts")
				.insert(koreanScriptsWithTopicId);

			if (koreanError) throw koreanError;
			console.log("Korean scripts inserted:", data.korean_scripts.length);
		}

		// 3. English Scripts 삽입
		if (data.english_scripts.length > 0) {
			const englishScriptsWithTopicId = data.english_scripts.map((script) => ({
				...script,
				topic_id: topicId,
			}));

			const { error: englishError } = await supabase
				.from("english_scripts")
				.insert(englishScriptsWithTopicId);

			if (englishError) throw englishError;
			console.log("English scripts inserted:", data.english_scripts.length);
		}

		// 4. Keyword Speeches 삽입
		if (data.keyword_speeches.length > 0) {
			const keywordSpeechesWithTopicId = data.keyword_speeches.map(
				(speech) => ({
					...speech,
					topic_id: topicId,
				}),
			);

			const { error: keywordError } = await supabase
				.from("keyword_speeches")
				.insert(keywordSpeechesWithTopicId);

			if (keywordError) throw keywordError;
			console.log("Keyword speeches inserted:", data.keyword_speeches.length);
		}

		console.log("✅ All data uploaded successfully!");
		return topicData;
	} catch (error) {
		console.error("❌ Upload failed:", error);
		throw error;
	}
}

// 테스트 실행 함수
export async function runTopicTest() {
	try {
		const data = await parseTopicMarkdown(
			"../../content/source/greeting-basics.md",
		);
		await saveToJsonFile(data, "../../content/json/greeting-basics.json");
		console.log("Parsed data:", JSON.stringify(data, null, 2));

		const result = await uploadTopicToSupabase(data);
		console.log("Upload completed:", result);
	} catch (error) {
		console.error("Test failed:", error);
	}
}
