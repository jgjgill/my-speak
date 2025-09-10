import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		include: [
			"__tests__/**/*.{test,spec}.{js,ts}",
			"src/**/*.{test,spec}.{js,ts}",
		],
		exclude: ["node_modules", "dist"],
		coverage: {
			reporter: ["text", "json", "html"],
			exclude: ["node_modules/", "dist/", "**/*.{test,spec}.{js,ts}"],
		},
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
});
