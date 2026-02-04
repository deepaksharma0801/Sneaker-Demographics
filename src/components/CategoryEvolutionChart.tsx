import { area, curveMonotoneX, scaleLinear, stack } from "d3";
import { categorySeries } from "@/data/sneakerData";

const WIDTH = 760;
const HEIGHT = 360;
const MARGIN = { top: 40, right: 40, bottom: 50, left: 60 };

const COLORS = {
  performance: "#1f3a5f",
  lifestyle: "#c46b2b",
};

export default function CategoryEvolutionChart() {
  const xScale = scaleLinear()
    .domain([2018, 2026])
    .range([MARGIN.left, WIDTH - MARGIN.right]);

  const yMax = Math.max(
    ...categorySeries.map((point) => point.performance + point.lifestyle)
  );

  const yScale = scaleLinear()
    .domain([0, yMax + 12])
    .range([HEIGHT - MARGIN.bottom, MARGIN.top]);

  const stackGenerator = stack().keys([
    "performance",
    "lifestyle",
  ]);

  const stacked = stackGenerator(categorySeries);

  const areaGenerator = area()
    .x((_: unknown, index: number) => xScale(categorySeries[index].year))
    .y0((d: [number, number]) => yScale(d[0]))
    .y1((d: [number, number]) => yScale(d[1]))
    .curve(curveMonotoneX);

  const yTicks = yScale.ticks(4) as number[];

  return (
    <div className="relative h-full w-full">
      <svg
        aria-label="Category evolution stacked area chart"
        className="h-full w-full"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
      >
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={MARGIN.left}
              x2={WIDTH - MARGIN.right}
              y1={yScale(tick)}
              y2={yScale(tick)}
              stroke="#d9d2c8"
              strokeDasharray="4 6"
            />
            <text
              x={MARGIN.left - 12}
              y={yScale(tick)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-[#7c756d] text-[11px]"
            >
              {tick}
            </text>
          </g>
        ))}

        {stacked.map((serie: any) => (
          <path
            key={serie.key}
            d={areaGenerator(serie) ?? ""}
            fill={COLORS[serie.key as keyof typeof COLORS]}
            opacity={0.82}
          />
        ))}

        {categorySeries.map((point) => (
          <text
            key={point.year}
            x={xScale(point.year)}
            y={HEIGHT - MARGIN.bottom + 24}
            textAnchor="middle"
            className="fill-[#7c756d] text-[11px]"
          >
            {point.year}
          </text>
        ))}

        <text
          x={MARGIN.left}
          y={MARGIN.top - 14}
          className="fill-[#1a1a1a] text-[13px] font-semibold"
        >
          Category mix (USD billions)
        </text>
      </svg>

      <div className="absolute right-6 top-8 flex items-center gap-4 text-xs text-[#2b2b2b]">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: COLORS.performance }} />
          Performance
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: COLORS.lifestyle }} />
          Lifestyle
        </span>
      </div>
    </div>
  );
}
