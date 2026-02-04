"use client";

import { scaleBand, scaleLinear } from "d3";
import { useState } from "react";
import ChartTooltip from "@/components/ChartTooltip";
import { countryMetrics, regions } from "@/data/sneakerData";

const WIDTH = 520;
const HEIGHT = 320;
const MARGIN = { top: 30, right: 24, bottom: 30, left: 140 };

type Tooltip = {
  x: number;
  y: number;
  region: string;
  value: number;
};

export default function RegionalShareBars() {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  const totals = regions.map((region) => {
    const total = countryMetrics
      .filter((country) => country.region === region.label)
      .reduce((sum, country) => sum + country.sales2026, 0);
    return { region: region.label, value: total, color: region.color };
  });

  const maxValue = Math.max(...totals.map((item) => item.value));

  const xScale = scaleLinear()
    .domain([0, maxValue + 5])
    .range([MARGIN.left, WIDTH - MARGIN.right]);

  const yScale = scaleBand()
    .domain(totals.map((item) => item.region))
    .range([MARGIN.top, HEIGHT - MARGIN.bottom])
    .padding(0.3);

  return (
    <div className="relative h-full w-full">
      <svg
        aria-label="Regional sales contribution bar chart"
        className="h-full w-full"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
      >
        <text
          x={MARGIN.left}
          y={18}
          className="fill-[#1a1a1a] text-[13px] font-semibold"
        >
          2026 regional contribution (USD billions)
        </text>

        {totals.map((item) => {
          const y = yScale(item.region) ?? 0;
          const barHeight = yScale.bandwidth();
          return (
            <g key={item.region}>
              <rect
                x={MARGIN.left}
                y={y}
                width={xScale(item.value) - MARGIN.left}
                height={barHeight}
                rx={8}
                fill={item.color}
                opacity={0.85}
                onMouseEnter={(event) => {
                  const bounds =
                    event.currentTarget.ownerSVGElement?.getBoundingClientRect();
                  setTooltip({
                    region: item.region,
                    value: item.value,
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
                y={y + barHeight / 2}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-[#5b554e] text-[12px]"
              >
                {item.region}
              </text>
              <text
                x={xScale(item.value) + 8}
                y={y + barHeight / 2}
                dominantBaseline="middle"
                className="fill-[#5b554e] text-[11px]"
              >
                {item.value.toFixed(1)}B
              </text>
            </g>
          );
        })}
      </svg>

      {tooltip ? (
        <ChartTooltip x={tooltip.x} y={tooltip.y}>
          <div className="font-semibold">{tooltip.region}</div>
          <div className="mt-1 opacity-80">2026 sales</div>
          <div className="mt-1">${tooltip.value.toFixed(1)}B</div>
        </ChartTooltip>
      ) : null}
    </div>
  );
}
