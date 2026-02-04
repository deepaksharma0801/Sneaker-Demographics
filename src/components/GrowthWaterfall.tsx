"use client";

import { scaleLinear, scaleBand } from "d3";
import { useState } from "react";
import ChartTooltip from "@/components/ChartTooltip";
import { countryMetrics, regions } from "@/data/sneakerData";

const WIDTH = 760;
const HEIGHT = 300;
const MARGIN = { top: 40, right: 30, bottom: 40, left: 80 };

type Tooltip = {
  x: number;
  y: number;
  region: string;
  value: number;
  cumulative: number;
};

export default function GrowthWaterfall() {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  const rows = regions.map((region) => {
    const markets = countryMetrics.filter((country) => country.region === region.label);
    const total2018 = markets.reduce((sum, market) => sum + market.sales2018, 0);
    const total2026 = markets.reduce((sum, market) => sum + market.sales2026, 0);
    return { region: region.label, value: total2026 - total2018, color: region.color };
  });

  const ordered = [...rows].sort((a, b) => b.value - a.value);

  const totalGrowth = ordered.reduce((sum, row) => sum + row.value, 0);

  const segments = ordered.reduce(
    (acc, row) => {
      const start = acc.running;
      const end = start + row.value;
      acc.items.push({ ...row, start, end });
      acc.running = end;
      return acc;
    },
    {
      running: 0,
      items: [] as Array<{
        region: string;
        value: number;
        color: string;
        start: number;
        end: number;
      }>,
    }
  ).items;

  const xScale = scaleLinear()
    .domain([0, totalGrowth + 10])
    .range([MARGIN.left, WIDTH - MARGIN.right]);

  const yScale = scaleBand()
    .domain(ordered.map((row) => row.region))
    .range([MARGIN.top, HEIGHT - MARGIN.bottom])
    .padding(0.35);

  return (
    <div className="relative h-full w-full">
      <svg
        aria-label="Regional growth waterfall"
        className="h-full w-full"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
      >
        <text x={MARGIN.left} y={20} className="fill-[#1a1a1a] text-[13px] font-semibold">
          Growth contribution by region (2018 → 2026)
        </text>

        {segments.map((row) => {
          const barStart = xScale(row.start);
          const barEnd = xScale(row.end);
          const y = yScale(row.region) ?? 0;
          const barHeight = yScale.bandwidth();
          return (
            <g key={row.region}>
              <rect
                x={barStart}
                y={y}
                width={barEnd - barStart}
                height={barHeight}
                rx={6}
                fill={row.color}
                opacity={0.85}
                onMouseEnter={(event) => {
                  const bounds =
                    event.currentTarget.ownerSVGElement?.getBoundingClientRect();
                  setTooltip({
                    region: row.region,
                    value: row.value,
                    cumulative: row.end,
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
                x={MARGIN.left - 12}
                y={y + barHeight / 2}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-[#5b554e] text-[11px]"
              >
                {row.region}
              </text>
              <text
                x={barEnd + 8}
                y={y + barHeight / 2}
                dominantBaseline="middle"
                className="fill-[#5b554e] text-[11px]"
              >
                +{row.value.toFixed(1)}B
              </text>
            </g>
          );
        })}

        <line
          x1={xScale(totalGrowth)}
          x2={xScale(totalGrowth)}
          y1={MARGIN.top}
          y2={HEIGHT - MARGIN.bottom}
          stroke="#c9c0b5"
          strokeDasharray="4 6"
        />
        <text
          x={xScale(totalGrowth)}
          y={HEIGHT - 10}
          textAnchor="middle"
          className="fill-[#7c756d] text-[10px]"
        >
          Total +{totalGrowth.toFixed(1)}B
        </text>
      </svg>

      {tooltip ? (
        <ChartTooltip x={tooltip.x} y={tooltip.y}>
          <div className="font-semibold">{tooltip.region}</div>
          <div className="mt-1 opacity-80">Growth contribution</div>
          <div className="mt-1">+${tooltip.value.toFixed(1)}B</div>
          <div>Cumulative: ${tooltip.cumulative.toFixed(1)}B</div>
        </ChartTooltip>
      ) : null}
    </div>
  );
}
