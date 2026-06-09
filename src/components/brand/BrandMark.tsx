// 브랜드 락업 'IF' + 'INTELLIGENT FASHION'. topbar 중앙·studio 헤더·footer 공통.
// 색은 currentColor 상속(다크/라이트 영역 모두 사용) → 부모가 text-* 지정.
export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`}>
      <strong className="text-[24px] font-extrabold tracking-tightest">IF</strong>
      <span className="mt-1 text-[9px] font-extrabold uppercase tracking-brand opacity-70">
        INTELLIGENT FASHION
      </span>
    </span>
  );
}
