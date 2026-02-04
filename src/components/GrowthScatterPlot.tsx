"use client";

import { scaleLinear } from "d3";
import { useState } from "react";
import ChartTooltip from "@/components/ChartTooltip";
import { countryMetrics, regions } from "@/data/sneakerData";

const WIDTH = 520;
const HEIGHT = 320;
const MARGIN = { top: 30, right: 30, bottom: 40, left: 50 };

type Tooltip = {
  x: number;
  y: number;
  name: string;
  growth: number;
  perCapita: number;
};

export default function GrowthScatterPlot() {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  const maxPerCapita = Math.max(...countryMetrics.map((d) => d.perCapita));
  const maxGrowth = Math.max(...countryMetrics.map((d) => d.growth));

  const xScale = scaleLinear()
    .domain([0, maxPerCapita + 10])
    .range([MARGIN.left, WIDTH - MARGIN.right]);

  const yScale = scaleLinear()
    .domain([0, maxGrowth + 2])
    .range([HEIGHT - MARGIN.bottom, MARGIN.top]);

  const regionColor = new Map(regions.map((region) => [region.label, region.color]));

  const highlight = new Set([
    countryMetrics.reduce((max, current) =>
      current.growth > max.growth ? current : max
    ).name,
    countryMetrics.reduce((max, current) =>
      current.perCapita > max.perCapita ? current : max
    ).name,
  ]);

  return (
    <div className="relative h-full w-full">
      <svg
        aria-label="Growth versus per-capita spend scatter plot"
        className="h-full w-full"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
      >
        <text x={MARGIN.left} y={18} className="fill-[#1a1a1a] text-[13px] font-semibold">
          Growth vs. per-capita spend
        </text>

        {yScale.ticks(4).map((tick) => (
          <g key={tick}>
            <line
              x1={MARGIN.left}
              x2={WIDTH - MARGIN.right}
              y1={yScale(tick)}
              y2={yScale(tick)}
              stroke="#e1d7cb"
              strokeDasharray="4 6"
            />
            <text
              x={MARGIN.left - 8}
              y={yScale(tick)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-[#7c756d] text-[10px]"
            >
              {tick}%
            </text>
          </g>
        ))}

        {xScale.ticks(4).map((tick) => (
          <text
            key={tick}
            x={xScale(tick)}
            y={HEIGHT - 14}
            textAnchor="middle"
            className="fill-[#7c756d] text-[10px]"
          >
            ${tick}
          </text>
        ))}

        {countryMetrics.map((country) => (
          <g key={country.name}>
            <circle
              cx={xScale(country.perCapita)}
              cy={yScale(country.growth)}
              r={highlight.has(country.name) ? 6 : 4}
              fill={regionColor.get(country.region) ?? "#1f3a5f"}
              opacity={highlight.has(country.name) ? 1 : 0.65}
              onMouseEnter={(event) => {
                const bounds =
                  event.currentTarget.ownerSVGElement?.getBoundingClientRect();
                setTooltip({
                  name: country.name,
                  growth: country.growth,
                  perCapita: country.perCapita,
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
            {highlight.has(country.name) ? (
              <text
                x={xScale(country.perCapita) + 8}
                y={yScale(country.growth) - 6}
                className="fill-[#1a1a1a] text-[10px]"
              >
                {country.name}
              </text>
            ) : null}
          </g>
        ))}

        <text
          x={WIDTH - MARGIN.right}
          y={HEIGHT - 4}
          textAnchor="end"
          className="fill-[#7c756d] text-[10px]"
        >
          Per-capita spend (2026)
        </text>
      </svg>

      {tooltip ? (
        <ChartTooltip x={tooltip.x} y={tooltip.y}>
          <div className="font-semibold">{tooltip.name}</div>
          <div className="mt-1 opacity-80">Growth vs spend</div>
          <div className="mt-1">{tooltip.growth.toFixed(1)}% CAGR</div>
          <div>${tooltip.perCapita.toFixed(0)} per capita</div>
        </ChartTooltip>
      ) : null}
    </div>
  );
}
