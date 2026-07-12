import { describe, it, expect } from "vitest";
import { parseIntent } from "../parse";

describe("parseIntent", () => {
  it("데모 적중: '봄 데이트룩, 파스텔 미니멀'", () => {
    const i = parseIntent("봄 데이트룩, 파스텔 미니멀");
    expect(i.seasons).toEqual(["spring"]);
    expect(i.situations).toEqual(["date"]); // '데이트' 매칭 + '룩' 접미 drop
    expect(i.moods).toEqual(["minimal"]);
    expect(i.colorGroups).toHaveLength(1);
    expect(i.colorGroups[0].label).toBe("파스텔");
    expect(i.colorGroups[0].keys).toContain("light_blue");
    expect(i.items).toEqual([]);
    expect(i.fits).toEqual([]);
    expect(i.budgetMaxKrw).toBeNull();
    expect(i.unknownTokens).toEqual([]);
  });

  it("무매칭 데모: '피크닉 가는 스트릿룩' — 파싱은 성공(0점은 매칭기 몫)", () => {
    const i = parseIntent("피크닉 가는 스트릿룩");
    expect(i.situations).toEqual(["picnic"]);
    expect(i.moods).toEqual(["street"]); // '스트릿' + '룩' drop
    expect(i.seasons).toEqual([]);
    expect(i.colorGroups).toEqual([]);
    expect(i.unknownTokens).toEqual([]); // '가는'은 불용어
  });

  it("longest-match: '파스텔블루 원피스' → powder_blue(파스텔+블루 아님)", () => {
    const i = parseIntent("파스텔블루 원피스");
    expect(i.colorGroups).toHaveLength(1);
    expect(i.colorGroups[0].keys).toEqual(["powder_blue"]);
    expect(i.items[0].categories).toEqual(["dress"]);
  });

  it("멀티 방출: '장마철 출근룩' → summer + rainy_day + work", () => {
    const i = parseIntent("장마철 출근룩");
    expect(i.seasons).toEqual(["summer"]);
    expect(i.situations).toContain("rainy_day");
    expect(i.situations).toContain("work");
  });

  it("간절기 → {spring, fall}", () => {
    expect(parseIntent("간절기 데일리").seasons).toEqual(["spring", "fall"]);
  });

  it("예산: '5만원 이하' → 50000, '3만원대' → 40000", () => {
    expect(parseIntent("니트 5만원 이하").budgetMaxKrw).toBe(50000);
    expect(parseIntent("니트 3만원대").budgetMaxKrw).toBe(40000);
  });

  it("noSignal: 미지의 입력은 unknownTokens로", () => {
    const i = parseIntent("ㅁㄴㅇㄹ");
    expect(i.seasons).toEqual([]);
    expect(i.situations).toEqual([]);
    expect(i.moods).toEqual([]);
    expect(i.colorGroups).toEqual([]);
    expect(i.items).toEqual([]);
    expect(i.unknownTokens.length).toBeGreaterThan(0);
  });

  it("결정성: 같은 입력 두 번 = 동일", () => {
    expect(parseIntent("봄 데이트 미니멀")).toEqual(parseIntent("봄 데이트 미니멀"));
  });

  it("dedupe: 반복 표현은 한 번만", () => {
    expect(parseIntent("미니멀 미니멀 니트").moods).toEqual(["minimal"]);
  });
});
