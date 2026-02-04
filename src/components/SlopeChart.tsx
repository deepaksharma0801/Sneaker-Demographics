"use client";

import { scaleLinear, scalePoint } from "d3";
import { useState } from "react";
import ChartTooltip from "@/components/ChartTooltip";
import { countryMetrics, regions } from "@/data/sneakerData";

const WIDTH = 520;
const HEIGHT = 320;
const MARGIN = { top: 30, right: 40, bottom: 30, left: 40 };

const YEARS = [2018, 2026] as const;

type Tooltip = {
  x: number;
  y: number;
  name: string;
  value2018: number;
  value2026: number;
};

export default function SlopeChart() {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  const topCountries = [...countryMetrics]
    .sort((a, b) => b.sales2026 - a.sales2026)
    .slice(0, 6);

  const maxValue = Math.max(...topCountries.map((d) => d.sales2026));
  const minValue = Math.min(...topCountries.map((d) => d.sales2018));

  const xScale = scalePoint()
    .domain(YEARS.map(String))
    .range([MARGIN.left, WIDTH - MARGIN.right]);

  const yScale = scaleLinear()
    .domain([minValue - 2, maxValue + 4])
    .range([HEIGHT - MARGIN.bottom, MARGIN.top]);

  const regionColor = new Map(regions.map((region) => [region.label, region.color]));

  return (
    <div className="relative h-full w-full">
      <svg
        aria-label="2018 to 2026 slope chart for top markets"
        className="h-full w-full"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
      >
        <text x={MARGIN.left} y={18} className="fill-[#1a1a1a] text-[13px] font-semibold">
          Top market trajectories (2018 → 2026)
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

        {topCountries.map((country) => (
          <g key={country.name}>
            <line
              x1={xScale(String(2018))}
              x2={xScale(String(2026))}
              y1={yScale(country.sales2018)}
              y2={yScale(country.sales2026)}
              stroke={regionColor.get(country.region) ?? "#1f3a5f"}
              strokeWidth={2.2}
              opacity={0.8}
              onMouseEnter={(event) => {
                const bounds =
                  event.currentTarget.ownerSVGElement?.getBoundingClientRect();
                setTooltip({
                  name: country.name,
                  value2018: country.sales2018,
                  value2026: country.sales2026,
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
              cy={yScale(country.sales2018)}
              r={4}
              fill={regionColor.get(country.region) ?? "#1f3a5f"}
            />
            <circle
              cx={xScale(String(2026))}
              cy={yScale(country.sales2026)}
              r={4}
              fill={regionColor.get(country.region) ?? "#1f3a5f"}
            />
            <text
              x={xScale(String(2018)) - 6}
              y={yScale(country.sales2018)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-[#4f4942] text-[10px]"
            >
              {country.name}
            </text>
            <text
              x={xScale(String(2026)) + 6}
              y={yScale(country.sales2026)}
              dominantBaseline="middle"
              className="fill-[#4f4942] text-[10px]"
            >
              {country.sales2026.toFixed(1)}B
            </text>
          </g>
        ))}
      </svg>

      {tooltip ? (
        <ChartTooltip x={tooltip.x} y={tooltip.y}>
          <div className="font-semibold">{tooltip.name}</div>
          <div className="mt-1 opacity-80">Sales trajectory</div>
          <div className="mt-1">2018: ${tooltip.value2018.toFixed(1)}B</div>
          <div>2026: ${tooltip.value2026.toFixed(1)}B</div>
        </ChartTooltip>
      ) : null}
    </div>
  );
}
