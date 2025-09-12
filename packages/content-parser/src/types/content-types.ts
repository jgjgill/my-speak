import type { TablesInsert } from "@repo/typescript-config/supabase-types";

// 파싱된 콘텐츠 타입 정의
export interface ParsedContent {
  topic: TablesInsert<"topics">;
  korean_scripts: Omit<TablesInsert<"korean_scripts">, "topic_id">[];
  foreign_scripts: Omit<TablesInsert<"foreign_scripts">, "topic_id">[];
  keyword_speeches: Omit<TablesInsert<"keyword_speeches">, "topic_id">[];
  learning_points: Omit<TablesInsert<"learning_points">, "topic_id">[];
  highlight_sentences: Omit<TablesInsert<"highlight_sentences">, "topic_id">[];
}

// frontmatter 타입 정의
export interface ContentFrontmatter {
  topic_id?: string;
  title?: string;
  category?: string;
  difficulty?: string;
  description?: string;
  language_code?: string;
  highlight_sentence?: {
    sentence_order?: number;
    korean_text?: string;
    foreign_text?: string;
    reason?: string;
  };
}

// 섹션 타입 정의
export interface ContentSection {
  title: string;
  lines: string[];
  content: string;
}

// 학습 포인트 매칭 결과
export interface LearningPointMatch {
  koreanPhrase: string;
  foreignPhrase: string;
  fullMatch: string;
}

// 키워드 스피치 레벨 정보
export interface KeywordSpeechLevel {
  level: number;
  difficultyPercentage: number;
}