import type { User } from "@supabase/supabase-js";

export function getDisplayName(user: User): string {
	if (user?.user_metadata?.full_name) {
		return user.user_metadata.full_name;
	}
	if (user?.user_metadata?.name) {
		return user.user_metadata.name;
	}
	if (user?.email) {
		const emailPrefix = user.email.split("@")[0] ?? "";
		return emailPrefix;
	}
	return "사용자";
}

export function getInitials(name?: string): string {
	if (!name) return "U";
	return name
		.split(" ")
		.map((word) => word.charAt(0))
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

export function getAvatarColor(name?: string): string {
	if (!name) return "bg-blue-500";

	const colors = [
		"bg-blue-500",
		"bg-green-500",
		"bg-purple-500",
		"bg-orange-500",
		"bg-pink-500",
		"bg-indigo-500",
	];

	const index = name.charCodeAt(0) % colors.length;
	return colors[index] ?? "bg-blue-500";
}