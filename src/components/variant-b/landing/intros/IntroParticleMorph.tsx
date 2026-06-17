"use client";

import { useEffect, useRef } from "react";
import { LOOK_OUTLINES, sampleLook } from "./lookOutlines";

const N = 240; // 입자 수
// 상태기계 타이밍(ms): 구 회전 → 모핑 IN → 룩 HOLD → 모핑 OUT
const T_SPHERE = 3400;
const T_IN = 1200;
const T_HOLD = 2200;
const T_OUT = 1000;
const CYCLE = T_SPHERE + T_IN + T_HOLD + T_OUT;

const VB_W = 200;
const VB_H = 280;

// 피보나치 구 단위벡터(표면 균등 분포).
function fibSphere(n: number): [number, number, number][] {
  const pts: [number, number, number][] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / Math.max(1, n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const th = phi * i;
    pts.push([Math.cos(th) * r, y, Math.sin(th) * r]);
  }
  return pts;
}

// 결정적 의사난수(Math.random 미사용).
function rnd(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
function easeInOut(u: number): number {
  return u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
}

/**
 * 인트로 ② — 코스모스 점-구체 ↔ 룩 모핑(canvas).
 * 흰/주황 점 ~240개가 피보나치 구 표면에서 3D로 회전(깊이 cue 5종 = z정렬·반경·밝기·원근·포그)하다가
 * 주기적으로 점만으로 데일리 룩 외곽을 형성(3룩 순환) 후 다시 흩어져 구로 복귀.
 * reduced/캔버스 미지원이면 정적 1프레임(리사이즈 시 재드로우). 컨테이너가 숨겨지면 루프 일시정지. 장식(aria-hidden).
 */
export function IntroParticleMorph({ reduced = false }: { reduced?: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return; // jsdom/미지원 가드
    const g = ctx;
    const wrapEl = wrap;
    const canvasEl = canvas;

    const sphere = fibSphere(N);
    // 대부분 표면 + 약간 내부 산란(볼륨감).
    const radiusFactor = sphere.map((_, i) => 0.74 + rnd(i) * 0.26);
    const orange = sphere.map((_, i) => rnd(i * 2.3 + 1) < 0.15);
    const lookTargets = LOOK_OUTLINES.map((l) => sampleLook(l, N));

    let W = 0;
    let H = 0;
    let cx = 0;
    let cy = 0;
    let sphereR = 0;
    let mapped: [number, number][][] = [];
    let raf = 0;
    let t0 = 0;
    let running = false;

    function render(elapsed: number) {
      if (W <= 0 || H <= 0) return;
      const cyclePos = elapsed % CYCLE;
      const lookIndex = Math.floor(elapsed / CYCLE) % LOOK_OUTLINES.length;
      let morphT = 0;
      if (cyclePos < T_SPHERE) morphT = 0;
      else if (cyclePos < T_SPHERE + T_IN)
        morphT = easeInOut((cyclePos - T_SPHERE) / T_IN);
      else if (cyclePos < T_SPHERE + T_IN + T_HOLD) morphT = 1;
      else morphT = 1 - easeInOut((cyclePos - T_SPHERE - T_IN - T_HOLD) / T_OUT);

      const rotY = elapsed * 0.00035;
      const rotX = 0.32;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const target = mapped[lookIndex] || [];

      g.clearRect(0, 0, W, H);

      const list: {
        x: number;
        y: number;
        r: number;
        a: number;
        o: boolean;
        z: number;
      }[] = [];
      for (let i = 0; i < N; i++) {
        const [ux, uy, uz] = sphere[i];
        const rf = radiusFactor[i];
        const x1 = ux * cosY + uz * sinY;
        const z1 = -ux * sinY + uz * cosY;
        const y2 = uy * cosX - z1 * sinX;
        const z2 = uy * sinX + z1 * cosX;
        const depth = (z2 + 1) / 2; // 0 뒤 .. 1 앞
        const pscale = 0.85 + depth * 0.3; // 원근 foreshorten
        const sx = cx + x1 * sphereR * rf * pscale;
        const sy = cy + y2 * sphereR * rf * pscale;
        const sr = 0.7 + depth * 1.7; // 반경 깊이
        const sa = 0.22 + depth * 0.78; // 알파 깊이
        let fx = sx;
        let fy = sy;
        let fr = sr;
        let fa = sa;
        const t = target[i];
        if (morphT > 0 && t) {
          fx = sx + (t[0] - sx) * morphT;
          fy = sy + (t[1] - sy) * morphT;
          fr = sr + (1.25 - sr) * morphT; // 룩 단계 균일 반경
          fa = sa + (0.96 - sa) * morphT;
        }
        list.push({ x: fx, y: fy, r: fr, a: fa, o: orange[i], z: depth });
      }
      // z 정렬(뒤→앞)
      list.sort((a, b) => a.z - b.z);
      for (const d of list) {
        g.globalAlpha = Math.max(0, Math.min(1, d.a));
        if (d.o) {
          g.fillStyle = "#f66950";
          g.shadowColor = "#f66950";
          g.shadowBlur = 6;
        } else {
          g.fillStyle = "#e9e9ec";
          g.shadowBlur = 0;
        }
        g.beginPath();
        g.arc(d.x, d.y, Math.max(0.3, d.r), 0, Math.PI * 2);
        g.fill();
      }
      g.globalAlpha = 1;
      g.shadowBlur = 0;
    }

    function frame(ts: number) {
      if (!t0) t0 = ts;
      render(ts - t0);
      if (W > 0 && H > 0) raf = requestAnimationFrame(frame);
      else running = false; // 숨김 시 루프 일시정지(resize에서 재개)
    }
    function start() {
      if (running || reduced || W <= 0 || H <= 0) return;
      running = true;
      t0 = 0;
      raf = requestAnimationFrame(frame);
    }

    function resize() {
      const rect = wrapEl.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      if (W <= 0 || H <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasEl.width = Math.round(W * dpr);
      canvasEl.height = Math.round(H * dpr);
      canvasEl.style.width = `${W}px`;
      canvasEl.style.height = `${H}px`;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2;
      cy = H / 2;
      sphereR = Math.min(W, H) * 0.36;
      const s = Math.min(W / VB_W, H / VB_H) * 0.94;
      const ox = (W - VB_W * s) / 2;
      const oy = (H - VB_H * s) / 2;
      mapped = lookTargets.map((pts) =>
        pts.map(([x, y]) => [ox + x * s, oy + y * s] as [number, number]),
      );
      // 리사이즈는 캔버스 비트맵을 지우므로 즉시 재드로우(정적) 또는 루프 재개(동적).
      if (reduced) render(0);
      else start();
    }

    resize(); // 초기: 계산 + 킥오프

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(resize);
      ro.observe(wrapEl);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
    };
  }, [reduced]);

  return (
    <div
      data-intro-particle
      ref={wrapRef}
      className="relative h-[clamp(380px,48vw,580px)] w-[clamp(280px,34vw,440px)]"
    >
      <canvas ref={canvasRef} aria-hidden className="h-full w-full" />
    </div>
  );
}
