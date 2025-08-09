import Link from "next/link";

export default function Home() {
	return (
		<div className="p-4">
			<h1 className="text-3xl font-bold mb-4">My Speak - 언어 학습 플랫폼</h1>

			<div className="space-y-4">
				<div>
					<Link href="/en/topics" className="text-blue-600 hover:underline">
						영어 콘텐츠
					</Link>
				</div>
			</div>
		</div>
	);
}
