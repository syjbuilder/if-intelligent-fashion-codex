// 규칙 기반 한국어 의도 파서 (형태소분석기 없이, 결정적).
// longest-match 스캔 + 접미/불용어 정리 + 예산 정규식. 설계: _matcher-design-stage1.md §2.2.
// LLM 파싱 도입 시 같은 Intent 타입 뒤에서 이 함수만 교체된다.

import type { Season } from "@/types/db";
import type {
  ColorGroup,
  Emission,
  Intent,
  IntentDictionary,
  ItemGroup,
  MatchedTerm,
} from "./types";
import { STAGE1_DICTIONARY } from "./dictionary";

const STOPWORDS = new Set([
  "가는", "가서", "갈때", "갈", "입을", "입는", "입고", "입기", "할", "하는", "나는",
  "옷", "좀", "그리고", "및", "너무", "약간", "조금", "스타일", "코디", "무드", "느낌", "톤", "분위기",
  "에", "로", "으로", "와", "과", "때", "가", "이", "를", "을", "은", "는", "의",
]);
// leftover(미매칭 잔여)에서 떼는 접미/어미. 긴 것부터.
const STRIP_TAILS = ["스러운", "스럽게", "하는", "하게", "스타일", "코디", "무드", "느낌", "톤", "룩", "한", "인", "의"].sort(
  (a, b) => b.length - a.length,
);

// 사전 컴파일 (참조 기준 메모이즈)
let compiledFor: IntentDictionary | null = null;
let compiledMap = new Map<string, Emission[]>();
let compiledSorted: string[] = [];
function compile(dict: IntentDictionary): { map: Map<string, Emission[]>; sorted: string[] } {
  if (compiledFor === dict) return { map: compiledMap, sorted: compiledSorted };
  const map = new Map<string, Emission[]>();
  for (const e of dict) map.set(e.surface, e.emit);
  const sorted = [...map.keys()].sort((a, b) => b.length - a.length); // longest-match
  compiledFor = dict;
  compiledMap = map;
  compiledSorted = sorted;
  return { map, sorted };
}

function normalize(raw: string): string {
  return raw
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[.,!?~·\/()[\]{}"'|:;_\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractBudget(text: string): { budget: number | null; rest: string } {
  const m = text.match(/(\d+)\s*만\s*원?\s*(이하|이내|미만|아래|까지|대)?/);
  if (!m || m.index === undefined) return { budget: null, rest: text };
  const n = parseInt(m[1], 10);
  const budget = m[2] === "대" ? (n + 1) * 10000 : n * 10000;
  const rest = (text.slice(0, m.index) + " " + text.slice(m.index + m[0].length)).replace(/\s+/g, " ").trim();
  return { budget, rest };
}

function cleanLeftover(s: string): string {
  let cur = s;
  let changed = true;
  while (changed && cur.length > 0) {
    changed = false;
    for (const tail of STRIP_TAILS) {
      if (cur.endsWith(tail)) {
        cur = cur.slice(0, cur.length - tail.length);
        changed = true;
        break;
      }
    }
  }
  return cur;
}

function emitKey(em: Emission): string {
  switch (em.dim) {
    case "season":
      return em.keys.join("+");
    case "color":
    case "item":
      return em.label;
    default:
      return em.key;
  }
}

function pushUniq<T>(arr: T[], v: T): void {
  if (!arr.includes(v)) arr.push(v);
}

export function parseIntent(raw: string, dictionary: IntentDictionary = STAGE1_DICTIONARY): Intent {
  const { map, sorted } = compile(dictionary);
  const normalized = normalize(raw);
  const { budget, rest } = extractBudget(normalized);
  const tokens = rest.length ? rest.split(" ") : [];

  const emissions: Emission[] = [];
  const matchedTerms: MatchedTerm[] = [];
  const unknownTokens: string[] = [];

  for (const token of tokens) {
    if (!token || STOPWORDS.has(token)) continue;

    let pos = 0;
    let gap = "";
    const flushGap = () => {
      if (!gap) return;
      const cleaned = cleanLeftover(gap);
      if (cleaned && !STOPWORDS.has(cleaned)) unknownTokens.push(cleaned);
      gap = "";
    };

    while (pos < token.length) {
      let matched: string | null = null;
      for (const s of sorted) {
        if (token.startsWith(s, pos)) {
          matched = s;
          break;
        }
      }
      if (matched) {
        flushGap();
        for (const em of map.get(matched)!) {
          emissions.push(em);
          matchedTerms.push({ surface: matched, dimension: em.dim, key: emitKey(em) });
        }
        pos += matched.length;
      } else {
        gap += token[pos];
        pos += 1;
      }
    }
    flushGap();
  }

  // 방출 → Intent (차원별 dedupe, first-seen 순서)
  const seasons: Season[] = [];
  const situations: string[] = [];
  const moods: string[] = [];
  const fits: string[] = [];
  const colorGroups: ColorGroup[] = [];
  const items: ItemGroup[] = [];
  const seenColor = new Set<string>();
  const seenItem = new Set<string>();

  for (const em of emissions) {
    switch (em.dim) {
      case "season":
        for (const k of em.keys) pushUniq(seasons, k);
        break;
      case "situation":
        pushUniq(situations, em.key);
        break;
      case "mood":
        pushUniq(moods, em.key);
        break;
      case "fit":
        pushUniq(fits, em.key);
        break;
      case "color":
        if (!seenColor.has(em.label)) {
          seenColor.add(em.label);
          colorGroups.push({ label: em.label, keys: [...em.group] });
        }
        break;
      case "item": {
        const key = `${[...em.categories].sort().join(",")}|${[...em.subcategories].sort().join(",")}`;
        if (!seenItem.has(key)) {
          seenItem.add(key);
          items.push({ label: em.label, categories: [...em.categories], subcategories: [...em.subcategories] });
        }
        break;
      }
    }
  }

  return {
    raw,
    seasons,
    situations,
    moods,
    colorGroups,
    items,
    fits,
    budgetMaxKrw: budget,
    matchedTerms,
    unknownTokens,
  };
}
