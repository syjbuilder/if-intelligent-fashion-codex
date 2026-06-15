import Link from "next/link";

// 루트 = 디자인 비교 허브(프론트 도어). localhost:3000을 열면 여기로 진입.
// 현행 랜딩은 /baseline로 보존. 탐색용 임시 허브 — 최종 선택 시 이긴 쪽을 /로 승격.

type Status = "recommended" | "ready" | "building";

const OPTIONS: {
  key: string;
  title: string;
  badge?: string;
  desc: string;
  points: string[];
  landing: string;
  landingLabel: string;
  studio: string;
  studioLabel: string;
  status: Status;
}[] = [
  {
    key: "a",
    title: "Variant A — 지금 디자인을 끌어올린 안",
    badge: "먼저 보세요",
    desc: "지금 정체성(Ink Violet·마네킹)을 유지하면서 피드백 4건 + 레퍼런스 완성도를 반영. ← 이번에 새로 만든 것.",
    points: [
      "① 프롬프트 창: 화면 중앙 하단에 떠 있는 글래스 바(아이폰 느낌)",
      "④ 모든 룩 칸이 실제 마네킹 사진 — 스튜디오 들어가면 바로 보임",
      "② ③ 보는 법: 스튜디오에서 아무 문장이나 입력 → ↑ 클릭 → 잠시 후 룩 3장 → 룩을 클릭(자세히보기)하면 왼쪽으로 확대 + '상품 보기' 누르면 오른쪽 상품 패널, 화면에 프롬프트 입력창 계속 유지",
    ],
    landing: "/a",
    landingLabel: "Variant A 랜딩 →",
    studio: "/a/studio",
    studioLabel: "Variant A 스튜디오 →",
    status: "recommended",
  },
  {
    key: "baseline",
    title: "현행 (지금 디자인)",
    desc: "비교 기준선 — 바뀌기 전 v0.8 디자인 그대로. (변경 없음)",
    points: ["바뀐 점 없음 — Variant A와 비교용"],
    landing: "/baseline",
    landingLabel: "현행 랜딩",
    studio: "/studio",
    studioLabel: "현행 스튜디오",
    status: "ready",
  },
  {
    key: "b",
    title: "Variant B — 레퍼런스로 새로 잡은 안",
    desc: "지금 디자인을 버리고 trionn·magnific 레퍼런스로 다시 설계 (다크 톤·코랄 포인트·다이나믹 모션).",
    points: [
      "랜딩: 다크+코랄 키네틱 히어로 + 가로 룩 레일",
      "스튜디오: 같은 흐름(프롬프트→룩→상세→상품)을 다크+코랄로 — A와 동일 기능, 다른 무드",
    ],
    landing: "/b",
    landingLabel: "Variant B 랜딩 →",
    studio: "/b/studio",
    studioLabel: "Variant B 스튜디오 →",
    status: "ready",
  },
];

const BADGE_CLASS: Record<string, string> = {
  recommended:
    "rounded-full bg-accent px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-white-soft",
  building:
    "rounded-full bg-ink/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink-soft",
};

export default function CompareHub() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[940px] flex-col justify-center gap-8 px-6 py-16">
      <header>
        <p className="text-t7 font-extrabold uppercase tracking-[0.18em] text-muted">
          Design Review
        </p>
        <h1 className="mt-2 text-t2 font-extrabold">디자인 비교 — 하나씩 열어보세요</h1>
        <p className="mt-3 max-w-[58ch] text-t5 text-ink-soft">
          맨 위 <b>Variant A</b>가 이번에 새로 만든 것입니다. 각 버전마다 랜딩과
          스튜디오(작업 화면)를 따로 볼 수 있어요.
        </p>
      </header>

      <ul className="grid gap-4">
        {OPTIONS.map((o) => (
          <li
            key={o.key}
            className={`rounded-2xl border p-6 ${
              o.status === "recommended"
                ? "border-accent/40 bg-cream/60 shadow-[0_0_60px_rgba(73,71,110,0.12)]"
                : "border-line bg-cream/30"
            }`}
          >
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-t3 font-extrabold">{o.title}</h2>
              {o.badge && (
                <span className={BADGE_CLASS[o.status] ?? BADGE_CLASS.building}>
                  {o.badge}
                </span>
              )}
              {o.status === "building" && (
                <span className={BADGE_CLASS.building}>제작 중</span>
              )}
            </div>
            <p className="mt-1 text-t6 text-ink-soft">{o.desc}</p>
            <ul className="mt-3 flex flex-col gap-1.5">
              {o.points.map((p) => (
                <li key={p} className="text-t6 leading-relaxed text-ink-soft">
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={o.studio}
                className={`inline-flex min-h-[48px] items-center rounded-full px-6 text-t6 font-extrabold uppercase tracking-[0.12em] transition-transform hover:-translate-y-0.5 ${
                  o.status === "recommended"
                    ? "bg-accent text-white-soft"
                    : "bg-ink text-white-soft"
                }`}
              >
                {o.studioLabel}
              </Link>
              <Link
                href={o.landing}
                className="inline-flex min-h-[48px] items-center rounded-full border border-ink/20 px-6 text-t6 font-extrabold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-cream"
              >
                {o.landingLabel}
              </Link>
            </div>
          </li>
        ))}
      </ul>

      <p className="text-t7 text-muted">
        팁: 각 화면 좌상단 메뉴/로고로 이 허브(localhost:3000)에 다시 올 수 있어요.
      </p>
    </main>
  );
}
