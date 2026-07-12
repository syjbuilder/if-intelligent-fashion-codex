// Stage 1 매칭 엔진 타입.
// 설계: data/curated/_matcher-design-stage1.md §1.1/§3/§4.

import type { Category, Season } from "@/types/db";

/** 6 스코어링 차원. season+situation은 한 차원으로 합산(설계 §3.6). */
export type Dimension =
  | "category"
  | "color"
  | "fit"
  | "mood"
  | "price"
  | "season_situation";

/** 가중치 벡터 — 합 1.0. 상수 인라인 금지, 주입 파라미터(eval 그리드서치). */
export interface Weights {
  category: number;
  color: number;
  fit: number;
  mood: number;
  price: number;
  season_situation: number;
}

/** seed 상품 1건. fit은 부록 A 리치 키(db.ts 닫힌 FITS 아님 — 설계 §1.1 note). */
export interface SeedProduct {
  pid: string;
  lookId: string;
  isMain: boolean;
  category: Category;
  subcategory: string | null;
  color: string | null;
  fit: string | null;
  material: string | null;
  moodTags: string[];
  seasonTags: Season[];
  situationTags: string[];
  captionSimple: string;
  captionSearchable: string;
  name: string;
  price: number | null;
  productUrl: string | null;
  imageSrc: string | null;
  platform: string;
}

/** 매칭기 입력 룩 프로필. title/basePrompt는 표시 전용 — scorer가 안 읽음(설계 §1.1). */
export interface MatchableLook {
  id: string;
  title: string;
  basePrompt: string;
  coverImageSrc: string | null;
  // 객관 dim: union(look tags, product attrs)
  categories: Category[];
  subcategories: string[];
  colors: string[];
  fits: string[];
  // soft dim: look intent tags only
  season: Season | null;
  situations: string[];
  moods: string[];
  // price
  prices: number[];
  // UI payload용 (scoring 아님)
  products: SeedProduct[];
}

/** 차원 1개의 유사도 결과. */
export interface DimScore {
  similarity: number;
  evidence: string[];
}

/** 스코어된 차원 (가중치 포함, 디버그 payload). */
export interface ScoredDim {
  dimension: Dimension;
  weight: number;
  similarity: number;
  evidence: string[];
}

/** 룩 1개의 전체 점수. */
export interface LookScore {
  lookId: string;
  total: number;
  /** 타이브레이크용 객관(cat/color/fit) 미재정규 가중합. */
  objectiveSubscore: number;
  dims: ScoredDim[];
}

/** 게이트 통과 히트 (UI payload용 look 포함). */
export interface MatchHit {
  look: MatchableLook;
  score: number;
  dims: ScoredDim[];
}

export interface MatchResult {
  hits: MatchHit[];
  /** 게이트 미달 포함 전체 최고 점수 → generation_history.match_score. */
  topScore: number;
  noMatch: boolean;
  /** 파서가 아무 차원도 못 뽑음 (S 비어있음) — noMatch와 UX 분리. */
  noSignal: boolean;
  specified: Dimension[];
}

export interface MatchOptions {
  weights?: Weights;
  threshold?: number;
  maxResults?: number;
}
