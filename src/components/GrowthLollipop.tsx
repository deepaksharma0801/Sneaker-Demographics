"use client";

import { scaleBand, scaleLinear } from "d3";
import { useState } from "react";
import ChartTooltip from "@/components/ChartTooltip";
import { countryMetrics } from "@/data/sneakerData";

const WIDTH = 520;
const HEIGHT = 320;
const MARGIN = { top: 30, right: 24, bottom: 30, left: 120 };

type Tooltip = {
  x: number;
  y: number;
  name: string;
  value: number;
};

export default function GrowthLollipop() {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  const topMarkets = [...countryMetrics]
    .sort((a, b) => b.growth - a.growth)
    .slice(0, 8);

  const maxValue = Math.max(...topMarkets.map((d) => d.growth));

  const xScale = scaleLinear()
    .domain([0, maxValue + 2])
    .range([MARGIN.left, WIDTH - MARGIN.right]);

  const yScale = scaleBand()
    .domain(topMarkets.map((d) => d.name))
    .range([MARGIN.top, HEIGHT - MARGIN.bottom])
    .padding(0.4);

  return (
    <div className="relative h-full w-full">
      <svg
        aria-label="Fastest growing markets lollipop chart"
        className="h-full w-full"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
      >
        <text x={MARGIN.left} y={18} className="fill-[#1a1a1a] text-[13px] font-semibold">
          Fastest growing markets (CAGR)
        </text>

        {topMarkets.map((market) => {
          const y = (yScale(market.name) ?? 0) + yScale.bandwidth() / 2;
          return (
            <g key={market.name}>
              <line
                x1={MARGIN.left}
                x2={xScale(market.growth)}
                y1={y}
                y2={y}
                stroke="#c9c0b5"
                strokeWidth={2}
              />
              <circle
                cx={xScale(market.growth)}
                cy={y}
                r={6}
                fill="#c46b2b"
                onMouseEnter={(event) => {
                  const bounds =
                    event.currentTarget.ownerSVGElement?.getBoundingClientRect();
                  setTooltip({
                    name: market.name,
                    value: market.growth,
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
              <text
                x={MARGIN.left - 10}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-[#5b554e] text-[11px]"
              >
                {market.name}
              </text>
              <text
                x={xScale(market.growth) + 10}
                y={y}
                dominantBaseline="middle"
                className="fill-[#5b554e] text-[11px]"
              >
                {market.growth.toFixed(1)}%
              </text>
            </g>
          );
        })}
      </svg>

      {tooltip ? (
        <ChartTooltip x={tooltip.x} y={tooltip.y}>
          <div className="font-semibold">{tooltip.name}</div>
          <div className="mt-1 opacity-80">2018–2026 CAGR</div>
          <div className="mt-1">{tooltip.value.toFixed(1)}%</div>
        </ChartTooltip>
      ) : null}
    </div>
  );
}
