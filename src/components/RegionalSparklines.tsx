"use client";

import { curveMonotoneX, line, scaleLinear } from "d3";
import { countryMetrics, regions } from "@/data/sneakerData";

const WIDTH = 220;
const HEIGHT = 100;
const MARGIN = { top: 10, right: 10, bottom: 20, left: 20 };

const YEARS = Array.from({ length: 9 }, (_, index) => 2018 + index);

export default function RegionalSparklines() {
  const regionSeries = regions.map((region) => {
    const markets = countryMetrics.filter((country) => country.region === region.label);
    const total2018 = markets.reduce((sum, market) => sum + market.sales2018, 0);
    const total2026 = markets.reduce((sum, market) => sum + market.sales2026, 0);
    const series = YEARS.map((year) => {
      const progress = (year - 2018) / 8;
      const value = total2018 + (total2026 - total2018) * progress;
      return { year, value };
    });
    return { region: region.label, color: region.color, series };
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {regionSeries.map((region) => {
        const values = region.series.map((d) => d.value);
        const xScale = scaleLinear()
          .domain([2018, 2026])
          .range([MARGIN.left, WIDTH - MARGIN.right]);
        const yScale = scaleLinear()
          .domain([Math.min(...values) - 2, Math.max(...values) + 2])
          .range([HEIGHT - MARGIN.bottom, MARGIN.top]);

        const path = line<{ year: number; value: number }>()
          .x((d) => xScale(d.year))
          .y((d) => yScale(d.value))
          .curve(curveMonotoneX)(region.series);

        const latest = region.series[region.series.length - 1];

        return (
          <div key={region.region} className="rounded-2xl border border-[#e1d7cb] bg-white p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-[#8c857c]">
              {region.region}
            </div>
            <div className="mt-2 text-lg font-semibold text-[#1b1b1b]">
              ${latest.value.toFixed(1)}B
            </div>
            <svg
              aria-label={`${region.region} sparkline`}
              className="mt-2 h-[80px] w-full"
              viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
              role="img"
            >
              <path
                d={path ?? ""}
                fill="none"
                stroke={region.color}
                strokeWidth={2.4}
              />
              <circle
                cx={xScale(latest.year)}
                cy={yScale(latest.value)}
                r={4}
                fill={region.color}
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
}
