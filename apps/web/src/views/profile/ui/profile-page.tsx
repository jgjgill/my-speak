"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/shared/lib/auth";
import { getAvatarColor, getDisplayName, getInitials } from "@/shared/lib/user";

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
		if (window.confirm("로그아웃하시겠습니까?")) {
			router.push("/");
			await signOut();
		}
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
			<div className="max-w-2xl mx-auto px-4 py-8">
				<div className="mb-8 text-center">
					<h1 className="text-2xl font-bold text-gray-900 mb-2">프로필 설정</h1>
					<p className="text-sm text-gray-600">
						계정 정보를 확인하고 관리하세요
					</p>
				</div>

				<div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-6">
						계정 정보
					</h2>

					<div className="flex items-start gap-6">
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

						<div className="flex-1">
							<div className="space-y-3">
								<div>
									<div className="text-sm font-medium text-gray-500 mb-1">
										이름
									</div>
									<div className="text-base font-medium text-gray-900">
										{displayName}
									</div>
								</div>
								<div>
									<div className="text-sm font-medium text-gray-500 mb-1">
										이메일
									</div>
									<div className="text-base text-gray-600">{user.email}</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						계정 관리
					</h3>

					<div className="space-y-3">
						<button
							type="button"
							onClick={handleSignOut}
							className="w-full flex items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors gap-3"
						>
							<svg
								className="w-5 h-5 text-gray-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title>로그아웃 아이콘</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
								/>
							</svg>
							<div className="flex-1 text-left">
								<div className="font-medium text-gray-900">로그아웃</div>
								<div className="text-sm text-gray-500">
									계정에서 로그아웃합니다.
								</div>
							</div>
							<svg
								className="w-4 h-4 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title>화살표 아이콘</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</button>

						<div className="border-t border-gray-100 my-4" />

						<button
							type="button"
							onClick={handleDeleteAccount}
							className="w-full flex items-center px-4 py-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors gap-3"
						>
							<svg
								className="w-5 h-5 text-red-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title>계정 삭제 아이콘</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
								/>
							</svg>
							<div className="flex-1 text-left">
								<div className="font-medium text-red-600">계정 삭제</div>
								<div className="text-sm text-red-500">
									모든 데이터가 영구적으로 삭제됩니다.
								</div>
							</div>
							<svg
								className="w-4 h-4 text-red-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title>화살표 아이콘</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</button>
					</div>
				</div>

				<div className="bg-white rounded-xl border border-gray-100 p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">도움말</h3>

					<button
						type="button"
						className="w-full flex items-center px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors gap-3"
						onClick={() => window.open("https://forms.gle/hqLHcjeWRvMExb6v8")}
					>
						<svg
							className="w-5 h-5 text-blue-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>도움말 아이콘</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<div className="flex-1 text-left">
							<div className="font-medium text-blue-700">고객지원 문의</div>
							<div className="text-sm text-blue-600">
								문제가 있으시면 언제든지 문의하세요.
							</div>
						</div>
						<svg
							className="w-4 h-4 text-blue-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>외부링크 아이콘</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
}
