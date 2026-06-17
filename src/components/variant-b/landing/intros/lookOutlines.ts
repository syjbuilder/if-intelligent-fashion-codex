// 인트로 ② 전용 — 디테일 풀코디 라인 외곽(레퍼런스 if-daily-look-01~03). 코스모스 모핑 타깃.
// GARMENT_PATHS(office/date/sport)와 무관한 별도 자산(영향 격리). 신발 없음.
// 좌표: viewBox 0 0 200 280, 중심 x=100, 좌우 대칭. 상의 헴과 하의 시작이 단일 허리선(y≈152)에서 만남(겹침 해소).
// 절대 M/L/Q/C/Z만(평탄화 파서 단순화).

export type LookOutline = {
  name: string;
  prompt: string;
  viewBox: string;
  paths: string[];
};

const VIEWBOX = "0 0 200 280";

export const LOOK_OUTLINES: LookOutline[] = [
  {
    name: "가디건 · 와이드 데님",
    prompt: "데일리 가디건, 와이드 데님",
    viewBox: VIEWBOX,
    paths: [
      "M85 67 Q100 73 115 67", // 백넥 카라
      "M85 67 L62 64 L56 110 L60 152 L90 156", // 좌 가디건 패널
      "M115 67 L138 64 L144 110 L140 152 L110 156", // 우 가디건 패널
      "M90 156 L89 71", // 좌 프론트 엣지(오픈)
      "M110 156 L111 71", // 우 프론트 엣지(오픈)
      "M62 64 L46 120 Q45 129 53 130 L67 128 Q71 96 73 80", // 좌 소매
      "M138 64 L154 120 Q155 129 147 130 L133 128 Q129 96 127 80", // 우 소매
      "M49 126 L66 124", // 좌 소매 리브
      "M151 126 L134 124", // 우 소매 리브
      "M62 148 L62 154 M70 149 L70 155 M80 150 L80 156", // 좌 헴 리브
      "M138 148 L138 154 M130 149 L130 155 M120 150 L120 156", // 우 헴 리브
      "M68 90 L66 150 M80 88 L79 153", // 좌 니트 컬럼
      "M132 90 L134 150 M120 88 L121 153", // 우 니트 컬럼
      "M90 73 Q100 81 110 73 L109 150 L91 150 Z", // 이너 캐미
      "M84 152 L74 252 L98 254 L100 186", // 좌 데님 다리
      "M116 152 L126 252 L102 254 L100 186", // 우 데님 다리
      "M100 152 L100 186", // 센터 라이즈
      "M86 172 L84 250", // 좌 크리스
      "M114 172 L116 250", // 우 크리스
      "M85 154 Q92 158 92 167", // 좌 포켓
      "M115 154 Q108 158 108 167", // 우 포켓
    ],
  },
  {
    name: "블레이저 · 와이드 슬랙스",
    prompt: "오피스 블레이저 셋업",
    viewBox: VIEWBOX,
    paths: [
      "M70 64 L60 66 L57 118 L61 154 L97 158", // 좌 블레이저 바디
      "M130 64 L140 66 L143 118 L139 154 L103 158", // 우 블레이저 바디
      "M70 64 L86 70 L92 108 L96 150", // 좌 라펠
      "M130 64 L114 70 L108 108 L104 150", // 우 라펠
      "M86 70 L84 62 L74 64", // 좌 노치 카라
      "M114 70 L116 62 L126 64", // 우 노치 카라
      "M60 66 L46 124 Q45 133 53 134 L67 132 Q70 98 72 82", // 좌 소매
      "M140 66 L154 124 Q155 133 147 134 L133 132 Q130 98 128 82", // 우 소매
      "M52 130 L64 128", // 좌 커프
      "M148 130 L136 128", // 우 커프
      "M68 140 L86 142 L85 148 L68 146", // 좌 포켓 플랩
      "M132 140 L114 142 L115 148 L132 146", // 우 포켓 플랩
      "M99 120 L99 122 M99 135 L99 137", // 프론트 버튼
      "M92 72 Q100 78 108 72 L107 150 L93 150", // 이너 탑
      "M84 152 L76 250 L98 252 L100 196", // 좌 슬랙스 다리
      "M116 152 L124 250 L102 252 L100 196", // 우 슬랙스 다리
      "M100 152 L100 196", // 센터 라이즈
      "M89 156 L86 248", // 좌 크리스
      "M111 156 L114 248", // 우 크리스
    ],
  },
  {
    name: "셔츠 · 미디 스커트",
    prompt: "셔츠 레이어드, 미디 스커트",
    viewBox: VIEWBOX,
    paths: [
      "M88 64 L82 58 L76 62 L74 66", // 좌 카라 포인트
      "M112 64 L118 58 L124 62 L126 66", // 우 카라 포인트
      "M88 64 Q100 68 112 64", // 카라 스탠드
      "M74 66 L66 70 L64 118 L67 150 L98 153", // 좌 셔츠 바디
      "M126 66 L134 70 L136 118 L133 150 L102 153", // 우 셔츠 바디
      "M98 153 L94 68", // 좌 플래킷 엣지
      "M102 153 L106 68", // 우 플래킷 엣지
      "M100 70 L100 150", // 센터 플래킷
      "M100 82 L100 84 M100 96 L100 98 M100 110 L100 112 M100 124 L100 126 M100 138 L100 140", // 버튼
      "M66 70 L50 114 L48 122 L60 126 L64 118 Q66 98 70 84", // 좌 롤업 소매
      "M134 70 L150 114 L152 122 L140 126 L136 118 Q134 98 130 84", // 우 롤업 소매
      "M48 120 L62 124 M50 116 L62 120", // 좌 롤 커프
      "M152 120 L138 124 M150 116 L138 120", // 우 롤 커프
      "M76 94 L86 94 L86 102 L76 102 Z", // 좌 체스트 포켓
      "M92 70 Q100 75 108 70 L108 150 L92 150", // 이너 탑
      "M80 150 L120 150 L120 157 L80 157 Z", // 벨트
      "M96 150 L104 150 L104 157 L96 157 Z", // 버클
      "M82 157 L66 252", // 스커트 좌 사이드
      "M118 157 L134 252", // 스커트 우 사이드
      "M66 252 Q100 260 134 252", // 스커트 헴
      "M90 159 L80 250 M100 159 L100 254 M110 159 L120 250", // 플리츠
      "M84 158 L72 251 M116 158 L128 251", // 외곽 플리츠
    ],
  },
];

