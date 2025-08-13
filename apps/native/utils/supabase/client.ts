import type { Database } from "@repo/typescript-config/supabase-types";
import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// SecureStore 2048 바이트 제한을 위한 청크 크기
const CHUNK_SIZE = 1900;

const supabaseStorage = {
	async getItem(key: string): Promise<string | null> {
		try {
			const chunkCount = await SecureStore.getItemAsync(`${key}_count`);

			if (!chunkCount) {
				return await SecureStore.getItemAsync(key);
			}

			const totalChunks = parseInt(chunkCount, 10);
			let result = "";

			for (let i = 0; i < totalChunks; i++) {
				const chunk = await SecureStore.getItemAsync(`${key}_${i}`);
				if (chunk === null) {
					return null;
				}
				result += chunk;
			}

			return result;
		} catch (error) {
			console.error("SecureStore getItem error:", error);
			return null;
		}
	},

	async setItem(key: string, value: string): Promise<void> {
		try {
			await this.removeItem(key);

			if (value.length <= CHUNK_SIZE) {
				await SecureStore.setItemAsync(key, value);
			} else {
				const chunks = [];
				for (let i = 0; i < value.length; i += CHUNK_SIZE) {
					chunks.push(value.slice(i, i + CHUNK_SIZE));
				}

				await SecureStore.setItemAsync(
					`${key}_count`,
					chunks.length.toString(),
				);

				for (let i = 0; i < chunks.length; i++) {
					await SecureStore.setItemAsync(`${key}_${i}`, chunks[i]);
				}
			}
		} catch (error) {
			console.error("SecureStore setItem error:", error);
			throw error;
		}
	},

	async removeItem(key: string): Promise<void> {
		try {
			await SecureStore.deleteItemAsync(key);

			const chunkCount = await SecureStore.getItemAsync(`${key}_count`);
			if (chunkCount) {
				const totalChunks = parseInt(chunkCount, 10);

				for (let i = 0; i < totalChunks; i++) {
					await SecureStore.deleteItemAsync(`${key}_${i}`);
				}

				await SecureStore.deleteItemAsync(`${key}_count`);
			}
		} catch (error) {
			console.error("SecureStore removeItem error:", error);
		}
	},
};

export const supabase = createClient<Database>(
	process.env.EXPO_PUBLIC_SUPABASE_URL || "",
	process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
	{
		auth: {
			...(Platform.OS !== "web" && { storage: supabaseStorage }),
			autoRefreshToken: true,
			persistSession: true,
		},
	},
);
