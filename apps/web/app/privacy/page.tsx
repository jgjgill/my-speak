"use client";

import Link from "next/link";

export default function PrivacyPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
				{/* 헤더 */}
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-4">개인정보 처리방침</h1>
					<p className="text-gray-600">
						My Speak에서 어떤 정보를 어떻게 사용하는지 알려드립니다.
					</p>
				</div>

				{/* 개인정보 처리방침 내용 */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
					<div className="space-y-6">
						<section>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">어떤 정보를 수집하나요?</h2>
							<div className="text-gray-700 leading-relaxed">
								<p className="mb-3">Google이나 Apple로 로그인할 때:</p>
								<ul className="list-disc pl-5 space-y-1 mb-4">
									<li>이메일 주소</li>
									<li>프로필 사진</li>
									<li>이름</li>
								</ul>
								<p className="mb-2">학습하면서 생기는 정보:</p>
								<ul className="list-disc pl-5 space-y-1">
									<li>어떤 주제를 학습했는지</li>
									<li>진도 기록</li>
								</ul>
							</div>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">왜 수집하나요?</h2>
							<ul className="text-gray-700 leading-relaxed space-y-2 list-disc pl-5">
								<li>로그인해서 내 학습 기록을 볼 수 있도록</li>
								<li>어디까지 공부했는지 기억할 수 있도록</li>
								<li>더 나은 학습 경험을 제공하기 위해</li>
							</ul>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">정보를 어떻게 보호하나요?</h2>
							<p className="text-gray-700 leading-relaxed">
								안전한 암호화 방식을 사용하고, 필요한 최소한의 정보만 수집합니다. 
								다른 사람에게 개인정보를 넘기지 않습니다.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">언제까지 보관하나요?</h2>
							<p className="text-gray-700 leading-relaxed">
								계속 서비스를 이용하는 동안만 보관하고, 
								탈퇴하거나 삭제를 요청하면 바로 지워집니다.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">내 정보를 삭제하고 싶다면?</h2>
							<p className="text-gray-700 leading-relaxed">
								언제든지 계정을 삭제할 수 있고, 그러면 모든 정보가 완전히 사라집니다. 
								특별한 요청이나 문의사항이 있으면 언제든 연락해주세요.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">정책이 바뀌면?</h2>
							<p className="text-gray-700 leading-relaxed">
								이 방침이 바뀌는 경우 서비스에서 미리 알려드립니다.
							</p>
						</section>

						<div className="pt-4 border-t border-gray-200">
							<p className="text-sm text-gray-500">
								2025년 8월 30일부터 적용
							</p>
						</div>
					</div>
				</div>

				{/* 돌아가기 버튼 */}
				<div className="text-center mt-8">
					<Link
						href="/login"
						className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
					>
						← 로그인으로 돌아가기
					</Link>
				</div>
			</div>
		</div>
	);
}