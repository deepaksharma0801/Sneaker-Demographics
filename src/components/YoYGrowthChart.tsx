"use client";

import { scaleBand, scaleLinear } from "d3";
import { useState } from "react";
import ChartTooltip from "@/components/ChartTooltip";
import { globalSales } from "@/data/sneakerData";

const WIDTH = 520;
const HEIGHT = 320;
const MARGIN = { top: 30, right: 24, bottom: 40, left: 50 };

type Tooltip = {
  x: number;
  y: number;
  year: number;
  value: number;
};

export default function YoYGrowthChart() {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  const yoy = globalSales.slice(1).map((point, index) => {
    const prev = globalSales[index].value;
    const change = ((point.value - prev) / prev) * 100;
    return { year: point.year, value: change };
  });

  const maxValue = Math.max(...yoy.map((d) => d.value));
  const minValue = Math.min(...yoy.map((d) => d.value));

  const xScale = scaleBand()
    .domain(yoy.map((d) => String(d.year)))
    .range([MARGIN.left, WIDTH - MARGIN.right])
    .padding(0.3);

  const yScale = scaleLinear()
    .domain([Math.min(minValue, -15), Math.max(maxValue, 10)])
    .range([HEIGHT - MARGIN.bottom, MARGIN.top]);

  return (
    <div className="relative h-full w-full">
      <svg
        aria-label="Year over year growth bar chart"
        className="h-full w-full"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
      >
        <text
          x={MARGIN.left}
          y={18}
          className="fill-[#1a1a1a] text-[13px] font-semibold"
        >
          Year-over-year growth
        </text>

        <line
          x1={MARGIN.left}
          x2={WIDTH - MARGIN.right}
          y1={yScale(0)}
          y2={yScale(0)}
          stroke="#c9c0b5"
        />

        {yScale.ticks(4).map((tick) => (
          <text
            key={tick}
            x={MARGIN.left - 8}
            y={yScale(tick)}
            textAnchor="end"
            dominantBaseline="middle"
            className="fill-[#7c756d] text-[10px]"
          >
            {tick}%
          </text>
        ))}

        {yoy.map((point) => {
          const height = Math.abs(yScale(point.value) - yScale(0));
          const y = point.value >= 0 ? yScale(point.value) : yScale(0);
          return (
            <g key={point.year}>
              <rect
                x={xScale(String(point.year))}
                y={y}
                width={xScale.bandwidth()}
                height={height}
                rx={6}
                fill={point.value >= 0 ? "#1f3a5f" : "#a33f2b"}
                opacity={0.85}
                onMouseEnter={(event) => {
                  const bounds =
                    event.currentTarget.ownerSVGElement?.getBoundingClientRect();
                  setTooltip({
                    year: point.year,
                    value: point.value,
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
                x={(xScale(String(point.year)) ?? 0) + xScale.bandwidth() / 2}
                y={HEIGHT - 10}
                textAnchor="middle"
                className="fill-[#7c756d] text-[10px]"
              >
                {point.year}
              </text>
            </g>
          );
        })}
      </svg>

      {tooltip ? (
        <ChartTooltip x={tooltip.x} y={tooltip.y}>
          <div className="font-semibold">{tooltip.year}</div>
          <div className="mt-1 opacity-80">YoY change</div>
          <div className="mt-1">{tooltip.value.toFixed(1)}%</div>
        </ChartTooltip>
      ) : null}
    </div>
  );
}
