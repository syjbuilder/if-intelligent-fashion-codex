import type { LookCardData, ProductMock } from "@/types/ui";

// 정적 셸 데이터 — 외부 호출 0. 다음 phase에서 Supabase(looks/products) fetch로 교체된다.
// 사람 사진 없음(가먼트 SVG + 톤 그라디언트만, ADR-006). 룩 무드는 tone(office/date/sport)으로 표현.

/** 랜딩 'Today's curated' 6장 */
export const CURATED_LOOKS: LookCardData[] = [
  { id: "c-1", tone: "office", variant: "a", tag: "OFFICE 01", caption: "뉴트럴 셋업", prompt: "출근룩 뉴트럴 톤 미니멀 셋업" },
  { id: "c-2", tone: "date", variant: "b", tag: "DATE 01", caption: "러블리 미디 원피스", prompt: "데이트룩 러블리 미디 원피스" },
  { id: "c-3", tone: "sport", variant: "c", tag: "SPORT 01", caption: "주말 애슬레저", prompt: "주말 애슬레저 캐주얼 셋업" },
  { id: "c-4", tone: "office", variant: "d", tag: "OFFICE 02", caption: "테일러드 자켓", prompt: "면접룩 단정한 테일러드 자켓" },
  { id: "c-5", tone: "date", variant: "a", tag: "DATE 02", caption: "시크 슬립 드레스", prompt: "저녁 약속 시크한 슬립 드레스" },
  { id: "c-6", tone: "sport", variant: "b", tag: "SPORT 02", caption: "윈드브레이커", prompt: "러닝 후 브런치 스포티 룩" },
];

/** 워크스페이스 Explore 'Curated for this week' 12장 (tone당 4변주) */
export const EXPLORE_LOOKS: LookCardData[] = [
  { id: "e-1", tone: "office", variant: "a", tag: "OFFICE 03", caption: "톤온톤 베이지", prompt: "톤온톤 베이지 오피스룩" },
  { id: "e-2", tone: "office", variant: "b", tag: "OFFICE 04", caption: "셔츠 레이어드", prompt: "셔츠 레이어드 깔끔한 출근룩" },
  { id: "e-3", tone: "office", variant: "c", tag: "OFFICE 05", caption: "니트 베스트", prompt: "니트 베스트 단정한 데일리" },
  { id: "e-4", tone: "office", variant: "d", tag: "OFFICE 06", caption: "와이드 슬랙스", prompt: "와이드 슬랙스 모던 오피스" },
  { id: "e-5", tone: "date", variant: "a", tag: "DATE 03", caption: "플로럴 원피스", prompt: "봄 데이트 플로럴 원피스" },
  { id: "e-6", tone: "date", variant: "b", tag: "DATE 04", caption: "니트 + 스커트", prompt: "러블리 니트 미디 스커트 데이트룩" },
  { id: "e-7", tone: "date", variant: "c", tag: "DATE 05", caption: "트렌치 코디", prompt: "트렌치 코트 클래식 데이트룩" },
  { id: "e-8", tone: "date", variant: "d", tag: "DATE 06", caption: "새틴 블라우스", prompt: "저녁 약속 새틴 블라우스 룩" },
  { id: "e-9", tone: "sport", variant: "a", tag: "SPORT 03", caption: "후디 셋업", prompt: "캐주얼 후디 셋업 데일리" },
  { id: "e-10", tone: "sport", variant: "b", tag: "SPORT 04", caption: "트랙 자켓", prompt: "레트로 트랙 자켓 스포티" },
  { id: "e-11", tone: "sport", variant: "c", tag: "SPORT 05", caption: "조거 팬츠", prompt: "조거 팬츠 편안한 주말룩" },
  { id: "e-12", tone: "sport", variant: "d", tag: "SPORT 06", caption: "바람막이", prompt: "장마철 바람막이 레이어드" },
];

/** Explore 진입 시 시즌 데모 프롬프트 칩 5개 ('빈 입력창 마비' 방지) */
export const SEASON_PROMPTS: string[] = [
  "봄 데이트룩, 파스텔 미니멀",
  "출근룩, 뉴트럴 톤 셋업",
  "주말 캐주얼, 스포티 데일리",
  "하객룩, 단정한 미디 드레스",
  "장마철 레이어드, 방수 아우터",
];

/** 상품 패널/드로어 mock 상품 — 외부 구매 링크는 셸에서 비활성(ADR-004) */
export const PRODUCTS_MOCK: ProductMock[] = [
  { id: "p-1", category: "outer", name: "싱글 테일러드 블레이저", brand: "29CM 셀렉트", price: 89000, platform: "29CM" },
  { id: "p-2", category: "top", name: "오버핏 코튼 셔츠", brand: "무신사 스탠다드", price: 39000, platform: "MUSINSA" },
  { id: "p-3", category: "bottom", name: "와이드 트라우저", brand: "에이블리", price: 49000, platform: "에이블리" },
  { id: "p-4", category: "dress", name: "플리츠 미디 원피스", brand: "지그재그", price: 59000, platform: "ZIGZAG" },
  { id: "p-5", category: "top", name: "라운드넥 니트 베스트", brand: "29CM 셀렉트", price: 45000, platform: "29CM" },
];
