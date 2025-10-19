/** biome-ignore-all lint/style/noNonNullAssertion: <biome-ignore> */

import type { Database } from "@repo/typescript-config/supabase-types";
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
	return createBrowserClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	);
}
