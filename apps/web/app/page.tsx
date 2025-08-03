import Link from "next/link";

export default function Home() {
	return (
		<div className="p-4">
			<h1 className="text-3xl font-bold mb-4">My Speak - 영어 학습 플랫폼</h1>

			<div className="space-y-4">
				<div>
					<h2 className="text-xl font-semibold mb-2">테스트 페이지</h2>
					<Link href="/topics" className="text-blue-600 hover:underline">
						학습 주제 목록
					</Link>
				</div>
			</div>
		</div>
	);
}
