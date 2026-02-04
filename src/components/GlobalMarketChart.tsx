import { area, curveMonotoneX, line, scaleLinear } from "d3";
import { globalSales } from "@/data/sneakerData";

const WIDTH = 760;
const HEIGHT = 360;
const MARGIN = { top: 40, right: 40, bottom: 50, left: 60 };

const PANDEMIC_YEAR = 2020;

export type GlobalMarketVariant = "growth" | "shock";

export default function GlobalMarketChart({
  variant,
}: {
  variant: GlobalMarketVariant;
}) {
  const xScale = scaleLinear()
    .domain([2018, 2026])
    .range([MARGIN.left, WIDTH - MARGIN.right]);

  const yScale = scaleLinear()
    .domain([
      Math.min(...globalSales.map((point) => point.value)) - 10,
      Math.max(...globalSales.map((point) => point.value)) + 10,
    ])
    .range([HEIGHT - MARGIN.bottom, MARGIN.top]);

  const linePath = line<{ year: number; value: number }>()
    .x((point) => xScale(point.year))
    .y((point) => yScale(point.value))
    .curve(curveMonotoneX)
    .defined((point) => Number.isFinite(point.value))(globalSales);

  const areaPath = area<{ year: number; value: number }>()
    .x((point) => xScale(point.year))
    .y0(HEIGHT - MARGIN.bottom)
    .y1((point) => yScale(point.value))
    .curve(curveMonotoneX)
    .defined((point) => Number.isFinite(point.value))(globalSales);

  const yTicks = yScale.ticks(4);
  const xTicks = globalSales.map((point) => point.year);

  const pandemicPoint = globalSales.find((point) => point.year === PANDEMIC_YEAR);

  return (
    <div className="relative h-full w-full">
      <svg
        aria-label="Global sneaker market size line chart"
        className="h-full w-full"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
      >
        <defs>
          <linearGradient id="marketLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f1c58b" />
            <stop offset="50%" stopColor="#e37c42" />
            <stop offset="100%" stopColor="#7a2f20" />
          </linearGradient>
          <linearGradient id="marketArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f1c58b" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f1c58b" stopOpacity="0.03" />
          </linearGradient>
        </defs>

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

        {xTicks.map((tick) => (
          <text
            key={tick}
            x={xScale(tick)}
            y={HEIGHT - MARGIN.bottom + 24}
            textAnchor="middle"
            className="fill-[#7c756d] text-[11px]"
          >
            {tick}
          </text>
        ))}

        <path
          d={areaPath ?? ""}
          fill="url(#marketArea)"
          opacity={variant === "growth" ? 0.55 : 0.35}
        />
        <path
          d={linePath ?? ""}
          fill="none"
          stroke="url(#marketLine)"
          strokeWidth="3"
        />

        {variant === "shock" && pandemicPoint ? (
          <g>
            <circle
              cx={xScale(pandemicPoint.year)}
              cy={yScale(pandemicPoint.value)}
              r={6}
              fill="#8f3a2c"
            />
            <line
              x1={xScale(pandemicPoint.year)}
              x2={xScale(pandemicPoint.year) + 80}
              y1={yScale(pandemicPoint.value)}
              y2={yScale(pandemicPoint.value) - 50}
              stroke="#8f3a2c"
              strokeWidth={1.5}
            />
            <rect
              x={xScale(pandemicPoint.year) + 80}
              y={yScale(pandemicPoint.value) - 80}
              width={160}
              height={48}
              rx={8}
              fill="#1a1a1a"
              opacity={0.85}
            />
            <text
              x={xScale(pandemicPoint.year) + 92}
              y={yScale(pandemicPoint.value) - 56}
              className="fill-white text-[12px]"
            >
              Pandemic demand dip
            </text>
            <text
              x={xScale(pandemicPoint.year) + 92}
              y={yScale(pandemicPoint.value) - 38}
              className="fill-white text-[11px]"
            >
              -12% vs 2019
            </text>
          </g>
        ) : null}

        <text
          x={MARGIN.left}
          y={MARGIN.top - 14}
          className="fill-[#1a1a1a] text-[13px] font-semibold"
        >
          Global market size (USD billions)
        </text>
      </svg>
    </div>
  );
}
