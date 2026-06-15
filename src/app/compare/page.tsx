import Link from "next/link";

// 비교 허브 — 메인(/)은 이제 Variant B다. 현행/A를 나란히 비교하려면 여기서 진입.
// 탐색용 임시 페이지(최종 정리 시 제거 가능).

const OPTIONS = [
  {
    key: "main-b",
    title: "현재 메인 = Variant B",
    desc: "선택된 방향(다크+코랄). localhost:3000 기본 화면.",
    landing: "/",
    landingLabel: "메인(B) 랜딩 →",
    studio: "/studio",
    studioLabel: "메인(B) 스튜디오 →",
  },
  {
    key: "a",
    title: "Variant A (보존)",
    desc: "끌어올린 베이스라인 — Ink Violet. 보존됨, 언제든 비교 가능.",
    landing: "/a",
    landingLabel: "A 랜딩",
    studio: "/a/studio",
    studioLabel: "A 스튜디오",
  },
  {
    key: "baseline",
    title: "현행 (보존)",
    desc: "바뀌기 전 v0.8 디자인.",
    landing: "/baseline",
    landingLabel: "현행 랜딩",
    studio: "/baseline/studio",
    studioLabel: "현행 스튜디오",
  },
];

export default function ComparePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[900px] flex-col justify-center gap-8 px-6 py-16">
      <header>
        <p className="text-t7 font-extrabold uppercase tracking-[0.18em] text-muted">
          Design Compare
        </p>
        <h1 className="mt-2 text-t2 font-extrabold">버전 비교</h1>
        <p className="mt-3 max-w-[56ch] text-t5 text-ink-soft">
          메인 화면(localhost:3000)은 이제 Variant B입니다. A와 현행은 보존돼 있어 여기서 비교할 수 있어요.
        </p>
      </header>

      <ul className="grid gap-4">
        {OPTIONS.map((o) => (
          <li
            key={o.key}
            className="rounded-2xl border border-line bg-cream/40 p-6"
          >
            <h2 className="text-t3 font-extrabold">{o.title}</h2>
            <p className="mt-1 text-t6 text-ink-soft">{o.desc}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={o.studio}
                className="inline-flex min-h-[48px] items-center rounded-full bg-ink px-6 text-t6 font-extrabold uppercase tracking-[0.12em] text-white-soft transition-transform hover:-translate-y-0.5"
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
    </main>
  );
}
