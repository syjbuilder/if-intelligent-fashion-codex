"use client";

import { BrandMark } from "@/components/brand/BrandMark";

/**
 * Variant B 푸터 — B 다크 톤. 약관/개인정보/문의 + 회사 정보(placeholder) + 어필리에이트 고지 + 저작권.
 * 공유 SiteFooter(A/baseline·라이트)와 분리해 회귀 위험 0. 코랄은 hover에서만(평상시 액센트 예산 보호).
 */
export function SiteFooterB({
  onOpenTerms,
  onOpenPrivacy,
}: {
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
}) {
  return (
    <footer className="bg-b-ink px-6 pb-14 pt-[90px] text-b-light/80 md:px-gutter">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-12 md:grid-cols-[minmax(220px,1fr)_auto]">
        <div>
          <BrandMark className="!items-start text-b-light" />
          <p className="mt-5 max-w-[30ch] text-left text-t4 text-b-light/70">
            상상하면, 입을 수 있다 — 여러 온라인몰을 가로지르는 독립형 AI 패션 탐색 레이어.
          </p>
        </div>

        <nav className="flex flex-col gap-3 text-t6 md:items-end">
          <button
            type="button"
            onClick={onOpenTerms}
            className="text-left transition-colors hover:text-b-accent"
          >
            이용약관
          </button>
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="text-left transition-colors hover:text-b-accent"
          >
            개인정보처리방침
          </button>
          <a
            href="mailto:hello@if-fashion.kr"
            className="transition-colors hover:text-b-accent"
          >
            문의
          </a>
        </nav>

        <p className="border-t border-b-line pt-8 text-left text-t7 leading-relaxed text-b-light/55 md:col-span-2">
          I.F는 무신사·29CM·지그재그·에이블리·네이버쇼핑 등 외부 온라인몰의 상품을 소개하며,
          자체 결제를 제공하지 않습니다. 구매는 각 몰에서 이루어지는 제휴(어필리에이트) 구조입니다.
        </p>
        <p className="text-t8 leading-relaxed text-b-light/45 md:col-span-2">
          회사명 (주)아이에프 · 대표 OOO · 사업자번호 000-00-00000 · 통신판매업 2026-서울OO-0000 ·
          주소 서울특별시 OO구 OO로 00 (placeholder — 정식 정보 확정 시 교체)
        </p>
        <p className="text-t7 text-b-light/40 md:col-span-2">
          © 2026 IF (Intelligent Fashion)
        </p>
      </div>
    </footer>
  );
}
