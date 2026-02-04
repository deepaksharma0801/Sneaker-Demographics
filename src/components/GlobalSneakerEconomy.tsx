"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CategoryEvolutionChart from "@/components/CategoryEvolutionChart";
import CategoryDonut from "@/components/CategoryDonut";
import GlobalMarketChart from "@/components/GlobalMarketChart";
import GrowthScatterPlot from "@/components/GrowthScatterPlot";
import GrowthIndexLine from "@/components/GrowthIndexLine";
import HeroChart from "@/components/HeroChart";
import GrowthLollipop from "@/components/GrowthLollipop";
import RegionalShareBars from "@/components/RegionalShareBars";
import RegionalRankBump from "@/components/RegionalRankBump";
import RegionalSparklines from "@/components/RegionalSparklines";
import SlopeChart from "@/components/SlopeChart";
import GrowthWaterfall from "@/components/GrowthWaterfall";
import RadialPerCapita from "@/components/RadialPerCapita";
import RegionalHeatmap from "@/components/RegionalHeatmap";
import ScrollProgress from "@/components/ScrollProgress";
import WorldMap from "@/components/WorldMap";
import YoYGrowthChart from "@/components/YoYGrowthChart";
import { countryMetrics, globalSales } from "@/data/sneakerData";

const steps = [
  {
    title: "Market growth over time",
    label: "Chapter 01",
    copy:
      "Sales climbed steadily from 2018 through 2019, then re-accelerated after a short shock. The line becomes a volume story as the decade matures.",
  },
  {
    title: "Pandemic shock",
    label: "Chapter 02",
    copy:
      "In 2020, global demand slipped sharply as retail froze. Recovery arrived fast with athleisure, e-commerce, and stimulus-fueled casualization.",
  },
  {
    title: "Regional power shift",
    label: "Chapter 03",
    copy:
      "Asia-Pacific carries the growth engine by 2026. The map highlights where momentum concentrates — a shift that reshapes distribution and design bets.",
  },
  {
    title: "Category evolution",
    label: "Chapter 04",
    copy:
      "Performance stays resilient, but lifestyle becomes the volume driver. The category mix tells a story of everyday wear and wellness culture.",
  },
  {
    title: "Momentum index",
    label: "Chapter 05",
    copy:
      "Indexed to 2018, global demand breaks through the 170 mark by 2024. The recovery wasn’t just a bounce—it reset the baseline.",
  },
  {
    title: "Heatmap of momentum",
    label: "Chapter 06",
    copy:
      "Regional heat intensifies late in the cycle. Asia-Pacific and North America widen the gap while emerging regions compress the mid-pack.",
  },
];

const stepAnnotations = [
  {
    title: "2019 pre-shock peak",
    value: "$122B",
    detail: "Demand before the dip",
    x: "12%",
    y: "18%",
  },
  {
    title: "2020 trough",
    value: "-12%",
    detail: "Sharpest YoY drop",
    x: "58%",
    y: "22%",
  },
  {
    title: "APAC surge",
    value: "+$16B",
    detail: "2018–2026 contribution",
    x: "16%",
    y: "62%",
  },
  {
    title: "Lifestyle lead",
    value: "60% share",
    detail: "By 2026",
    x: "56%",
    y: "24%",
  },
  {
    title: "Index reset",
    value: "170 by 2024",
    detail: "Demand baseline resets",
    x: "52%",
    y: "52%",
  },
  {
    title: "Heat intensifies",
    value: "2025–2026",
    detail: "Regional clusters expand",
    x: "60%",
    y: "20%",
  },
];

const panelThemes = [
  "from-[#fff7e6] via-[#ffffff] to-[#f5ede2]",
  "from-[#fbeae4] via-[#ffffff] to-[#f5efe8]",
  "from-[#eef4ff] via-[#ffffff] to-[#f3ece4]",
  "from-[#f6f0ff] via-[#ffffff] to-[#f6efe5]",
  "from-[#eaf6f6] via-[#ffffff] to-[#f4eee6]",
  "from-[#f3f0e8] via-[#ffffff] to-[#f8f2e8]",
];

