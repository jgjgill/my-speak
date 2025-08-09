"use client";

import Image from "next/image";
import { useAuth } from "../contexts/auth-context";

export default function AuthButton() {
	const { user, signInWithGoogle, signOut } = useAuth();


	if (user) {
		return (
			<div className="flex items-center gap-3">
				<div className="flex items-center gap-2">
					{user.user_metadata.avatar_url && (
						<Image
							src={user.user_metadata.avatar_url}
							alt="프로필"
							width={32}
							height={32}
							className="w-8 h-8 rounded-full"
						/>
					)}
					{!user.user_metadata.avatar_url && (
						<div className="w-8 h-8 bg-red-400" />
					)}
					<span className="text-sm font-medium">
						{user.user_metadata?.full_name || user.email}
					</span>
				</div>
				<button
					type="button"
					onClick={signOut}
					className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
				>
					로그아웃
				</button>
			</div>
		);
	}

	return (
		<button
			type="button"
			onClick={signInWithGoogle}
			className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-2"
		>
			로그인
		</button>
	);
}
