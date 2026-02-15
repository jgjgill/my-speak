#!/usr/bin/env node

import { readdir } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import { processExpressionMarkdownFile } from "./expression-processor";

const CONTENT_SOURCE_DIR = "../../content/source/expressions";
const CONTENT_JSON_DIR = "../../content/json/expressions";

async function parseFile(filename: string) {
	const inputPath = join(CONTENT_SOURCE_DIR, filename);
	const outputFilename = `${basename(filename, ".md")}.json`;
	const outputPath = join(CONTENT_JSON_DIR, outputFilename);

	console.log(`📖 Processing: ${filename}`);

	try {
		const result = await processExpressionMarkdownFile(inputPath, outputPath);
		console.log(`✅ Successfully processed: ${filename}`);
		console.log(`📄 Expression created with ID: ${result.id}`);
		console.log(`💾 JSON saved to: ${outputPath}`);
		return result;
	} catch (error) {
		console.error(`❌ Failed to process ${filename}:`, error);
		throw error;
	}
}

async function parseAllFiles() {
	try {
		const files = await readdir(CONTENT_SOURCE_DIR);
		const mdFiles = files.filter((file) => extname(file) === ".md");

		console.log(`🔍 Found ${mdFiles.length} markdown files:`);
		mdFiles.forEach((file) => console.log(`  - ${file}`));
		console.log("");

		const results = [];

		for (const file of mdFiles) {
			try {
				const result = await parseFile(file);
				results.push({ file, success: true, result });
				console.log("");
			} catch (error) {
				results.push({ file, success: false, error });
				console.log("");
			}
		}

		// 결과 요약
		console.log("📊 Processing Summary:");
		console.log(`✅ Successful: ${results.filter((r) => r.success).length}`);
		console.log(`❌ Failed: ${results.filter((r) => !r.success).length}`);

		results.forEach(({ file, success, error }) => {
			if (!success) {
				console.log(
					`❌ ${file}: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
		});

		return results;
	} catch (error) {
		console.error("❌ Failed to read source directory:", error);
		process.exit(1);
	}
}

async function main() {
	const args = process.argv.slice(2);

	if (args.length === 0) {
		console.log("🚀 Expression Content Parser CLI");
		console.log("");
		console.log("Usage:");
		console.log(
			"  pnpm parse:expression:all           # Parse all expression markdown files",
		);
		console.log(
			"  pnpm parse:expression <filename>    # Parse specific expression file",
		);
		console.log("");
		console.log("Examples:");
		console.log("  pnpm parse:expression cafe-takeout-expressions.md");
		console.log("  pnpm parse:expression:all");
		process.exit(0);
	}

	const command = args[0];

	if (!command) {
		console.error("❌ Invalid command. Use 'all' or specify a .md filename");
		process.exit(1);
	}

	if (command === "all") {
		await parseAllFiles();
	} else if (command.endsWith(".md")) {
		await parseFile(command);
	} else {
		console.error("❌ Invalid command. Use 'all' or specify a .md filename");
		process.exit(1);
	}
}

main().catch((error) => {
	console.error("❌ CLI failed:", error);
	process.exit(1);
});
