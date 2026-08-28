"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from "react";

interface DraggableMarqueeProps {
  children: ReactNode;
  speed?: number;
  className?: string;
  trackClassName?: string;
}

// Was framer-motion (useMotionValue + useAnimationFrame). Now a plain
// rAF loop writing `transform: translate3d(x,0,0)` straight to the track
// node — same auto-scroll, hover-pause, pointer-drag and momentum, with
// no animation-library runtime. The loop only runs while the strip is
// actually on screen (IntersectionObserver) and is fully halted for
// `prefers-reduced-motion`.
export default function DraggableMarquee({
  children,
  speed = 60,
  className = "",
  trackClassName = "",
}: DraggableMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);

  const isDraggingRef = useRef(false);
  const isHoveringRef = useRef(false);
  const isOnScreenRef = useRef(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const startClientXRef = useRef(0);
  const startXRef = useRef(0);
  const lastClientXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const momentumUntilRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setIsReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = trackRef.current?.parentElement;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        isOnScreenRef.current = entry.isIntersecting;
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (isReducedMotion) return;
    let raf = 0;
    let last = performance.now();

    const wrap = (value: number, halfWidth: number) => {
      let v = value;
      while (v <= -halfWidth) v += halfWidth;
      while (v > 0) v -= halfWidth;
      return v;
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const delta = now - last;
      last = now;

      const track = trackRef.current;
      if (!track) return;
      const halfWidth = track.scrollWidth / 2;
      if (halfWidth === 0) return;

      if (isDraggingRef.current) return;

      if (now < momentumUntilRef.current) {
        xRef.current = wrap(
          xRef.current + (velocityRef.current * delta) / 1000,
          halfWidth
        );
        velocityRef.current *= 0.94;
      } else if (!isHoveringRef.current && isOnScreenRef.current) {
        xRef.current = wrap(xRef.current - (speed * delta) / 1000, halfWidth);
      } else {
        return;
      }
      track.style.transform = `translate3d(${xRef.current}px,0,0)`;
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [speed, isReducedMotion]);

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (!trackRef.current) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    startClientXRef.current = e.clientX;
    startXRef.current = xRef.current;
    lastClientXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current) return;
    const track = trackRef.current;
    if (!track) return;
    const halfWidth = track.scrollWidth / 2;

    let v = startXRef.current + (e.clientX - startClientXRef.current);
    while (v <= -halfWidth) v += halfWidth;
    while (v > 0) v -= halfWidth;
    xRef.current = v;
    track.style.transform = `translate3d(${v}px,0,0)`;

    const now = performance.now();
    const dt = now - lastTimeRef.current;
    if (dt > 0) {
      velocityRef.current = ((e.clientX - lastClientXRef.current) / dt) * 1000;
    }
    lastClientXRef.current = e.clientX;
    lastTimeRef.current = now;
  }

  function endDrag() {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    momentumUntilRef.current = performance.now() + 900;
  }

  return (
    <div
      className={`cursor-grab select-none overflow-hidden touch-pan-y active:cursor-grabbing ${className}`}
      onMouseEnter={() => (isHoveringRef.current = true)}
      onMouseLeave={() => (isHoveringRef.current = false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        ref={trackRef}
        className={`flex w-max items-stretch ${trackClassName}`}
        style={{ willChange: "transform" }}
      >
        {children}
      </div>
    </div>
  );
}
