// Stage 1 규칙 파서 사전 (데이터 전용). 부록 A 전수 전환은 §9-2/Phase-4로 유예 —
// 이 파일은 데이터라 나중 전환은 additive. 설계: _matcher-design-stage1.md §2.1.

import type { Category, Season } from "@/types/db";
import type { DictEntry, IntentDictionary, TaxonomyKeys } from "./types";

// 색 그룹 상수
const PASTEL = ["baby_pink", "powder_blue", "lavender", "lilac", "butter", "mint", "light_blue", "sky_blue", "peach"];
const NEUTRAL = ["white", "off_white", "ivory", "cream", "beige", "oatmeal", "gray", "greige"];

// 방출 빌더
const season = (surface: string, keys: Season[]): DictEntry => ({ surface, emit: [{ dim: "season", keys }] });
const situ = (surface: string, key: string): DictEntry => ({ surface, emit: [{ dim: "situation", key }] });
const mood = (surface: string, key: string): DictEntry => ({ surface, emit: [{ dim: "mood", key }] });
const fit = (surface: string, key: string): DictEntry => ({ surface, emit: [{ dim: "fit", key }] });
const color = (surface: string, label: string, group: string[]): DictEntry => ({
  surface,
  emit: [{ dim: "color", label, group }],
});
const item = (surface: string, categories: Category[], subcategories: string[]): DictEntry => ({
  surface,
  emit: [{ dim: "item", label: surface, categories, subcategories }],
});

export const STAGE1_DICTIONARY: IntentDictionary = [
  // ── season ──
  season("봄", ["spring"]),
  season("여름", ["summer"]),
  season("한여름", ["summer"]),
  season("가을", ["fall"]),
  season("겨울", ["winter"]),
  season("간절기", ["spring", "fall"]),
  { surface: "장마철", emit: [{ dim: "season", keys: ["summer"] }, { dim: "situation", key: "rainy_day" }] },

  // ── situation ──
  situ("데이트", "date"),
  situ("출근", "work"),
  situ("오피스", "work"),
  situ("면접", "work"),
  situ("여행", "travel"),
  situ("운동", "workout"),
  situ("하객", "wedding_guest"),
  situ("피크닉", "picnic"),
  situ("카페", "cafe"),
  situ("일상", "everyday"),
  situ("데일리", "everyday"),
  situ("주말", "everyday"),

  // ── mood ──
  mood("캐주얼", "casual"),
  mood("러블리", "lovely"),
  mood("미니멀", "minimal"),
  mood("올드머니", "old_money"),
  mood("발레코어", "ballet_core"),
  mood("스트릿", "street"),
  mood("스트리트", "street"),
  mood("꾸안꾸", "kkuankku"),
  mood("스포티", "sporty"),
  mood("페미닌", "feminine"),
  mood("걸리시", "girlish"),
  mood("시크", "chic"),

  // ── color (longest-match: 파스텔블루/라이트블루가 파스텔/블루보다 먼저 잡히게) ──
  color("파스텔블루", "파스텔블루", ["powder_blue"]),
  color("라이트블루", "라이트블루", ["light_blue"]),
  color("네이비", "네이비", ["navy"]),
  color("아이보리", "아이보리", ["ivory"]),
  color("파스텔", "파스텔", PASTEL),
  color("뉴트럴", "뉴트럴", NEUTRAL),
  color("무채색", "무채색", ["white", "gray", "black"]),
  color("화이트", "화이트", ["white"]),
  color("크림", "크림", ["cream"]),
  color("베이지", "베이지", ["beige"]),
  color("블랙", "블랙", ["black"]),
  color("블루", "블루", ["blue"]),

  // ── fit (오버핏이 오버보다 먼저) ──
  fit("오버핏", "over"),
  fit("오버", "over"),
  fit("슬림", "slim"),
  fit("세미와이드", "semi_wide"),
  fit("와이드", "wide"),
  fit("하이웨이스트", "high_waist"),
  fit("힙커버", "hip_cover"),
  fit("크롭", "crop"),

  // ── item (garment noun → category/subcategory) ──
  item("원피스", ["dress"], ["dress"]),
  item("드레스", ["dress"], ["dress"]),
  item("스커트", ["bottom"], ["skirt"]),
  item("치마", ["bottom"], ["skirt"]),
  item("슬랙스", ["bottom"], ["slacks"]),
  item("바지", ["bottom"], []),
  item("팬츠", ["bottom"], []),
  item("데님", ["bottom"], ["denim"]),
  item("청바지", ["bottom"], ["denim"]),
  item("니트", ["top"], ["knit"]),
  item("블라우스", ["top"], ["blouse"]),
  item("셔츠", ["top"], ["shirt"]),
  item("티셔츠", ["top"], ["tshirt"]),
  item("반팔티", ["top"], ["tshirt"]),
  item("가디건", ["outer"], ["cardigan"]),
  item("자켓", ["outer"], ["jacket"]),
  item("재킷", ["outer"], ["jacket"]),
  item("블레이저", ["outer"], ["blazer"]),
  item("코트", ["outer"], ["coat"]),
  item("트렌치", ["outer"], ["coat"]),
  item("바람막이", ["outer"], ["windbreaker"]),
  { surface: "셋업", emit: [
    { dim: "item", label: "셋업", categories: ["top"], subcategories: [] },
    { dim: "item", label: "셋업", categories: ["bottom"], subcategories: [] },
  ] },
];

/** §6 화이트리스트 (Stage 1 부분집합 — 부록 A 전수는 유예). 사전 폐쇄성 테스트가 공유. */
export const TAXONOMY_KEYS: TaxonomyKeys = {
  situation: new Set(["date", "work", "travel", "workout", "wedding_guest", "picnic", "cafe", "everyday", "rainy_day"]),
  mood: new Set([
    "casual",
    "lovely",
    "minimal",
    "old_money",
    "ballet_core",
    "street",
    "kkuankku",
    "sporty",
    "feminine",
    "girlish",
    "chic",
  ]),
  color: new Set([
    "navy",
    "ivory",
    "light_blue",
    "powder_blue",
    "white",
    "off_white",
    "cream",
    "beige",
    "oatmeal",
    "greige",
    "gray",
    "black",
    "blue",
    "baby_pink",
    "lavender",
    "lilac",
    "butter",
    "mint",
    "sky_blue",
    "peach",
  ]),
  fit: new Set(["over", "slim", "semi_wide", "wide", "high_waist", "hip_cover", "crop"]),
};
