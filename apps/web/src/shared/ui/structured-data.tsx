/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: <JSON-LD> */

export default function StructuredData() {
	const organizationSchema = {
		"@context": "https://schema.org",
		"@type": "EducationalOrganization",
		name: "My Speak",
		description:
			"한국어→외국어 번역과 키워드 스피치를 통한 4단계 학습 시스템으로 외국어 스피킹을 효과적으로 학습하세요.",
		url: "https://my-speak.com",
		logo: "https://my-speak.com/app-icon.png",
		foundingDate: "2024",
		educationalCredentialAwarded: "Language Learning Certificate",
		hasOfferCatalog: {
			"@type": "OfferCatalog",
			name: "Foreign Speaking Programs",
			itemListElement: [
				{
					"@type": "Course",
					name: "외국어 스피킹 학습",
					description: "4단계 학습 시스템을 통한 외국어 스피킹 향상",
					provider: {
						"@type": "EducationalOrganization",
						name: "My Speak",
					},
					educationalLevel: "Beginner to Advanced",
					teaches: ["English Speaking", "Japanese Speaking"],
					hasCourseInstance: {
						"@type": "CourseInstance",
						courseMode: "온라인",
						instructor: {
							"@type": "EducationalOrganization",
							name: "My Speak",
						},
					},
				},
			],
		},
		contactPoint: {
			"@type": "ContactPoint",
			contactType: "Customer Service",
			availableLanguage: ["Korean", "English", "Japanese"],
		},
	};

	const websiteSchema = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "My Speak",
		url: "https://my-speak.com",
		potentialAction: {
			"@type": "SearchAction",
			target: "https://my-speak.com/search?q={search_term_string}",
			"query-input": "required name=search_term_string",
		},
	};

	const webApplicationSchema = {
		"@context": "https://schema.org",
		"@type": "WebApplication",
		name: "My Speak",
		description:
			"한국어→외국어 번역과 키워드 스피치를 통한 4단계 학습 시스템으로 외국어 스피킹을 효과적으로 학습하세요.",
		url: "https://my-speak.com",
		applicationCategory: "EducationalApplication",
		operatingSystem: "Web Browser",
		offers: {
			"@type": "Offer",
			name: "외국어 스피킹 학습 서비스",
			category: "Educational Service",
			availability: "https://schema.org/InStock",
			price: "0",
			priceCurrency: "KRW",
		},
		featureList: [
			"4단계 학습 시스템",
			"외국어 스피킹 지원",
			"음성 인식 기반 스피킹 연습",
			"키워드 기반 자유 표현 학습",
			"개인별 맞춤 학습",
			"진도 추적",
		],
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(organizationSchema),
				}}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(websiteSchema),
				}}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(webApplicationSchema),
				}}
			/>
		</>
	);
}
