"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../contexts/auth-context";

// biome-ignore lint/suspicious/noExplicitAny: <user>
function getDisplayName(user: any): string {
	if (user.user_metadata?.full_name) {
		return user.user_metadata.full_name;
	}
	if (user.user_metadata?.name) {
		return user.user_metadata.name;
	}
	if (user.email) {
		const emailPrefix = user.email.split("@")[0];
		return emailPrefix;
	}
	return "사용자";
}

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

export default function ProfilePage() {
	const { user, signOut, deleteAccount } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!user) {
			router.push("/login");
		}
	}, [user, router]);

	if (!user) {
		return null;
	}

	const displayName = getDisplayName(user);
	const initials = getInitials(displayName);
	const avatarColorClass = getAvatarColor(displayName);

	const handleSignOut = async () => {
		await signOut();
		router.push("/");
	};

	const handleDeleteAccount = async () => {
		if (
			window.confirm(
				"정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
			)
		) {
			try {
				await deleteAccount();
			} catch (error) {
				alert("계정 삭제에 실패했습니다. 다시 시도해주세요.");
				console.error("Account deletion error:", error);
			}
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-2xl mx-auto px-4 py-12">
				{/* 페이지 제목 */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">프로필 설정</h1>
					<p className="text-gray-600">계정 정보를 확인하고 관리하세요</p>
				</div>

				{/* 프로필 정보 카드 */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-6">
						계정 정보
					</h2>

					<div className="flex items-start gap-6">
						{/* 아바타 */}
						<div className="flex-shrink-0">
							{user.user_metadata?.avatar_url ? (
								<Image
									src={user.user_metadata.avatar_url}
									alt="프로필"
									width={64}
									height={64}
									className="w-16 h-16 rounded-full border-2 border-gray-200"
								/>
							) : (
								<div
									className={`w-16 h-16 rounded-full ${avatarColorClass} flex items-center justify-center border-2 border-gray-200`}
								>
									<span className="text-white font-bold text-xl">
										{initials}
									</span>
								</div>
							)}
						</div>

						{/* 사용자 정보 */}
						<div className="flex-1">
							<div className="space-y-4">
								<div>
									<div className="text-sm font-medium text-gray-700 mb-1">
										이름
									</div>
									<div className="text-gray-900 font-medium">{displayName}</div>
								</div>
								<div>
									<div className="text-sm font-medium text-gray-700 mb-1">
										이메일
									</div>
									<div className="text-gray-600">{user.email}</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* 계정 관리 카드 */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						계정 관리
					</h3>

					<div className="space-y-3">
						{/* 로그아웃 버튼 */}
						<button
							type="button"
							onClick={handleSignOut}
							className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-3"
						>
							<svg
								className="w-5 h-5 text-gray-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title id="profile-logout-icon-title">로그아웃 아이콘</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
								/>
							</svg>
							<div>
								<div className="font-medium text-gray-900">로그아웃</div>
								<div className="text-sm text-gray-500">
									계정에서 로그아웃합니다.
								</div>
							</div>
						</button>

						{/* 회원탈퇴 버튼 - 위험한 액션이므로 구분 */}
						<div className="border-t border-gray-100 pt-4 mt-6">
							<button
								type="button"
								onClick={handleDeleteAccount}
								className="w-full text-left px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center gap-3 transition-colors"
							>
								<svg
									className="w-5 h-5 text-red-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title id="profile-delete-icon-title">계정 삭제 아이콘</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/>
								</svg>
								<div>
									<div className="font-medium">계정 삭제</div>
									<div className="text-sm text-red-500">
										모든 데이터가 영구적으로 삭제됩니다.
									</div>
								</div>
							</button>
						</div>
					</div>
				</div>

				{/* 웹에서 자연스러운 추가 정보 */}
				<div className="mt-8 text-center">
					<p className="text-sm text-gray-500">
						계정에 문제가 있으시나요?{" "}
						<button
							type="button"
							className="text-blue-600 hover:text-blue-800 font-medium"
							onClick={() => window.open("mailto:support@myspeak.com")}
						>
							고객지원 문의
						</button>
					</p>
				</div>
			</div>
		</div>
	);
}
