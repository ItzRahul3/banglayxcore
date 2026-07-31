"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [pointer, setPointer] = useState(false);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isFinePointer) return;

    setVisible(true);
    let raf = 0;
    let ringX = 0;
    let ringY = 0;

    const onMove = (e: MouseEvent) => {
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
      const target = e.target as HTMLElement;
      setPointer(!!target.closest("a, button, [role='button'], input, select"));

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        ringX += (e.clientX - ringX) * 0.2;
        ringY += (e.clientY - ringY) * 0.2;
        if (ringRef.current) {
          ringRef.current.style.left = `${ringX}px`;
          ringRef.current.style.top = `${ringY}px`;
        }
      });
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed z-[999] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-[1px] bg-ore"
      />
      <div
        ref={ringRef}
        className={`pointer-events-none fixed z-[998] -translate-x-1/2 -translate-y-1/2 rounded-[2px] border transition-[width,height] duration-150 ${
          pointer ? "h-8 w-8 border-gold bg-gold/10" : "h-5 w-5 border-ore/60"
        }`}
      />
    </>
  );
}
