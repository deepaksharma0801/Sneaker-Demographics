export type GlobalPoint = {
  year: number;
  value: number;
};

export type CategoryPoint = {
  year: number;
  performance: number;
  lifestyle: number;
};

export type CountryMetric = {
  name: string;
  region: "North America" | "Europe" | "Asia-Pacific" | "Latin America" | "Middle East & Africa";
  sales2018: number;
  sales2026: number;
  growth: number;
  perCapita: number;
};

export const globalSales: GlobalPoint[] = [
  { year: 2018, value: 115 },
  { year: 2019, value: 122 },
  { year: 2020, value: 107 },
  { year: 2021, value: 130 },
  { year: 2022, value: 144 },
  { year: 2023, value: 156 },
  { year: 2024, value: 170 },
  { year: 2025, value: 184 },
  { year: 2026, value: 198 },
];

export const categorySeries: CategoryPoint[] = [
  { year: 2018, performance: 64, lifestyle: 51 },
  { year: 2019, performance: 66, lifestyle: 56 },
  { year: 2020, performance: 57, lifestyle: 50 },
  { year: 2021, performance: 62, lifestyle: 68 },
  { year: 2022, performance: 63, lifestyle: 73 },
  { year: 2023, performance: 64, lifestyle: 78 },
  { year: 2024, performance: 65, lifestyle: 85 },
  { year: 2025, performance: 66, lifestyle: 93 },
  { year: 2026, performance: 67, lifestyle: 101 },
];

export const countryMetrics: CountryMetric[] = [
  {
    name: "United States of America",
    region: "North America",
    sales2018: 24.5,
    sales2026: 32.8,
    growth: 4.2,
    perCapita: 97,
  },
  {
    name: "China",
    region: "Asia-Pacific",
    sales2018: 17.6,
    sales2026: 34.2,
    growth: 7.8,
    perCapita: 42,
  },
  {
    name: "India",
    region: "Asia-Pacific",
    sales2018: 6.1,
    sales2026: 15.4,
    growth: 9.1,
    perCapita: 11,
  },
  {
    name: "Japan",
    region: "Asia-Pacific",
    sales2018: 7.8,
    sales2026: 9.6,
    growth: 2.1,
    perCapita: 76,
  },
  {
    name: "Germany",
    region: "Europe",
    sales2018: 6.4,
    sales2026: 8.1,
    growth: 3.1,
    perCapita: 69,
  },
  {
    name: "United Kingdom",
    region: "Europe",
    sales2018: 5.5,
    sales2026: 7.2,
    growth: 3.6,
    perCapita: 74,
  },
  {
    name: "France",
    region: "Europe",
    sales2018: 4.9,
    sales2026: 6.3,
    growth: 3.3,
    perCapita: 61,
  },
  {
    name: "Brazil",
    region: "Latin America",
    sales2018: 5.2,
    sales2026: 8.4,
    growth: 5.8,
    perCapita: 34,
  },
  {
    name: "Mexico",
    region: "Latin America",
    sales2018: 3.1,
    sales2026: 5.2,
    growth: 6.0,
    perCapita: 29,
  },
  {
    name: "Nigeria",
    region: "Middle East & Africa",
    sales2018: 1.2,
    sales2026: 3.4,
    growth: 8.7,
    perCapita: 9,
  },
  {
    name: "South Africa",
    region: "Middle East & Africa",
    sales2018: 1.8,
    sales2026: 2.7,
    growth: 4.5,
    perCapita: 28,
  },
  {
    name: "Turkey",
    region: "Middle East & Africa",
    sales2018: 2.2,
    sales2026: 3.6,
    growth: 5.0,
    perCapita: 31,
  },
  {
    name: "Indonesia",
    region: "Asia-Pacific",
    sales2018: 2.6,
    sales2026: 5.7,
    growth: 7.2,
    perCapita: 18,
  },
  {
    name: "Canada",
    region: "North America",
    sales2018: 3.9,
    sales2026: 5.0,
    growth: 3.3,
    perCapita: 83,
  },
  {
    name: "Australia",
    region: "Asia-Pacific",
    sales2018: 3.4,
    sales2026: 4.6,
    growth: 3.1,
    perCapita: 88,
  },
];

export const regions = [
  { label: "North America", color: "#1f3a5f" },
  { label: "Europe", color: "#54677f" },
  { label: "Asia-Pacific", color: "#c46b2b" },
  { label: "Latin America", color: "#9b2c2c" },
  { label: "Middle East & Africa", color: "#2d6a5f" },
];