function StoryStep({
  index,
  title,
  label,
  copy,
  setActive,
  isActive,
}: {
  index: number;
  title: string;
  label: string;
  copy: string;
  setActive: (index: number) => void;
  isActive: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(index);
        }
      },
      {
        rootMargin: "-35% 0px -45% 0px",
        threshold: 0.1,
      }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [index, setActive]);

  return (
    <div
      ref={ref}
      className={`min-h-[52vh] rounded-3xl border px-6 py-10 transition lg:px-8 lg:py-12 ${
        isActive
          ? "border-[#1a1a1a] bg-white shadow-[0_20px_60px_-40px_rgba(0,0,0,0.4)]"
          : "border-[#e0d7cc] bg-white/70"
      }`}
    >
      <p className="text-xs uppercase tracking-[0.2em] text-[#8c857c]">
        {label}
      </p>
      <h3 className="mt-3 font-display text-2xl text-[#1a1a1a] lg:text-3xl">
        {title}
      </h3>
      <p className="mt-4 text-sm leading-7 text-[#5b554e] lg:text-base">
        {copy}
      </p>
    </div>
  );
}

export default function GlobalSneakerEconomy() {
  const [activeStep, setActiveStep] = useState(0);

  const setActive = useCallback((index: number) => {
    setActiveStep(index);
  }, []);

  const totalGrowth = useMemo(() => {
    const first = globalSales[0].value;
    const last = globalSales[globalSales.length - 1].value;
    return Math.round(((last - first) / first) * 100);
  }, []);

  const fastestGrowth = useMemo(() => {
    return countryMetrics.reduce(
      (max, current) => (current.growth > max.growth ? current : max),
      countryMetrics[0]
    );
  }, []);

  const chartKey = useMemo(() => {
    return ["growth", "shock", "map", "categories", "index", "heatmap"][activeStep];
  }, [activeStep]);

  const progress = useMemo(() => {
    if (steps.length <= 1) return 0;
    return (activeStep / (steps.length - 1)) * 100;
  }, [activeStep]);

  const summaryStats = useMemo(
    () => [
      {
        label: "Global market size (2026)",
        value: `$${globalSales[globalSales.length - 1].value}B`,
        detail: `+${totalGrowth}% vs 2018`,
      },
      {
        label: "Pandemic dip (2020)",
        value: "-12%",
        detail: "Sharpest year-on-year drop in the period",
      },
      {
        label: "Fastest growth",
        value: `${fastestGrowth.name} +${fastestGrowth.growth}%`,
        detail: "Annual growth, 2018–2026",
      },
      {
        label: "Most saturated",
        value: "US $97",
        detail: "Per-capita spend (2026)",
      },
    ],
    [fastestGrowth, totalGrowth]
  );

  return (
    <div className="bg-[#f5f1ea] text-[#141414]">
      <ScrollProgress />
      <div className="border-b border-[#e3dbd1]">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-xs uppercase tracking-[0.2em] text-[#7d776f]">
          <span>Global Sneaker Economy</span>
          <span>2018 — 2026</span>
        </header>
      </div>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-60">
          <HeroChart />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#f5f1ea]/60 via-[#f5f1ea] to-[#f5f1ea]" />
        <div className="relative mx-auto grid min-h-[70vh] max-w-6xl items-center gap-10 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#8c857c]">
              Special Report
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-[#161616] sm:text-5xl lg:text-6xl">
              How the World Buys Sports Footwear (2018–2026)
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#5b554e] sm:text-lg">
              A scrollytelling look at the data, from the pandemic dip to the
              regional surge rewriting the sneaker playbook.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-[#6d665f]">
              <div>
                <div className="text-xs uppercase tracking-[0.2em]">Net growth</div>
                <div className="mt-2 text-2xl font-semibold text-[#1b1b1b]">
                  +{totalGrowth}%
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em]">Fastest market</div>
                <div className="mt-2 text-2xl font-semibold text-[#1b1b1b]">
                  {fastestGrowth.name}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em]">Peak year</div>
                <div className="mt-2 text-2xl font-semibold text-[#1b1b1b]">
                  2026
                </div>
              </div>
            </div>
            <div className="mt-10 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[#8c857c]">
              <span>Scroll to explore</span>
              <span className="scroll-cue h-[1px] w-16 bg-[#c46b2b]" />
            </div>
          </div>
          <div className="rounded-3xl border border-white/40 bg-white/70 p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.5)] backdrop-blur">
            <div className="text-xs uppercase tracking-[0.2em] text-[#8c857c]">
              Report highlights
            </div>
            <ul className="mt-4 space-y-4 text-sm text-[#4f4942]">
              <li>Direct-to-consumer expands margins and velocity.</li>
              <li>Lifestyle volume overtakes pure performance by mid-cycle.</li>
              <li>Asia-Pacific adds more than $16B in new demand.</li>
              <li>Growth markets outpace mature regions 2:1.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {summaryStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-[#e1d7cb] bg-white px-5 py-6 shadow-sm"
            >
              <div className="text-xs uppercase tracking-[0.2em] text-[#9a9187]">
                {stat.label}
              </div>
              <div className="mt-3 text-2xl font-semibold text-[#1b1b1b]">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-[#6a635b]">{stat.detail}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 pb-24 pt-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative space-y-10 pl-12">
          <div className="absolute left-5 top-0 h-full w-px bg-[#e1d7cb]" />
          <div
            className="absolute left-5 top-0 w-px bg-[#1f3a5f] transition-all duration-500"
            style={{ height: `${progress}%` }}
          />
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              <div
                className={`absolute -left-[52px] top-10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold transition ${
                  activeStep === index
                    ? "border-[#1f3a5f] bg-[#1f3a5f] text-white"
                    : "border-[#d9d0c5] bg-white text-[#8c857c]"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </div>
              <StoryStep
                index={index}
                title={step.title}
                label={step.label}
                copy={step.copy}
                setActive={setActive}
                isActive={activeStep === index}
              />
            </div>
          ))}
        </div>

        <div className="lg:sticky lg:top-20 lg:h-[520px]">
          <div className="relative h-full rounded-3xl border border-[#e1d7cb] bg-white/80 p-6 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.45)] backdrop-blur">
            <AnimatePresence mode="wait">
              <motion.div
                key={`bg-${activeStep}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className={`pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br ${panelThemes[activeStep]}`}
              />
            </AnimatePresence>

            <div className="relative z-10 flex h-full flex-col gap-4">
              <div className="relative flex-1 min-h-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={chartKey}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35 }}
                    className="relative h-full"
                  >
                    {chartKey === "map" ? (
                      <WorldMap />
                    ) : chartKey === "categories" ? (
                      <CategoryEvolutionChart />
                    ) : chartKey === "index" ? (
                      <GrowthIndexLine />
                    ) : chartKey === "heatmap" ? (
                      <RegionalHeatmap />
                    ) : (
                      <GlobalMarketChart variant={chartKey as "growth" | "shock"} />
                    )}
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`badge-${activeStep}`}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-6 top-5 rounded-full border border-[#e1d7cb] bg-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-[#8c857c]"
                  >
                    {steps[activeStep].label}
                  </motion.div>
                </AnimatePresence>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`annotation-${activeStep}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl border border-white/50 bg-white/90 px-4 py-3 text-xs text-[#3b3530] shadow-lg"
                >
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#8c857c]">
                    Chapter takeaway
                  </div>
                  <div className="mt-1 text-sm font-semibold text-[#1b1b1b]">
                    {stepAnnotations[activeStep]?.title}
                  </div>
                  <div className="text-lg font-semibold text-[#c46b2b]">
                    {stepAnnotations[activeStep]?.value}
                  </div>
                  <div className="text-[11px] text-[#6d665f]">
                    {stepAnnotations[activeStep]?.detail}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e3dbd1] bg-[#f8f3ed]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-col gap-4">
            <p className="text-xs uppercase tracking-[0.25em] text-[#8c857c]">
              Analyst workbench
            </p>
            <h2 className="font-display text-3xl text-[#1a1a1a]">
              Additional views on the global sneaker economy
            </h2>
            <p className="max-w-2xl text-base leading-7 text-[#5b554e]">
              Four extra lenses that round out the story: regional contribution,
              per-capita intensity, market trajectories, and year-over-year
              momentum. Together with the scrollytelling chapter above, the report
              now includes eight distinct data visualizations.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-[#e1d7cb] bg-white p-6 shadow-sm">
              <RegionalShareBars />
            </div>
            <div className="rounded-3xl border border-[#e1d7cb] bg-white p-6 shadow-sm">
              <YoYGrowthChart />
            </div>
            <div className="rounded-3xl border border-[#e1d7cb] bg-white p-6 shadow-sm">
              <GrowthScatterPlot />
            </div>
            <div className="rounded-3xl border border-[#e1d7cb] bg-white p-6 shadow-sm">
              <SlopeChart />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e3dbd1] bg-white/70">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-col gap-4">
            <p className="text-xs uppercase tracking-[0.25em] text-[#8c857c]">
              Creative lab
            </p>
            <h2 className="font-display text-3xl text-[#1a1a1a]">
              Alternative visuals for the same story
            </h2>
            <p className="max-w-2xl text-base leading-7 text-[#5b554e]">
              These views push the visual language further: a dual-ring donut for
              category mix, a regional bump chart, and a lollipop ranking of the
              fastest growers.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-[#e1d7cb] bg-white p-6 shadow-sm">
              <CategoryDonut />
            </div>
            <div className="rounded-3xl border border-[#e1d7cb] bg-white p-6 shadow-sm">
              <RegionalRankBump />
            </div>
            <div className="rounded-3xl border border-[#e1d7cb] bg-white p-6 shadow-sm">
              <GrowthLollipop />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e3dbd1] bg-[#f8f3ed]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-col gap-4">
            <p className="text-xs uppercase tracking-[0.25em] text-[#8c857c]">
              Signal room
            </p>
            <h2 className="font-display text-3xl text-[#1a1a1a]">
              Pattern discovery views
            </h2>
            <p className="max-w-2xl text-base leading-7 text-[#5b554e]">
              A heatmap surfaces momentum, a waterfall shows which regions fuel the
              growth jump, and a radial chart emphasizes per-capita intensity.
            </p>
          </div>

          <div className="mt-10 rounded-3xl border border-[#e1d7cb] bg-white p-6 shadow-sm">
            <RegionalHeatmap />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-[#e1d7cb] bg-white p-6 shadow-sm">
              <GrowthWaterfall />
            </div>
            <div className="rounded-3xl border border-[#e1d7cb] bg-white p-6 shadow-sm">
              <RadialPerCapita />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e3dbd1] bg-white/70">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex flex-col gap-4">
            <p className="text-xs uppercase tracking-[0.25em] text-[#8c857c]">
              Pulse check
            </p>
            <h2 className="font-display text-3xl text-[#1a1a1a]">
              Quick-read signals by region
            </h2>
            <p className="max-w-2xl text-base leading-7 text-[#5b554e]">
              A demand index line to show macro cadence and a set of regional
              sparklines that reveal how each territory accelerates through the cycle.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-[#e1d7cb] bg-white p-6 shadow-sm">
              <GrowthIndexLine />
            </div>
            <RegionalSparklines />
          </div>
        </div>
      </section>

      <section className="border-t border-[#e3dbd1] bg-white/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="font-display text-3xl text-[#1a1a1a]">
              What drives the curve
            </h2>
            <p className="mt-4 text-base leading-7 text-[#5b554e]">
              The boom is not a single story. Performance demand stays resilient
              thanks to running, training, and team sports. Lifestyle growth is
              powered by everyday wear, collaborations, and the expansion of
              sneaker culture in emerging cities.
            </p>
            <p className="mt-4 text-base leading-7 text-[#5b554e]">
              Distribution shifts are just as important. Direct-to-consumer
              channels and regionalized assortments let brands move faster in the
              markets that are adding the most incremental volume.
            </p>
          </div>
          <div className="rounded-3xl border border-[#e1d7cb] bg-white px-6 py-8 shadow-sm">
            <div className="text-xs uppercase tracking-[0.2em] text-[#8c857c]">
              Methodology
            </div>
            <ul className="mt-4 space-y-4 text-sm text-[#5b554e]">
              <li>Data compiled from industry reports and modeled for 2018–2026.</li>
              <li>Values shown in USD billions, with directional signals.</li>
              <li>Regional shifts based on composite demand indicators.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
