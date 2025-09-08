import type { User } from "@supabase/supabase-js";

export function getDisplayName(user: User): string {
	if (user?.user_metadata?.full_name) {
		return user.user_metadata.full_name;
	}
	if (user?.user_metadata?.name) {
		return user.user_metadata.name;
	}
	if (user?.email) {
		const emailPrefix = user.email.split("@")[0];
		return emailPrefix;
	}
	return "사용자";
}

export function getInitials(name: string): string {
	return name
		.split(" ")
		.map((word) => word.charAt(0))
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

export function getAvatarColor(name: string): string {
	const colors = [
		"#1E40AF", // primary
		"#10B981", // emerald-500
		"#8B5CF6", // violet-500
		"#F59E0B", // amber-500
		"#EF4444", // red-500
		"#6366F1", // indigo-500
	];

	const index = name.charCodeAt(0) % colors.length;
	return colors[index] ?? "#1E40AF";
}
