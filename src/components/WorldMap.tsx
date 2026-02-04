"use client";

import { geoNaturalEarth1, geoPath, interpolateYlOrBr, scaleSequential } from "d3";
import { feature } from "topojson-client";
import { useMemo, useState } from "react";
import world from "world-atlas/countries-110m.json";
import { countryMetrics, regions } from "@/data/sneakerData";

const WIDTH = 760;
const HEIGHT = 420;

const YEAR_OPTIONS = [2018, 2026] as const;

type HoverState = {
  name: string;
  region?: string;
  value?: number;
  x: number;
  y: number;
};

export default function WorldMap() {
  const [year, setYear] = useState<(typeof YEAR_OPTIONS)[number]>(2026);
  const [hover, setHover] = useState<HoverState | null>(null);

  const metricsByName = useMemo(() => {
    const map = new Map<string, (typeof countryMetrics)[number]>();
    countryMetrics.forEach((metric) => map.set(metric.name, metric));
    return map;
  }, []);

  const regionColorMap = useMemo(() => {
    const map = new Map<string, string>();
    regions.forEach((region) => map.set(region.label, region.color));
    return map;
  }, []);

  const countries = useMemo(() => {
    const collection = feature(world as any, (world as any).objects.countries);
    return collection.features;
  }, []);

  const values = useMemo(() => {
    return countryMetrics.map((metric) =>
      year === 2018 ? metric.sales2018 : metric.sales2026
    );
  }, [year]);

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const colorScale = scaleSequential()
    .domain([minValue, maxValue])
    .interpolator(interpolateYlOrBr);

  const projection = geoNaturalEarth1().fitSize([WIDTH, HEIGHT], {
    type: "Sphere",
  });
  const path = geoPath(projection);

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-6 top-6 z-10 flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-xs font-medium text-[#2b2b2b] shadow-sm backdrop-blur">
        {YEAR_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setYear(option)}
            className={`rounded-full px-3 py-1 transition ${
              year === option
                ? "bg-[#1f3a5f] text-white"
                : "text-[#2b2b2b] hover:bg-[#efe8de]"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <svg
        aria-label="World map showing sneaker demand by country"
        className="h-full w-full"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
      >
        <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="#f7f1ea" />
        {countries.map((country: any, index: number) => {
          const name = country.properties?.name as string;
          const metric = metricsByName.get(name);
          const value = metric
            ? year === 2018
              ? metric.sales2018
              : metric.sales2026
            : undefined;
          const fill = value ? colorScale(value) : "#e6dfd5";
          const stroke = metric ? regionColorMap.get(metric.region) ?? "#cbbfb2" : "#cbbfb2";

          return (
            <path
              key={country.id ?? name ?? `country-${index}`}
              d={path(country) ?? undefined}
              fill={fill as string}
              stroke={stroke}
              strokeWidth={metric ? 0.7 : 0.4}
              onMouseEnter={(event) => {
                const bounds = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
                setHover({
                  name,
                  region: metric?.region,
                  value,
                  x: (bounds ? event.clientX - bounds.left : 0) + 12,
                  y: (bounds ? event.clientY - bounds.top : 0) + 12,
                });
              }}
              onMouseMove={(event) => {
                const bounds = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
                setHover((prev) =>
                  prev
                    ? {
                        ...prev,
                        x: (bounds ? event.clientX - bounds.left : 0) + 12,
                        y: (bounds ? event.clientY - bounds.top : 0) + 12,
                      }
                    : prev
                );
              }}
              onMouseLeave={() => setHover(null)}
            />
          );
        })}
      </svg>

      {hover ? (
        <div
          className="absolute z-20 rounded-lg border border-white/50 bg-[#151515] px-3 py-2 text-xs text-white shadow-lg"
          style={{ left: hover.x, top: hover.y }}
        >
          <div className="font-semibold">{hover.name}</div>
          <div className="opacity-80">{hover.region ?? "Emerging market"}</div>
          <div className="mt-1">
            {hover.value ? `${hover.value.toFixed(1)}B` : "Limited data"}
          </div>
        </div>
      ) : null}

      <div className="absolute bottom-6 left-6 flex items-center gap-3 rounded-full bg-white/80 px-4 py-2 text-[11px] text-[#2b2b2b] shadow-sm backdrop-blur">
        <span className="font-semibold">Low</span>
        <div className="h-2 w-24 rounded-full bg-gradient-to-r from-[#f7e7c1] via-[#e39c4f] to-[#8b3d21]" />
        <span className="font-semibold">High</span>
      </div>

      <div className="absolute bottom-6 right-6 hidden flex-col gap-2 rounded-2xl bg-white/80 px-4 py-3 text-[11px] text-[#2b2b2b] shadow-sm backdrop-blur lg:flex">
        <div className="font-semibold">Regional color key</div>
        {regions.map((region) => (
          <div key={region.label} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: region.color }} />
            {region.label}
          </div>
        ))}
      </div>
    </div>
  );
}
