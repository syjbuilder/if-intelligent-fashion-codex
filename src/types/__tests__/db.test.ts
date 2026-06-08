import { describe, it, expect } from "vitest";
import {
  CATEGORIES,
  SEASONS,
  FITS,
  ITEM_ROLES,
  RECOMMENDATION_TYPES,
  PLAN_CODES,
  VISIBILITIES,
  AUTH_PROVIDERS,
  USER_ROLES,
  SOURCE_PLATFORMS,
  GENERATION_STATUSES,
  TRIGGER_TYPES,
  PIPELINE_SOURCES,
  TRANSACTION_TYPES,
  PAYMENT_STATUSES,
} from "../db";

describe("db.ts 닫힌 enum 상수 (DATA_MODEL §15 정합)", () => {
  it("category = top/bottom/dress/outer (§15.3)", () => {
    expect(CATEGORIES).toEqual(["top", "bottom", "dress", "outer"]);
  });

  it("season = 4계절 + all (§15.2)", () => {
    expect(SEASONS).toEqual(["spring", "summer", "fall", "winter", "all"]);
  });

  it("fit 단일값 = slim/regular/oversized (§15.3)", () => {
    expect(FITS).toEqual(["slim", "regular", "oversized"]);
  });

  it("item_role (§15.4)", () => {
    expect(ITEM_ROLES).toEqual([
      "main_top",
      "main_bottom",
      "main_outer",
      "similar",
      "related",
    ]);
  });

  it("recommendation_type (§15.4)", () => {
    expect(RECOMMENDATION_TYPES).toEqual(["main_combo", "similar", "related"]);
  });

  it("plan_code (§15.9)", () => {
    expect(PLAN_CODES).toEqual(["free", "pro", "max"]);
  });

  it("source_platform 3종 (§15.3 · SOP §9-0)", () => {
    expect(SOURCE_PLATFORMS).toEqual(["29CM", "MUSINSA", "브랜드자사몰"]);
  });

  it("trigger_type — mini-action (§15.6 · ADR-009)", () => {
    expect(TRIGGER_TYPES).toEqual([
      "fresh",
      "regenerate",
      "chip_refine",
      "more_like_this",
    ]);
  });

  it("transaction_type (§15.8)", () => {
    expect(TRANSACTION_TYPES).toEqual(["grant", "spend", "refund", "expire"]);
  });

  it("pipeline_source — telemetry (§15.6)", () => {
    expect(PIPELINE_SOURCES).toEqual(["curated_only", "mixed", "generated_only"]);
  });

  it("나머지 enum 길이 점검", () => {
    expect(VISIBILITIES).toHaveLength(2);
    expect(AUTH_PROVIDERS).toHaveLength(3);
    expect(USER_ROLES).toHaveLength(2);
    expect(GENERATION_STATUSES).toHaveLength(3);
    expect(PAYMENT_STATUSES).toHaveLength(4);
  });
});
