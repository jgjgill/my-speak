"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	if (user) {
		const displayName = getDisplayName(user);
		const initials = getInitials(displayName);
		const avatarColorClass = getAvatarColor(displayName);

		return (
			<div className="relative">
				{/* 프로필 버튼 */}
				<button
					type="button"
					onClick={() => setIsMenuOpen(!isMenuOpen)}
					className="flex items-center gap-2 sm:gap-3 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
				>
					{/* 프로필 아바타 */}
					<div className="relative">
						{user.user_metadata?.avatar_url ? (
							<Image
								src={user.user_metadata.avatar_url}
								alt="프로필"
								width={32}
								height={32}
								className="w-8 h-8 rounded-full border border-white shadow-sm"
							/>
						) : (
							<div
								className={`w-8 h-8 rounded-full ${avatarColorClass} flex items-center justify-center border border-white shadow-sm`}
							>
								<span className="text-white font-semibold text-sm">
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

					{/* 드롭다운 화살표 */}
					<svg
						className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
							isMenuOpen ? "rotate-180" : ""
						}`}
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<title id="dropdown-arrow-title">메뉴 열기</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={1.5}
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</button>

				{/* 드롭다운 메뉴 */}
				{isMenuOpen && (
					<div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
						{/* 사용자 정보 섹션 */}
						<div className="px-4 py-3 border-b border-gray-100">
							<div className="flex items-center gap-3">
								{/* 아바타 */}
								{user.user_metadata?.avatar_url ? (
									<Image
										src={user.user_metadata.avatar_url}
										alt="프로필"
										width={40}
										height={40}
										className="w-10 h-10 rounded-full"
									/>
								) : (
									<div
										className={`w-10 h-10 rounded-full ${avatarColorClass} flex items-center justify-center`}
									>
										<span className="text-white font-semibold">{initials}</span>
									</div>
								)}
								{/* 사용자 정보 */}
								<div className="flex-1">
									<div className="font-medium text-gray-900">{displayName}</div>
									<div className="text-sm text-gray-500">{user.email}</div>
								</div>
							</div>
						</div>

						{/* 메뉴 항목들 */}
						<div className="py-1">
							{/* 프로필 페이지로 이동 */}
							<Link
								href="/profile"
								onClick={() => setIsMenuOpen(false)}
								className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors block"
							>
								<svg
									className="w-4 h-4 text-gray-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title id="profile-icon-title">프로필 아이콘</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
									/>
								</svg>
								프로필 설정
							</Link>

							{/* 로그아웃 버튼 */}
							<button
								type="button"
								onClick={async () => {
									setIsMenuOpen(false);
									await signOut();
								}}
								className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
							>
								<svg
									className="w-4 h-4 text-red-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title id="logout-icon-title">로그아웃 아이콘</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
									/>
								</svg>
								로그아웃
							</button>
						</div>
					</div>
				)}

				{/* 클릭 외부 감지를 위한 오버레이 */}
				{isMenuOpen && (
					<button
						type="button"
						className="fixed inset-0 z-40 bg-transparent border-0 cursor-default"
						onClick={() => setIsMenuOpen(false)}
						aria-label="메뉴 닫기"
					/>
				)}
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
