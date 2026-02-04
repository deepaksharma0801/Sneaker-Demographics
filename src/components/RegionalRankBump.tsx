"use client";

import { scalePoint, scaleLinear } from "d3";
import { useState } from "react";
import ChartTooltip from "@/components/ChartTooltip";
import { countryMetrics, regions } from "@/data/sneakerData";

const WIDTH = 520;
const HEIGHT = 320;
const MARGIN = { top: 30, right: 40, bottom: 30, left: 40 };

const YEARS = [2018, 2026] as const;

type RankRow = {
  region: string;
  value2018: number;
  value2026: number;
  rank2018: number;
  rank2026: number;
  color: string;
};

type Tooltip = {
  x: number;
  y: number;
  region: string;
  rank2018: number;
  rank2026: number;
  value2018: number;
  value2026: number;
};

export default function RegionalRankBump() {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  const totals = regions.map((region) => {
    const byYear = countryMetrics.filter((country) => country.region === region.label);
    const value2018 = byYear.reduce((sum, c) => sum + c.sales2018, 0);
    const value2026 = byYear.reduce((sum, c) => sum + c.sales2026, 0);
    return { region: region.label, value2018, value2026, color: region.color };
  });

  const rank2018 = [...totals]
    .sort((a, b) => b.value2018 - a.value2018)
    .map((item, index) => ({ region: item.region, rank: index + 1 }));

  const rank2026 = [...totals]
    .sort((a, b) => b.value2026 - a.value2026)
    .map((item, index) => ({ region: item.region, rank: index + 1 }));

  const rows: RankRow[] = totals.map((item) => ({
    ...item,
    rank2018: rank2018.find((rank) => rank.region === item.region)?.rank ?? 1,
    rank2026: rank2026.find((rank) => rank.region === item.region)?.rank ?? 1,
  }));

  const xScale = scalePoint()
    .domain(YEARS.map(String))
    .range([MARGIN.left, WIDTH - MARGIN.right]);

  const yScale = scaleLinear()
    .domain([1, regions.length])
    .range([MARGIN.top, HEIGHT - MARGIN.bottom]);

  return (
    <div className="relative h-full w-full">
      <svg
        aria-label="Regional rank bump chart"
        className="h-full w-full"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
      >
        <text x={MARGIN.left} y={18} className="fill-[#1a1a1a] text-[13px] font-semibold">
          Regional rank shift (2018 → 2026)
        </text>

        {YEARS.map((year) => (
          <text
            key={year}
            x={xScale(String(year))}
            y={HEIGHT - 8}
            textAnchor="middle"
            className="fill-[#7c756d] text-[11px]"
          >
            {year}
          </text>
        ))}

        {rows.map((row) => (
          <g key={row.region}>
            <line
              x1={xScale(String(2018))}
              x2={xScale(String(2026))}
              y1={yScale(row.rank2018)}
              y2={yScale(row.rank2026)}
              stroke={row.color}
              strokeWidth={2.4}
              opacity={0.9}
              onMouseEnter={(event) => {
                const bounds =
                  event.currentTarget.ownerSVGElement?.getBoundingClientRect();
                setTooltip({
                  region: row.region,
                  rank2018: row.rank2018,
                  rank2026: row.rank2026,
                  value2018: row.value2018,
                  value2026: row.value2026,
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
            <circle
              cx={xScale(String(2018))}
              cy={yScale(row.rank2018)}
              r={5}
              fill={row.color}
            />
            <circle
              cx={xScale(String(2026))}
              cy={yScale(row.rank2026)}
              r={5}
              fill={row.color}
            />
            <text
              x={xScale(String(2018)) - 8}
              y={yScale(row.rank2018)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-[#4f4942] text-[10px]"
            >
              {row.region}
            </text>
            <text
              x={xScale(String(2026)) + 8}
              y={yScale(row.rank2026)}
              dominantBaseline="middle"
              className="fill-[#4f4942] text-[10px]"
            >
              #{row.rank2026}
            </text>
          </g>
        ))}
      </svg>

      {tooltip ? (
        <ChartTooltip x={tooltip.x} y={tooltip.y}>
          <div className="font-semibold">{tooltip.region}</div>
          <div className="mt-1 opacity-80">Rank shift</div>
          <div className="mt-1">2018: #{tooltip.rank2018}</div>
          <div>2026: #{tooltip.rank2026}</div>
          <div className="mt-1 opacity-80">Sales totals</div>
          <div>2018: ${tooltip.value2018.toFixed(1)}B</div>
          <div>2026: ${tooltip.value2026.toFixed(1)}B</div>
        </ChartTooltip>
      ) : null}
    </div>
  );
}
