"use client";

import { scaleLinear, line, curveMonotoneX } from "d3";
import { useMemo, useState } from "react";
import ChartTooltip from "@/components/ChartTooltip";
import { globalSales } from "@/data/sneakerData";

const WIDTH = 640;
const HEIGHT = 320;
const MARGIN = { top: 30, right: 30, bottom: 40, left: 50 };

type IndexPoint = {
  year: number;
  value: number;
};

type Tooltip = {
  x: number;
  y: number;
  year: number;
  value: number;
};

export default function GrowthIndexLine() {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  const data = useMemo<IndexPoint[]>(() => {
    const base = globalSales[0].value;
    return globalSales.map((point) => ({
      year: point.year,
      value: Math.round((point.value / base) * 100),
    }));
  }, []);

  const xScale = scaleLinear()
    .domain([2018, 2026])
    .range([MARGIN.left, WIDTH - MARGIN.right]);

  const yScale = scaleLinear()
    .domain([
      Math.min(...data.map((d) => d.value)) - 10,
      Math.max(...data.map((d) => d.value)) + 10,
    ])
    .range([HEIGHT - MARGIN.bottom, MARGIN.top]);

  const path = line<IndexPoint>()
    .x((d) => xScale(d.year))
    .y((d) => yScale(d.value))
    .curve(curveMonotoneX)(data);

  return (
    <div className="relative h-full w-full">
      <svg
        aria-label="Growth index line chart"
        className="h-full w-full"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        onMouseLeave={() => setTooltip(null)}
        onMouseMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          const x = event.clientX - bounds.left;
          const year = Math.round(xScale.invert(x));
          const snapped = data.find((d) => d.year === year);
          if (!snapped) return;
          setTooltip({
            year: snapped.year,
            value: snapped.value,
            x: xScale(snapped.year) + 12,
            y: yScale(snapped.value) - 12,
          });
        }}
      >
        <text
          x={MARGIN.left}
          y={18}
          className="fill-[#1a1a1a] text-[13px] font-semibold"
        >
          Global demand index (2018 = 100)
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
              {tick}
            </text>
          </g>
        ))}

        <path
          d={path ?? ""}
          fill="none"
          stroke="#1f3a5f"
          strokeWidth={3}
        />

        {data.map((point) => (
          <circle
            key={point.year}
            cx={xScale(point.year)}
            cy={yScale(point.value)}
            r={4}
            fill="#c46b2b"
          />
        ))}

        {tooltip ? (
          <g>
            <line
              x1={xScale(tooltip.year)}
              x2={xScale(tooltip.year)}
              y1={MARGIN.top}
              y2={HEIGHT - MARGIN.bottom}
              stroke="#c9c0b5"
              strokeDasharray="4 6"
            />
            <circle
              cx={xScale(tooltip.year)}
              cy={yScale(tooltip.value)}
              r={6}
              fill="#1f3a5f"
            />
          </g>
        ) : null}

        {data.map((point) => (
          <text
            key={`label-${point.year}`}
            x={xScale(point.year)}
            y={HEIGHT - 10}
            textAnchor="middle"
            className="fill-[#7c756d] text-[10px]"
          >
            {point.year}
          </text>
        ))}
      </svg>

      {tooltip ? (
        <ChartTooltip x={tooltip.x} y={tooltip.y}>
          <div className="font-semibold">{tooltip.year}</div>
          <div className="mt-1 opacity-80">Index vs 2018</div>
          <div className="mt-1">{tooltip.value}</div>
        </ChartTooltip>
      ) : null}
    </div>
  );
}
