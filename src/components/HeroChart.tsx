import { area, curveMonotoneX, line, scaleLinear } from "d3";
import { globalSales } from "@/data/sneakerData";

const WIDTH = 980;
const HEIGHT = 320;
const MARGIN = { top: 30, right: 40, bottom: 40, left: 50 };

export default function HeroChart() {
  const xScale = scaleLinear()
    .domain([2018, 2026])
    .range([MARGIN.left, WIDTH - MARGIN.right]);

  const yScale = scaleLinear()
    .domain([
      Math.min(...globalSales.map((point) => point.value)) - 8,
      Math.max(...globalSales.map((point) => point.value)) + 8,
    ])
    .range([HEIGHT - MARGIN.bottom, MARGIN.top]);

  const linePath = line()
    .x((point: { year: number; value: number }) => xScale(point.year))
    .y((point: { year: number; value: number }) => yScale(point.value))
    .curve(curveMonotoneX)
    .defined((point: { value: number }) => Number.isFinite(point.value))(globalSales);

  const areaPath = area()
    .x((point: { year: number }) => xScale(point.year))
    .y0(HEIGHT - MARGIN.bottom)
    .y1((point: { value: number }) => yScale(point.value))
    .curve(curveMonotoneX)
    .defined((point: { value: number }) => Number.isFinite(point.value))(globalSales);

  return (
    <svg
      aria-hidden
      className="h-full w-full"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
    >
      <defs>
        <linearGradient id="heroLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f1c58b" />
          <stop offset="60%" stopColor="#e37c42" />
          <stop offset="100%" stopColor="#a33f2b" />
        </linearGradient>
        <linearGradient id="heroArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f1c58b" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#f1c58b" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect
        x="0"
        y="0"
        width={WIDTH}
        height={HEIGHT}
        fill="url(#heroArea)"
        opacity="0.2"
      />
      <path d={areaPath ?? ""} fill="url(#heroArea)" className="hero-area" />
      <path
        d={linePath ?? ""}
        fill="none"
        stroke="url(#heroLine)"
        strokeWidth="3"
        className="hero-line"
      />
    </svg>
  );
}
