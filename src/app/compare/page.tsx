import Link from "next/link";

// 디자인 비교 chooser — 베이스라인(현행) / Variant A / Variant B를 한자리에서 진입.
// 루트 /는 베이스라인 그대로 보존(smoke 테스트·비교 기준). 이 페이지가 탐색 허브.
// 탐색용 임시 라우트(최종 선택 시 이긴 쪽을 /로 승격, 나머지·이 페이지 삭제).

const OPTIONS = [
  {
    key: "baseline",
    title: "현행 (Baseline)",
    desc: "현재 v0.8 디자인 — 비교 기준선",
    landing: "/",
    studio: "/studio",
  },
  {
    key: "a",
    title: "Variant A — 끌어올린 베이스라인",
    desc: "I.F 정체성 유지 + 피드백 4건 + 레퍼런스 차용",
    landing: "/a",
    studio: "/a/studio",
  },
  {
    key: "b",
    title: "Variant B — 레퍼런스 주도 재설계",
    desc: "trionn·magnific 골격으로 새 시각 언어",
    landing: "/b",
    studio: "/b/studio",
  },
];

export default function ComparePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[900px] flex-col justify-center gap-8 px-6 py-16">
      <header>
        <p className="text-t7 font-extrabold uppercase tracking-[0.18em] text-muted">
          Design Comparison
        </p>
        <h1 className="mt-2 text-t2 font-extrabold">두 디자인 버전 비교</h1>
        <p className="mt-3 max-w-[52ch] text-t5 text-ink-soft">
          현행과 두 시안을 각각 열어 비교하세요. 랜딩과 스튜디오를 따로 볼 수 있습니다.
        </p>
      </header>

      <ul className="grid gap-4">
        {OPTIONS.map((o) => (
          <li
            key={o.key}
            className="rounded-2xl border border-line bg-cream/40 p-6 shadow-[0_0_60px_rgba(34,34,34,0.06)]"
          >
            <h2 className="text-t3 font-extrabold">{o.title}</h2>
            <p className="mt-1 text-t6 text-ink-soft">{o.desc}</p>
            <div className="mt-4 flex gap-3">
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
    </main>
  );
}