const SEG = 12; // Q/C 분할 수

/** 절대 M/L/Q/C/Z path d → 폴리라인 배열(서브패스별). 상대좌표·arc 미지원(데이터에서 안 씀). */
export function flattenPath(d: string): [number, number][][] {
  const tokens = d.match(/[MLQCZmlqcz]|-?\d*\.?\d+(?:e-?\d+)?/g) || [];
  const polys: [number, number][][] = [];
  let cur: [number, number][] | null = null;
  let start: [number, number] | null = null;
  let px = 0;
  let py = 0;
  let i = 0;
  const num = () => parseFloat(tokens[i++]);
  while (i < tokens.length) {
    const t = tokens[i++].toUpperCase();
    if (t === "M") {
      const x = num();
      const y = num();
      px = x;
      py = y;
      start = [x, y];
      cur = [[x, y]];
      polys.push(cur);
    } else if (t === "L") {
      const x = num();
      const y = num();
      px = x;
      py = y;
      cur?.push([x, y]);
    } else if (t === "Q") {
      const x1 = num();
      const y1 = num();
      const x = num();
      const y = num();
      for (let s = 1; s <= SEG; s++) {
        const u = s / SEG;
        const a = 1 - u;
        cur?.push([
          a * a * px + 2 * a * u * x1 + u * u * x,
          a * a * py + 2 * a * u * y1 + u * u * y,
        ]);
      }
      px = x;
      py = y;
    } else if (t === "C") {
      const x1 = num();
      const y1 = num();
      const x2 = num();
      const y2 = num();
      const x = num();
      const y = num();
      for (let s = 1; s <= SEG; s++) {
        const u = s / SEG;
        const a = 1 - u;
        cur?.push([
          a * a * a * px + 3 * a * a * u * x1 + 3 * a * u * u * x2 + u * u * u * x,
          a * a * a * py + 3 * a * a * u * y1 + 3 * a * u * u * y2 + u * u * u * y,
        ]);
      }
      px = x;
      py = y;
    } else if (t === "Z") {
      if (cur && start) cur.push([start[0], start[1]]);
    }
  }
  return polys;
}

/** 폴리라인들의 총 아크길이 균등 분포로 N개 점 샘플. */
export function samplePoints(
  polys: [number, number][][],
  n: number,
): [number, number][] {
  const segs: { a: [number, number]; b: [number, number]; len: number }[] = [];
  let total = 0;
  for (const poly of polys) {
    for (let i = 0; i < poly.length - 1; i++) {
      const a = poly[i];
      const b = poly[i + 1];
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (len > 0) {
        segs.push({ a, b, len });
        total += len;
      }
    }
  }
  const pts: [number, number][] = [];
  if (!segs.length) return pts;
  for (let k = 0; k < n; k++) {
    const d = (total * k) / Math.max(1, n - 1);
    let acc = 0;
    for (let s = 0; s < segs.length; s++) {
      const seg = segs[s];
      if (d <= acc + seg.len || s === segs.length - 1) {
        const t = seg.len ? (d - acc) / seg.len : 0;
        pts.push([
          seg.a[0] + (seg.b[0] - seg.a[0]) * t,
          seg.a[1] + (seg.b[1] - seg.a[1]) * t,
        ]);
        break;
      }
      acc += seg.len;
    }
  }
  return pts;
}

/** 한 룩의 모든 path를 평탄화·합쳐 N개 타깃 점 샘플. */
export function sampleLook(look: LookOutline, n: number): [number, number][] {
  const polys: [number, number][][] = [];
  for (const d of look.paths) polys.push(...flattenPath(d));
  return samplePoints(polys, n);
}
