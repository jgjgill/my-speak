import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "jsdom",
		setupFiles: ["./vitest.setup.ts"],
		exclude: ["**/e2e/**", "**/node_modules/**"],
	},
	esbuild: { jsx: "automatic" },
});
