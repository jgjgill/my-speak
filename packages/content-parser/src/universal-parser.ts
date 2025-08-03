import fs from "node:fs";
import type {
	Database,
	TablesInsert,
} from "@repo/typescript-config/supabase-types";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import matter from "gray-matter";

// 환경 변수 로드
config({ path: ".env.local" });

// Supabase 클라이언트 생성
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// 범용 파싱 인터페이스
interface ParsedContent {
	topic: TablesInsert<"topics">;
	korean_scripts: Omit<TablesInsert<"korean_scripts">, "topic_id">[];
	english_scripts: Omit<TablesInsert<"english_scripts">, "topic_id">[];
	keyword_speeches: Omit<TablesInsert<"keyword_speeches">, "topic_id">[];
	learning_points: Omit<TablesInsert<"learning_points">, "topic_id">[];
}

export async function parseMarkdownContent(
	filePath: string,
): Promise<ParsedContent> {
	const fileContent = fs.readFileSync(filePath, "utf-8");
	const { data: frontmatter, content } = matter(fileContent);

	// 섹션별로 분리 (더 유연한 방식)
	const sections = content.split(/^# /m).filter(Boolean);

	const korean_scripts: ParsedContent["korean_scripts"] = [];
	const english_scripts: ParsedContent["english_scripts"] = [];
	const keyword_speeches: ParsedContent["keyword_speeches"] = [];
	const learning_points: ParsedContent["learning_points"] = [];

	// 각 섹션을 분석하여 내용 추출
	for (const section of sections) {
		const lines = section.trim().split("\n");
		const sectionTitle = lines[0] ?? "";

		// 1단계: 한글 스크립트 파싱
		if (
			sectionTitle.includes("1단계") ||
			sectionTitle.toLowerCase().includes("korean")
		) {
			parseKoreanScripts(lines, korean_scripts, learning_points);
		}

		// 2단계: 영어 스크립트 파싱 (일반 버전)
		if (sectionTitle.includes("2단계") && !sectionTitle.includes("끊어읽기")) {
			parseEnglishScripts(lines, english_scripts);
		}

		// 끊어읽기 버전 파싱
		if (sectionTitle.includes("끊어읽기")) {
			parseChunkedText(lines, english_scripts);
		}

		// 4단계: 키워드 스피치 파싱
		if (sectionTitle.includes("4단계") || sectionTitle.includes("키워드")) {
			parseKeywordSpeeches(lines, keyword_speeches);
		}
	}

	return {
		topic: {
			id: frontmatter.topic_id || undefined,
			title: frontmatter.title || "제목 없음",
			category: frontmatter.category || "기타",
			difficulty: frontmatter.difficulty || "초급",
			description: frontmatter.description,
			total_sentences: korean_scripts.length,
		},
		korean_scripts,
		english_scripts,
		keyword_speeches,
		learning_points,
	};
}

// 한글 스크립트 파싱 함수
function parseKoreanScripts(
	lines: string[],
	korean_scripts: ParsedContent["korean_scripts"],
	learning_points: ParsedContent["learning_points"],
) {
	const sentences = lines
		.slice(1) // 제목 제외
		.filter((line) => line.trim() && !line.startsWith("#"))
		.filter((line) => !line.includes("연습용") && !line.includes("미션"));

	sentences.forEach((sentence, index) => {
		if (sentence.trim()) {
			const sentenceOrder = index + 1;

			// 학습 포인트 추출 (**phrase**{translation} 형태)
			const learningPointRegex = /\*\*(.*?)\*\*\{(.*?)\}/g;
			let match = learningPointRegex.exec(sentence);
			let cleanedSentence = sentence;

			while (match !== null) {
				const koreanPhrase = match[1];
				const englishPhrase = match[2];

				if (!koreanPhrase || !englishPhrase) {
					match = learningPointRegex.exec(sentence);
					continue;
				}

				// 학습 포인트 추가
				learning_points.push({
					sentence_order: sentenceOrder,
					korean_phrase: koreanPhrase,
					english_phrase: englishPhrase,
				});

				// 마크업 제거하여 깔끔한 텍스트로 변환
				cleanedSentence = cleanedSentence.replace(match[0], koreanPhrase);

				match = learningPointRegex.exec(sentence);
			}

			korean_scripts.push({
				sentence_order: sentenceOrder,
				korean_text: cleanedSentence.trim(),
			});
		}
	});
}

// 영어 스크립트 파싱 함수
function parseEnglishScripts(
	lines: string[],
	english_scripts: ParsedContent["english_scripts"],
) {
	const sentences = lines
		.slice(1)
		.filter(
			(line) => line.trim() && !line.startsWith("#") && !line.startsWith("**"),
		);

	sentences.forEach((sentence, index) => {
		if (sentence.trim()) {
			english_scripts.push({
				sentence_order: index + 1,
				english_text: sentence.trim(),
				chunked_text: sentence.trim(), // 기본값으로 동일하게 설정
			});
		}
	});
}

// 끊어읽기 텍스트 파싱 함수
function parseChunkedText(
	lines: string[],
	english_scripts: ParsedContent["english_scripts"],
) {
	const sentences = lines
		.slice(1)
		.filter(
			(line) => line.trim() && !line.startsWith("#") && !line.startsWith("**"),
		);

	sentences.forEach((sentence, index) => {
		if (sentence.trim() && english_scripts[index]) {
			english_scripts[index].chunked_text = sentence.trim();
		}
	});
}

// 키워드 스피치 파싱 함수
function parseKeywordSpeeches(
	lines: string[],
	keyword_speeches: ParsedContent["keyword_speeches"],
) {
	let currentLevel = 1;
	let currentDifficultyPercentage = 70;
	let sequenceOrder = 1;

	// 각 라인을 순차적으로 처리
	for (const line of lines.slice(1)) {
		const trimmedLine = line.trim();

		// 레벨 헤더 감지 및 업데이트
		if (trimmedLine.startsWith("## 레벨")) {
			if (trimmedLine.includes("레벨 1") || trimmedLine.includes("70%")) {
				currentLevel = 1;
				currentDifficultyPercentage = 70;
			} else if (
				trimmedLine.includes("레벨 2") ||
				trimmedLine.includes("50%")
			) {
				currentLevel = 2;
				currentDifficultyPercentage = 50;
			} else if (
				trimmedLine.includes("레벨 3") ||
				trimmedLine.includes("30%")
			) {
				currentLevel = 3;
				currentDifficultyPercentage = 30;
			} else if (
				trimmedLine.includes("레벨 4") ||
				trimmedLine.includes("영어")
			) {
				currentLevel = 4;
				currentDifficultyPercentage = 0; // 영어 키워드만 제공
			}
			continue;
		}

		// 키워드 스피치 라인 처리 (→ 포함하는 라인)
		if (trimmedLine.includes("→")) {
			const [keywordPart = "", targetSentence = ""] = trimmedLine
				.split("→")
				.map((s) => s.trim());

			const keywords = keywordPart.split(",").map((k) => k.trim());

			keyword_speeches.push({
				stage: 4,
				level: currentLevel,
				sequence_order: sequenceOrder,
				keywords,
				target_sentence: targetSentence,
				difficulty_percentage: currentDifficultyPercentage,
			});

			sequenceOrder++;
		}
	}
}

// JSON 저장 함수
export async function saveToJsonFile(data: ParsedContent, outputPath: string) {
	const jsonContent = JSON.stringify(data, null, 2);
	fs.writeFileSync(outputPath, jsonContent, "utf-8");
	console.log(`✅ JSON saved to: ${outputPath}`);
}

// Supabase 업로드 함수
export async function uploadToSupabase(data: ParsedContent) {
	try {
		// 1. Topic 구성
		const { data: topicData, error: topicError } = await supabase
			.from("topics")
			.upsert(data.topic)
			.select()
			.single();

		if (topicError) throw topicError;

		const topicId = topicData.id;

		// 2. Korean Scripts 삽입
		if (data.korean_scripts.length > 0) {
			const koreanScriptsWithTopicId = data.korean_scripts.map((script) => ({
				...script,
				topic_id: topicId,
			}));

			const { error: koreanError } = await supabase
				.from("korean_scripts")
				.upsert(koreanScriptsWithTopicId, {
					onConflict: "topic_id,sentence_order",
				});

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
				.upsert(englishScriptsWithTopicId, {
					onConflict: "topic_id,sentence_order",
				});

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
				.upsert(keywordSpeechesWithTopicId, {
					onConflict: "topic_id,stage,level,sequence_order",
				});

			if (keywordError) throw keywordError;
			console.log("Keyword speeches inserted:", data.keyword_speeches.length);
		}

		// 5. Learning Points 삽입
		if (data.learning_points.length > 0) {
			const learningPointsWithTopicId = data.learning_points.map((point) => ({
				...point,
				topic_id: topicId,
			}));

			const { error: learningError } = await supabase
				.from("learning_points")
				.upsert(learningPointsWithTopicId, {
					onConflict: "topic_id,sentence_order,korean_phrase",
				});

			if (learningError) throw learningError;
			console.log("Learning points inserted:", data.learning_points.length);
		}

		console.log("✅ All data uploaded successfully!");
		return topicData;
	} catch (error) {
		console.error("❌ Upload failed:", error);
		throw error;
	}
}

// 범용 테스트 함수
export async function processMarkdownFile(
	inputPath: string,
	outputJsonPath: string,
) {
	try {
		console.log(`📖 Processing: ${inputPath}`);

		const data = await parseMarkdownContent(inputPath);
		await saveToJsonFile(data, outputJsonPath);

		const result = await uploadToSupabase(data);
		console.log("✅ Process completed:", result);

		return result;
	} catch (error) {
		console.error("❌ Process failed:", error);
		throw error;
	}
}
