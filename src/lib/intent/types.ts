// Stage 1 규칙 기반 의도 파서 타입.
// 설계: data/curated/_matcher-design-stage1.md §1.2/§2.
// LLM 파싱 도입 시 같은 Intent 타입 뒤에서 parseIntent만 교체된다(설계 §6).

import type { Category, Season } from "@/types/db";

/** 파서 방출(emission) 차원 — 스코어링 Dimension(match/types)과 어휘가 다르다(item/season 분리). */
export type EmitDimension = "season" | "situation" | "mood" | "color" | "item" | "fit";

/** 색 요청 1건 = OR로 묶인 color 키 집합 (예: "파스텔" → {baby_pink, powder_blue, …}). */
export interface ColorGroup {
  label: string;
  keys: string[];
}

/** 의류 요청 1건 (예: "스커트" → categories:[bottom], subcategories:[skirt]). */
export interface ItemGroup {
  label: string;
  categories: Category[];
  subcategories: string[];
}

/** 매칭에 쓰인 표면형 → (차원, 키) provenance. eval/telemetry 전용. */
export interface MatchedTerm {
  surface: string;
  dimension: EmitDimension;
  key: string;
}

/** 규칙 파서 출력. 리스트 필드는 first-seen 순서 보존 + 차원별 dedupe. */
export interface Intent {
  raw: string;
  seasons: Season[];
  situations: string[];
  moods: string[];
  colorGroups: ColorGroup[];
  items: ItemGroup[];
  fits: string[];
  budgetMaxKrw: number | null;
  matchedTerms: MatchedTerm[];
  /** 미해결 청크 (스코어 무영향 — 사전 성장/telemetry용). */
  unknownTokens: string[];
}

/** 사전 항목 1개가 방출하는 것 — 하나의 표면형이 여러 차원을 히트할 수 있다(장마철/셋업). */
export type Emission =
  | { dim: "season"; keys: Season[] }
  | { dim: "situation"; key: string }
  | { dim: "mood"; key: string }
  | { dim: "color"; label: string; group: string[] }
  | { dim: "item"; label: string; categories: Category[]; subcategories: string[] }
  | { dim: "fit"; key: string };

export interface DictEntry {
  surface: string;
  emit: Emission[];
}

export type IntentDictionary = DictEntry[];

/** taxonomy 화이트리스트(§6) — 사전 폐쇄성 테스트가 공유. category/season은 db.ts 닫힌 enum이라 제외. */
export interface TaxonomyKeys {
  situation: Set<string>;
  mood: Set<string>;
  color: Set<string>;
  fit: Set<string>;
}
