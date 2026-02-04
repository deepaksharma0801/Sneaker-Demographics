"use client";

import type { ReactNode } from "react";

export default function ChartTooltip({
  x,
  y,
  children,
}: {
  x: number;
  y: number;
  children: ReactNode;
}) {
  return (
    <div
      className="pointer-events-none absolute z-20 min-w-[140px] rounded-lg border border-white/40 bg-[#151515] px-3 py-2 text-xs text-white shadow-lg"
      style={{ left: x, top: y }}
    >
      {children}
    </div>
  );
}
