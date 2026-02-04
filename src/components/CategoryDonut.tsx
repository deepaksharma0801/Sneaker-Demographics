"use client";

import { arc, pie } from "d3";
import { useState } from "react";
import ChartTooltip from "@/components/ChartTooltip";
import { categorySeries } from "@/data/sneakerData";

const WIDTH = 320;
const HEIGHT = 280;
const CENTER = { x: WIDTH / 2, y: HEIGHT / 2 };

const COLORS = {
  performance: "#1f3a5f",
  lifestyle: "#c46b2b",
};

function getShares(year: number) {
  const row = categorySeries.find((point) => point.year === year);
  if (!row) return [];
  return [
    { key: "performance", value: row.performance },
    { key: "lifestyle", value: row.lifestyle },
  ];
}

type Tooltip = {
  x: number;
  y: number;
  label: string;
  year: number;
  value: number;
};

export default function CategoryDonut() {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  const data2018 = getShares(2018);
  const data2026 = getShares(2026);

  const pieGen = pie<{ key: string; value: number }>().value((d) => d.value);

  const outerArc = arc<unknown>()
    .innerRadius(85)
    .outerRadius(120)
    .cornerRadius(8);

  const innerArc = arc<unknown>()
    .innerRadius(55)
    .outerRadius(78)
    .cornerRadius(8);

  return (
    <div className="relative flex h-full w-full flex-col">
      <svg
        aria-label="Category mix donut chart"
        className="h-[220px] w-full"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
      >
        <text x={20} y={24} className="fill-[#1a1a1a] text-[13px] font-semibold">
          Category mix: 2018 vs 2026
        </text>

        <g transform={`translate(${CENTER.x}, ${CENTER.y + 6})`}>
          {pieGen(data2026).map((slice) => (
            <path
              key={`2026-${slice.data.key}`}
              d={outerArc(slice) ?? undefined}
              fill={COLORS[slice.data.key as keyof typeof COLORS]}
              opacity={0.9}
              onMouseEnter={(event) => {
                const bounds =
                  event.currentTarget.ownerSVGElement?.getBoundingClientRect();
                setTooltip({
                  label: slice.data.key,
                  year: 2026,
                  value: slice.data.value,
                  x: (bounds ? event.clientX - bounds.left : 0) + 12,
                  y: (bounds ? event.clientY - bounds.top : 0) + 12,
                });
              }}
              onMouseMove={(event) => {
                const bounds =
                  event.currentTarget.ownerSVGElement?.getBoundingClientRect();
                setTooltip((prev) =>
                  prev
                    ? {
                        ...prev,
                        x: (bounds ? event.clientX - bounds.left : 0) + 12,
                        y: (bounds ? event.clientY - bounds.top : 0) + 12,
                      }
                    : prev
                );
              }}
              onMouseLeave={() => setTooltip(null)}
            />
          ))}
          {pieGen(data2018).map((slice) => (
            <path
              key={`2018-${slice.data.key}`}
              d={innerArc(slice) ?? undefined}
              fill={COLORS[slice.data.key as keyof typeof COLORS]}
              opacity={0.45}
              onMouseEnter={(event) => {
                const bounds =
                  event.currentTarget.ownerSVGElement?.getBoundingClientRect();
                setTooltip({
                  label: slice.data.key,
                  year: 2018,
                  value: slice.data.value,
                  x: (bounds ? event.clientX - bounds.left : 0) + 12,
                  y: (bounds ? event.clientY - bounds.top : 0) + 12,
                });
              }}
              onMouseMove={(event) => {
                const bounds =
                  event.currentTarget.ownerSVGElement?.getBoundingClientRect();
                setTooltip((prev) =>
                  prev
                    ? {
                        ...prev,
                        x: (bounds ? event.clientX - bounds.left : 0) + 12,
                        y: (bounds ? event.clientY - bounds.top : 0) + 12,
                      }
                    : prev
                );
              }}
              onMouseLeave={() => setTooltip(null)}
            />
          ))}

          <circle r={42} fill="#f9f6f0" />
          <text
            textAnchor="middle"
            y={6}
            className="fill-[#1a1a1a] text-[12px] font-semibold"
          >
            2018 ↔ 2026
          </text>
        </g>
      </svg>

      <div className="mt-3 grid grid-cols-2 gap-y-2 text-[11px] text-[#5b554e]">
        <span className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: COLORS.performance }}
          />
          Performance
        </span>
        <span className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: COLORS.lifestyle }}
          />
          Lifestyle
        </span>
        <span className="text-[#8c857c]">Inner ring: 2018</span>
        <span className="text-[#8c857c]">Outer ring: 2026</span>
      </div>

      {tooltip ? (
        <ChartTooltip x={tooltip.x} y={tooltip.y}>
          <div className="font-semibold">
            {tooltip.label === "performance" ? "Performance" : "Lifestyle"}
          </div>
          <div className="mt-1 opacity-80">{tooltip.year} value</div>
          <div className="mt-1">${tooltip.value.toFixed(1)}B</div>
        </ChartTooltip>
      ) : null}
    </div>
  );
}
