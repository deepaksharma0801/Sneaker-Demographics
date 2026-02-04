"use client";

import { interpolateYlOrBr, scaleBand, scaleSequential } from "d3";
import { useState } from "react";
import ChartTooltip from "@/components/ChartTooltip";
import { countryMetrics, regions } from "@/data/sneakerData";

const WIDTH = 760;
const HEIGHT = 340;
const MARGIN = { top: 70, right: 30, bottom: 40, left: 140 };

const YEARS = Array.from({ length: 9 }, (_, index) => 2018 + index);

type Tooltip = {
  x: number;
  y: number;
  region: string;
  year: number;
  value: number;
};

export default function RegionalHeatmap() {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  const totals = regions.map((region) => {
    const countries = countryMetrics.filter((country) => country.region === region.label);
    const total2018 = countries.reduce((sum, c) => sum + c.sales2018, 0);
    const total2026 = countries.reduce((sum, c) => sum + c.sales2026, 0);
    return { region: region.label, total2018, total2026 };
  });

  const cells = totals.flatMap((row) =>
    YEARS.map((year) => {
      const progress = (year - 2018) / 8;
      const value = row.total2018 + (row.total2026 - row.total2018) * progress;
      return { region: row.region, year, value };
    })
  );

  const minValue = Math.min(...cells.map((cell) => cell.value));
  const maxValue = Math.max(...cells.map((cell) => cell.value));

  const xScale = scaleBand()
    .domain(YEARS.map(String))
    .range([MARGIN.left, WIDTH - MARGIN.right])
    .padding(0.08);

  const yScale = scaleBand()
    .domain(regions.map((region) => region.label))
    .range([MARGIN.top, HEIGHT - MARGIN.bottom])
    .padding(0.12);

  const colorScale = scaleSequential()
    .domain([minValue, maxValue])
    .interpolator(interpolateYlOrBr);

  return (
    <div className="relative h-full w-full">
      <svg
        aria-label="Regional demand heatmap"
        className="h-full w-full"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
      >
        <defs>
          <linearGradient id="heatmapGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={colorScale(minValue)} />
            <stop offset="100%" stopColor={colorScale(maxValue)} />
          </linearGradient>
        </defs>
        <text x={MARGIN.left} y={28} className="fill-[#1a1a1a] text-[13px] font-semibold">
          Regional demand heatmap (2018–2026)
        </text>

        {cells.map((cell) => (
          <rect
            key={`${cell.region}-${cell.year}`}
            x={xScale(String(cell.year))}
            y={yScale(cell.region)}
            width={xScale.bandwidth()}
            height={yScale.bandwidth()}
            rx={6}
            fill={colorScale(cell.value)}
            opacity={0.85}
            onMouseEnter={(event) => {
              const bounds =
                event.currentTarget.ownerSVGElement?.getBoundingClientRect();
              setTooltip({
                region: cell.region,
                year: cell.year,
                value: cell.value,
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

        {regions.map((region) => (
          <text
            key={region.label}
            x={MARGIN.left - 10}
            y={(yScale(region.label) ?? 0) + yScale.bandwidth() / 2}
            textAnchor="end"
            dominantBaseline="middle"
            className="fill-[#5b554e] text-[11px]"
          >
            {region.label}
          </text>
        ))}

        {YEARS.map((year) => (
          <text
            key={year}
            x={(xScale(String(year)) ?? 0) + xScale.bandwidth() / 2}
            y={HEIGHT - 10}
            textAnchor="middle"
            className="fill-[#7c756d] text-[10px]"
          >
            {year}
          </text>
        ))}

        <g transform={`translate(${WIDTH - 190}, 36)`}>
          <rect width={120} height={10} rx={5} fill="url(#heatmapGradient)" />
          <text x={0} y={26} className="fill-[#7c756d] text-[10px]">
            Low
          </text>
          <text x={96} y={26} className="fill-[#7c756d] text-[10px]">
            High
          </text>
        </g>
      </svg>

      {tooltip ? (
        <ChartTooltip x={tooltip.x} y={tooltip.y}>
          <div className="font-semibold">{tooltip.region}</div>
          <div className="mt-1 opacity-80">{tooltip.year} estimate</div>
          <div className="mt-1">${tooltip.value.toFixed(1)}B</div>
        </ChartTooltip>
      ) : null}
    </div>
  );
}
