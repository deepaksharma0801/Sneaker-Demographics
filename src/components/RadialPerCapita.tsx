"use client";

import { arc, scaleLinear } from "d3";
import { useState } from "react";
import ChartTooltip from "@/components/ChartTooltip";
import { countryMetrics, regions } from "@/data/sneakerData";

const WIDTH = 360;
const HEIGHT = 300;
const CENTER = { x: WIDTH / 2, y: HEIGHT / 2 };

type Tooltip = {
  x: number;
  y: number;
  region: string;
  value: number;
};

export default function RadialPerCapita() {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  const data = regions.map((region) => {
    const markets = countryMetrics.filter((country) => country.region === region.label);
    const average =
      markets.reduce((sum, market) => sum + market.perCapita, 0) / markets.length;
    return { region: region.label, value: average, color: region.color };
  });

  const maxValue = Math.max(...data.map((d) => d.value));
  const radiusScale = scaleLinear().domain([0, maxValue]).range([20, 95]);

  const angleStep = (Math.PI * 2) / data.length;

  return (
    <div className="relative flex h-full w-full flex-col">
      <svg
        aria-label="Regional per-capita radial chart"
        className="h-[220px] w-full"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
      >
        <text x={20} y={24} className="fill-[#1a1a1a] text-[13px] font-semibold">
          Per-capita intensity by region
        </text>

        <g transform={`translate(${CENTER.x}, ${CENTER.y + 8})`}>
          {data.map((item, index) => {
            const startAngle = index * angleStep - Math.PI / 2;
            const endAngle = startAngle + angleStep * 0.85;
            const outerRadius = radiusScale(item.value) + 40;
            const path = arc()
              .innerRadius(38)
              .outerRadius(outerRadius)
              .cornerRadius(6)({ startAngle, endAngle });

            return (
              <g key={item.region}>
                <path
                  d={path ?? undefined}
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
              </g>
            );
          })}

          <circle r={30} fill="#f9f6f0" />
          <text
            textAnchor="middle"
            y={6}
            className="fill-[#1a1a1a] text-[12px] font-semibold"
          >
            $/capita
          </text>
        </g>
      </svg>

      <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-[#5b554e]">
        {data.map((item) => (
          <span key={item.region} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: item.color }} />
            {item.region}
          </span>
        ))}
      </div>

      {tooltip ? (
        <ChartTooltip x={tooltip.x} y={tooltip.y}>
          <div className="font-semibold">{tooltip.region}</div>
          <div className="mt-1 opacity-80">Avg per-capita spend</div>
          <div className="mt-1">${tooltip.value.toFixed(0)}</div>
        </ChartTooltip>
      ) : null}
    </div>
  );
}
