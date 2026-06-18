/**
 * I.F V0 데이터베이스 타입 — docs/DATA_MODEL.md §15.1~15.10의 TypeScript 거울.
 *
 * 규칙:
 * - 닫힌 enum(category/season/fit/item_role/recommendation_type/plan_code/visibility 등)은
 *   const 배열을 단일 출처로 두고 유니온 타입을 파생한다(서버 화이트리스트 검증·테스트가 공유).
 * - situation/mood/color/fit 등 자유 어휘 taxonomy 태그 배열은 string[]로 둔다 — 값 화이트리스트는
 *   서버에서 검증한다(docs/AI_PIPELINE.md §9-2). 타입에 하드코딩하지 않는다.
 * - DB가 채우는 컬럼(id, created_at, updated_at)도 Row 타입에 포함한다(select 결과 기준).
 * - 10테이블 freeze — 새 테이블/컬럼 추가 금지.
 */

// ── 닫힌 enum (const 단일 출처 → 타입 파생) ──────────────────────────────

export const CATEGORIES = ["top", "bottom", "dress", "outer"] as const;
export type Category = (typeof CATEGORIES)[number];

export const SEASONS = ["spring", "summer", "fall", "winter", "all"] as const;
export type Season = (typeof SEASONS)[number];

export const FITS = ["slim", "regular", "oversized"] as const;
export type Fit = (typeof FITS)[number];

export const ITEM_ROLES = [
  "main_top",
  "main_bottom",
  "main_outer",
  "similar",
  "related",
] as const;
export type ItemRole = (typeof ITEM_ROLES)[number];

export const RECOMMENDATION_TYPES = ["main_combo", "similar", "related"] as const;
export type RecommendationType = (typeof RECOMMENDATION_TYPES)[number];

export const PLAN_CODES = ["free", "pro", "max"] as const;
export type PlanCode = (typeof PLAN_CODES)[number];

export const VISIBILITIES = ["private", "public"] as const;
export type Visibility = (typeof VISIBILITIES)[number];

export const AUTH_PROVIDERS = ["google", "kakao", "naver"] as const;
export type AuthProvider = (typeof AUTH_PROVIDERS)[number];

