import Link from "next/link";

// 루트 = 디자인 비교 허브(프론트 도어). localhost:3000을 열면 여기로 진입해
// 현행/Variant A/Variant B를 하나씩 열어 비교한다. 현행 랜딩은 /baseline로 보존.
// 탐색용 임시 허브 — 최종 선택 시 이긴 쪽을 /로 승격하고 이 허브는 제거.

type Status = "ready" | "building";

const OPTIONS: {
  key: string;
  title: string;
  desc: string;
  points: string[];
  landing: string;
  studio: string;
  status: Status;
}[] = [
  {
    key: "baseline",
    title: "현행 (지금 디자인)",
    desc: "비교 기준선 — 바뀌기 전 v0.8 디자인 그대로.",
    points: ["바뀐 점 없음 (기준)"],
    landing: "/baseline",
    studio: "/studio",
    status: "ready",
  },
  {
    key: "a",
    title: "Variant A — 지금 디자인을 끌어올린 안",
    desc: "지금 정체성(Ink Violet·마네킹)을 유지하면서 피드백 4건 + 레퍼런스 완성도를 반영.",
    points: [
      "프롬프트 창: 화면 중앙 하단에 떠 있는 글래스 바(아이폰 느낌)",
      "룩 클릭 → '자세히보기' → 왼쪽으로 확대, '상품 보기' 누르면 오른쪽에서 상품 패널",
      "결과·상세 화면에도 프롬프트 입력창이 계속 보임",
      "모든 룩 칸이 실제 마네킹 사진으로 채워짐",
    ],
    landing: "/a",
    studio: "/a/studio",
    status: "ready",
  },
  {
    key: "b",
    title: "Variant B — 레퍼런스로 새로 잡은 안",
    desc: "지금 디자인을 버리고 trionn·magnific 레퍼런스로 다시 설계 (다크 톤·코랄 포인트·다이나믹 모션).",
    points: ["제작 중 — 지금 열면 아직 현행과 동일하게 보입니다"],
    landing: "/b",
    studio: "/b/studio",
    status: "building",
  },
];

export default function CompareHub() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[940px] flex-col justify-center gap-8 px-6 py-16">
      <header>
        <p className="text-t7 font-extrabold uppercase tracking-[0.18em] text-muted">
          Design Review
        </p>
        <h1 className="mt-2 text-t2 font-extrabold">디자인 비교 — 하나씩 열어보세요</h1>
        <p className="mt-3 max-w-[58ch] text-t5 text-ink-soft">
          현행과 두 시안을 각각 새로 열어 비교할 수 있어요. 각 버전마다 랜딩과
          스튜디오(작업 화면)를 따로 볼 수 있습니다.
        </p>
      </header>

      <ul className="grid gap-4">
        {OPTIONS.map((o) => (
          <li
            key={o.key}
            className="rounded-2xl border border-line bg-cream/40 p-6 shadow-[0_0_60px_rgba(34,34,34,0.06)]"
          >
            <div className="flex items-center gap-3">
              <h2 className="text-t3 font-extrabold">{o.title}</h2>
              {o.status === "building" && (
                <span className="rounded-full bg-ink/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink-soft">
                  제작 중
                </span>
              )}
            </div>
            <p className="mt-1 text-t6 text-ink-soft">{o.desc}</p>
            <ul className="mt-3 flex flex-col gap-1.5">
              {o.points.map((p) => (
                <li
                  key={p}
                  className="flex gap-2 text-t6 text-ink-soft before:text-accent before:content-['—']"
                >
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex gap-3">
              <Link
                href={o.landing}
                className="inline-flex min-h-[48px] items-center rounded-full bg-ink px-6 text-t6 font-extrabold uppercase tracking-[0.12em] text-white-soft transition-transform hover:-translate-y-0.5"
              >
                랜딩 보기
              </Link>
              <Link
                href={o.studio}
                className="inline-flex min-h-[48px] items-center rounded-full border border-ink/20 px-6 text-t6 font-extrabold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-cream"
              >
                스튜디오 보기
              </Link>
            </div>
          </li>
        ))}
      </ul>

      <p className="text-t7 text-muted">
        팁: 각 화면 좌상단 메뉴/뒤로가기로 이 허브(localhost:3000)에 다시 올 수 있어요.
      </p>
    </main>
  );
}
