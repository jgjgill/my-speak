"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../contexts/auth-context";

function getInitials(name?: string): string {
	if (!name) return "U";
	return name
		.split(" ")
		.map((word) => word.charAt(0))
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

function getAvatarColor(name?: string): string {
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

function getDisplayName(user: any): string {
	// 1순위: full_name (닉네임이나 실명)
	if (user.user_metadata?.full_name) {
		return user.user_metadata.full_name;
	}

	// 2순위: name 필드
	if (user.user_metadata?.name) {
		return user.user_metadata.name;
	}

	// 3순위: email의 @ 앞부분
	if (user.email) {
		const emailPrefix = user.email.split("@")[0];
		return emailPrefix;
	}

	// 기본값
	return "사용자";
}

export default function AuthButton() {
	const { user, signOut } = useAuth();

	if (user) {
		const displayName = getDisplayName(user);
		const initials = getInitials(displayName);
		const avatarColorClass = getAvatarColor(displayName);

		return (
			<div className="flex items-center gap-2 sm:gap-3">
				{/* 프로필 아바타 */}
				<div className="relative">
					{user.user_metadata?.avatar_url ? (
						<Image
							src={user.user_metadata.avatar_url}
							alt="프로필"
							width={24}
							height={24}
							className="w-6 h-6 rounded-full border border-white shadow-sm"
						/>
					) : (
						<div
							className={`w-6 h-6 rounded-full ${avatarColorClass} flex items-center justify-center border border-white shadow-sm`}
						>
							<span className="text-white font-semibold text-xs">
								{initials}
							</span>
						</div>
					)}
				</div>

				{/* 사용자 정보 - 태블릿 이상에서만 표시 */}
				<div className="hidden md:block">
					<span className="text-sm font-medium text-gray-900">
						{displayName}
					</span>
				</div>

				{/* 로그아웃 버튼 - 모바일에서는 아이콘만, 데스크톱에서는 텍스트 */}
				<button
					type="button"
					onClick={signOut}
					className="min-h-[44px] min-w-[44px] flex items-center justify-center px-2 sm:px-3 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors border border-gray-200 hover:border-gray-300"
					aria-label="로그아웃"
				>
					{/* 모바일: 아이콘만 */}
					<svg
						className="w-4 h-4 sm:hidden"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<title>로그아웃</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
						/>
					</svg>
					{/* 태블릿 이상: 텍스트 */}
					<span className="hidden sm:block">로그아웃</span>
				</button>
			</div>
		);
	}

	return (
		<Link
			href="/login"
			className="min-h-[44px] px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
		>
			로그인
		</Link>
	);
}