export const USER_ROLES = ["user", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

/** 다른 값 추가는 스키마 변경 사안 (AI_PIPELINE §9-0). */
export const SOURCE_PLATFORMS = ["29CM", "MUSINSA", "브랜드자사몰"] as const;
export type SourcePlatform = (typeof SOURCE_PLATFORMS)[number];

export const GENERATION_STATUSES = ["pending", "success", "failed"] as const;
export type GenerationStatus = (typeof GENERATION_STATUSES)[number];

export const TRIGGER_TYPES = [
  "fresh",
  "regenerate",
  "chip_refine",
  "more_like_this",
] as const;
export type TriggerType = (typeof TRIGGER_TYPES)[number];

export const PIPELINE_SOURCES = ["curated_only", "mixed", "generated_only"] as const;
export type PipelineSource = (typeof PIPELINE_SOURCES)[number];

export const TRANSACTION_TYPES = ["grant", "spend", "refund", "expire"] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

// ── 공용 별칭 ──────────────────────────────────────────────────────────

export type UUID = string;
/** Postgres timestamptz — ISO 8601 문자열로 직렬화. */
export type Timestamptz = string;
export type Json = Record<string, unknown>;

// ── 15.1 users ─────────────────────────────────────────────────────────

export interface UserRow {
  id: UUID;
  auth_provider: AuthProvider;
  /** nullable: Kakao 계정에 이메일이 없거나 provider별로 미제공일 수 있음 (008, ADR-019). */
  email: string | null;
  nickname: string | null;
  plan_type: PlanCode;
  /** CHECK (token_balance >= 0) — 음수 잔액 backstop (ADR-014). */
  token_balance: number;
  role: UserRole;
  created_at: Timestamptz;
  updated_at: Timestamptz;
}

// ── 15.2 looks ─────────────────────────────────────────────────────────

export interface LookRow {
  id: UUID;
  title: string | null;
  base_prompt: string;
  /** Supabase Storage 경로/서명 URL만. OpenAI 임시 URL 저장 금지 (DATA_MODEL §15.2). */
  generated_image_url: string;
  season: Season | null;
  situation_tags: string[];
  mood_tags: string[];
  color_tags: string[];
  fit_tags: string[];
  target_user_tags: string[];
  visibility: Visibility;
  is_curated: boolean;
  created_by: UUID | null;
  created_at: Timestamptz;
  updated_at: Timestamptz;
}

// ── 15.3 products ──────────────────────────────────────────────────────

export interface ProductRow {
  id: UUID;
  product_name: string;
  brand_name: string | null;
  source_platform: SourcePlatform | null;
  product_url: string;
  image_url: string;
  price: number | null;
  category: Category;
  subcategory: string | null;
  color: string | null;
  fit: Fit | null;
  material: string | null;
  mood_tags: string[];
  season_tags: string[];
  situation_tags: string[];
  /** 부트스트랩 002에서 확정되는 캡션 컬럼 (AI_PIPELINE §2·§9, DATA_MODEL §15.3 메모). */
  caption_simple?: string | null;
  caption_searchable?: string | null;
  created_at: Timestamptz;
  updated_at: Timestamptz;
}

// ── 15.4 look_products ─────────────────────────────────────────────────

export interface LookProductRow {
  id: UUID;
  look_id: UUID;
  product_id: UUID;
  item_role: ItemRole;
  recommendation_type: RecommendationType;
  sort_order: number;
  created_at: Timestamptz;
}

// ── 15.5 saved_looks ───────────────────────────────────────────────────

export interface SavedLookRow {
  id: UUID;
  user_id: UUID;
  look_id: UUID;
  visibility: Visibility;
  created_at: Timestamptz;
}

// ── 15.6 generation_history ────────────────────────────────────────────

export interface GenerationHistoryRow {
  id: UUID;
  user_id: UUID;
  prompt: string;
  interpreted_prompt_id: UUID | null;
  generated_look_id: UUID | null;
  status: GenerationStatus;
  /** mini-action turn 추적 (ADR-009). */
  parent_history_id: UUID | null;
  trigger_type: TriggerType;
  /** B/A 분기 telemetry (UI 비노출, ADR-012). */
  pipeline_source: PipelineSource | null;
  /** B-path 최고 매칭 가중합 점수 (임계값 0.70, AI_PIPELINE §4). */
  match_score: number | null;
  created_at: Timestamptz;
}

// ── 15.7 prompt_intents ────────────────────────────────────────────────

export interface PromptIntentRow {
  id: UUID;
  user_id: UUID;
  raw_prompt: string;
  /** LLM 파싱 결과 전체 (parsed_json). 구조는 DATA_MODEL §15.7 예시 참조. */
  parsed_json: Json;
  season: string | null;
  situation_tags: string[];
  mood_tags: string[];
  budget: number | null;
  created_at: Timestamptz;
}

// ── 15.8 token_transactions ────────────────────────────────────────────

export interface TokenTransactionRow {
  id: UUID;
  user_id: UUID;
  transaction_type: TransactionType;
  /** spend는 음수, grant는 양수. 모든 generation spend = -10 (ADR-012). */
  amount: number;
  reason: string;
  related_generation_id: UUID | null;
  /** X-Idempotency-Key. unique(user_id, idempotency_key) (ADR-014). cron 거래는 null. */
  idempotency_key: string | null;
  created_at: Timestamptz;
}

// ── 15.9 plans ─────────────────────────────────────────────────────────

export interface PlanRow {
  code: PlanCode;
  display_name: string;
  monthly_token_grant: number;
  monthly_price_krw: number;
  /** null = 무제한 (Max). free/Pro = 5 누적 슬롯. */
  max_saved_looks: number | null;
  features: Json;
  is_active: boolean;
  created_at: Timestamptz;
}

// ── 15.10 payments (V0 Extended) ───────────────────────────────────────

export interface PaymentRow {
  id: UUID;
  user_id: UUID;
  plan_code: PlanCode;
  provider: string;
  provider_payment_id: string;
  amount_krw: number;
  status: PaymentStatus;
  paid_at: Timestamptz | null;
  created_at: Timestamptz;
}
