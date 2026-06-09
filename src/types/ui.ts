// UI 셸 표현 전용 타입.
// db.ts의 닫힌 enum(DB 컬럼 정합)과 중복하지 않고, 정적 fixture·셸 컴포넌트 props만 위한 타입.
// 실제 데이터 연동(Supabase fetch) 시 db.ts Row 타입으로 매핑된다 — 다음 phase.

/** 룩 카드 무드 톤 (그라디언트/가먼트 색 결정) */
export type LookTone = "office" | "date" | "sport";

/** 같은 톤 안의 카드 변주 (a~d) */
export type LookVariant = "a" | "b" | "c" | "d";

/** 소셜 로그인 제공자 (표시 순서: google → kakao → naver) */
export type SocialProvider = "google" | "kakao" | "naver";

/** 워크스페이스 scene 상태머신 (error = 생성 실패 분기) */
export type StudioScene = "explore" | "loading" | "results" | "error";

/** 룩 카드(큐레이션/explore/저장) 표현 데이터 — 정적 fixture */
export interface LookCardData {
  id: string;
  tone: LookTone;
  variant: LookVariant;
  /** 카드 좌하단 룩 명 (예: "OFFICE 02") */
  tag: string;
  /** 카드 우하단 캡션 (작은 텍스트 — 이미지보다 강조하지 않음) */
  caption: string;
  /** 카드 클릭 시 프롬프트 입력칸에 채워질 문자열 */
  prompt: string;
}

/** 상품 카테고리 (룩 1벌의 구성 슬롯) */
export type ProductCategory = "top" | "bottom" | "outer" | "dress";

/** 상품 패널/드로어 mock 상품 — 정적 fixture (외부 구매 링크는 셸에서 비활성) */
export interface ProductMock {
  id: string;
  category: ProductCategory;
  name: string;
  brand: string;
  /** KRW */
  price: number;
  /** 출처 몰 (표시용: 무신사·29CM 등) */
  platform: string;
}
