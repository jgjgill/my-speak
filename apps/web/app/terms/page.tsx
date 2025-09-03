import Link from "next/link";

export default function TermsPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-4">
						서비스 이용약관
					</h1>
					<p className="text-gray-600">
						My Speak 서비스 이용을 위한 기본 약관입니다.
					</p>
				</div>

				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
					<div className="space-y-6">
						<section>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">
								서비스 소개
							</h2>
							<p className="text-gray-700 leading-relaxed">
								My Speak은 외국어 스피킹 학습을 위한 개인 프로젝트입니다. 4단계
								체계적 학습을 통해 외국어 스피킹 실력 향상을 목표로 합니다.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">
								이용 조건
							</h2>
							<ul className="text-gray-700 leading-relaxed space-y-2 list-disc pl-5">
								<li>본 서비스는 학습 목적으로만 이용해주세요</li>
								<li>Google 또는 Apple 계정을 통해 로그인할 수 있습니다</li>
								<li>서비스는 무료로 제공됩니다</li>
								<li>부적절한 사용은 제한될 수 있습니다</li>
							</ul>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">
								개인정보 보호
							</h2>
							<p className="text-gray-700 leading-relaxed">
								로그인 시 필요한 최소한의 정보(이메일, 프로필 사진)만 수집하며,
								학습 진도 관리를 위해 사용됩니다. 자세한 내용은 개인정보
								처리방침을 참고해주세요.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">
								면책사항
							</h2>
							<p className="text-gray-700 leading-relaxed">
								본 서비스는 개인 프로젝트로, 서비스 중단이나 데이터 손실에 대한
								책임을 지지 않습니다. 학습 효과는 개인차가 있을 수 있습니다.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">문의</h2>
							<p className="text-gray-700 leading-relaxed">
								서비스 관련 문의나 제안사항이 있으시면 언제든 연락해주세요.
							</p>
						</section>
					</div>
				</div>

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
