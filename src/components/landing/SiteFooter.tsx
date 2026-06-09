"use client";

import { BrandMark } from "@/components/brand/BrandMark";

/** 다크 footer — 브랜드 + 링크(약관 모달 트리거/문의) + 어필리에이트 고지 + 카피. */
export function SiteFooter({
  onOpenTerms,
  onOpenPrivacy,
}: {
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
}) {
  return (
    <footer className="bg-ink px-[34px] pb-14 pt-[90px] text-white-soft/80">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-12 md:grid-cols-[minmax(220px,1fr)_auto]">
        <div>
          <BrandMark className="!items-start text-white-soft" />
          <p className="mt-5 max-w-[30ch] text-left text-t4 text-white-soft/70">
            Style your Imagination. — 여러 온라인몰을 가로지르는 독립형 AI 패션 탐색 레이어.
          </p>
        </div>

        <nav className="flex flex-col gap-3 text-t6 md:items-end">
          <button
            type="button"
            onClick={onOpenTerms}
            className="text-left transition-opacity hover:opacity-70 md:text-right"
          >
            이용약관
          </button>
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="text-left transition-opacity hover:opacity-70 md:text-right"
          >
            개인정보처리방침
          </button>
          <a
            href="mailto:hello@if-fashion.kr"
            className="transition-opacity hover:opacity-70 md:text-right"
          >
            문의
          </a>
        </nav>

        <p className="max-w-[820px] border-t border-white/10 pt-8 text-left text-t7 leading-relaxed text-white-soft/55 md:col-span-2">
          I.F는 무신사·29CM·지그재그·에이블리·네이버쇼핑 등 외부 온라인몰의 상품을 소개하며, 일부
          링크를 통한 구매 시 제휴 수수료를 받을 수 있습니다. 상품 결제·배송·교환은 각 판매처 정책을
          따릅니다.
        </p>
        <p className="text-t7 text-white-soft/40 md:col-span-2">
          © 2026 IF (Intelligent Fashion)
        </p>
      </div>
    </footer>
  );
}
