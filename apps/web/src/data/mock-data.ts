export const dashboardSummary = {
  totalMarkets: 4,
  totalCommodities: 8,
  latestWeekEnding: "2026-04-18",
  activeAlerts: 6,
  averageConfidence: "Medium",
};

export const weeklyPriceSeries = [
  { week: "Mar 01", yam: 5200, rice: 4120, maize: 2750, beans: 3600 },
  { week: "Mar 08", yam: 5350, rice: 4210, maize: 2810, beans: 3740 },
  { week: "Mar 15", yam: 5480, rice: 4350, maize: 2890, beans: 3810 },
  { week: "Mar 22", yam: 5560, rice: 4460, maize: 3010, beans: 3950 },
  { week: "Mar 29", yam: 5690, rice: 4540, maize: 3125, beans: 4020 },
  { week: "Apr 05", yam: 5810, rice: 4625, maize: 3190, beans: 4090 },
  { week: "Apr 12", yam: 5960, rice: 4730, maize: 3240, beans: 4180 },
  { week: "Apr 18", yam: 6040, rice: 4810, maize: 3310, beans: 4260 },
];

export const marketComparison = [
  { market: "Makurdi", soybean: 4120, millet: 2840, sorghum: 3010 },
  { market: "Gboko", soybean: 3980, millet: 2725, sorghum: 2950 },
  { market: "Zaki Biam", soybean: 4250, millet: 2910, sorghum: 3085 },
  { market: "Otukpo", soybean: 4040, millet: 2795, sorghum: 2990 },
];

export const forecastSeries = [
  { week: "Apr 18", actual: 6040, forecast: 6040, lower: 6040, upper: 6040 },
  { week: "Apr 25", actual: null, forecast: 6125, lower: 5960, upper: 6290 },
  { week: "May 02", actual: null, forecast: 6210, lower: 6005, upper: 6415 },
  { week: "May 09", actual: null, forecast: 6290, lower: 6050, upper: 6530 },
  { week: "May 16", actual: null, forecast: 6375, lower: 6080, upper: 6670 },
];

export const alerts = [
  {
    commodity: "Yam",
    market: "Makurdi",
    severity: "High",
    delta: "+12.7%",
    explanation:
      "Yam prices increased for three consecutive weekly entries and crossed the 10% alert threshold.",
  },
  {
    commodity: "Rice",
    market: "Otukpo",
    severity: "Medium",
    delta: "+8.1%",
    explanation:
      "Rice is moving upward steadily and is close to a cross-market spread concern.",
  },
  {
    commodity: "Millet",
    market: "Gboko",
    severity: "Medium",
    delta: "-10.5%",
    explanation:
      "Millet dropped sharply after two stable weeks, suggesting a possible short-term supply correction.",
  },
];

export const marketCards = [
  {
    name: "Makurdi",
    code: "MKD",
    lga: "Makurdi",
    focus: "Administrative and distribution hub",
    summary:
      "Most complete weekly coverage with strong influence on state-average movement.",
  },
  {
    name: "Gboko",
    code: "GBK",
    lga: "Gboko",
    focus: "Mid-belt aggregation market",
    summary:
      "Useful for detecting moderate price shifts in maize, millet, and soybean.",
  },
  {
    name: "Zaki Biam",
    code: "ZKB",
    lga: "Ukum",
    focus: "High-volume agricultural exchange",
    summary:
      "Often records the highest comparative prices for soybean and yam in the current dataset.",
  },
  {
    name: "Otukpo",
    code: "OTP",
    lga: "Otukpo",
    focus: "Southern Benue trade corridor",
    summary: "Important for cross-zone comparison and state average balancing.",
  },
];

export const seasonalityInsights = [
  {
    commodity: "Maize",
    month: "April",
    averagePrice: 3144,
    note:
      "Prices are gradually increasing toward the early planting period, with stronger variation between Makurdi and Zaki Biam.",
  },
  {
    commodity: "Beans",
    month: "April",
    averagePrice: 4035,
    note:
      "Beans remain firm across all markets, with only minor weekly dips in Gboko.",
  },
  {
    commodity: "Soybean",
    month: "April",
    averagePrice: 4098,
    note:
      "Soybean retains a premium in Zaki Biam and Makurdi, making it useful for market-comparison demonstrations.",
  },
];

export const adminTasks = [
  "Enter weekly price records for approved commodities only",
  "Upload CSV files that match the controlled import template",
  "Review failed import rows before resubmission",
  "Monitor alert explanations before communicating changes to users",
];

export const quickActions = [
  {
    title: "Upload Weekly CSV",
    caption: "Manual import only, no scraping or live feeds.",
  },
  {
    title: "Review Trend Alerts",
    caption: "Explainable thresholds first, forecast support second.",
  },
  {
    title: "Compare Markets",
    caption: "Makurdi, Gboko, Zaki Biam, and Otukpo only.",
  },
];

export const phase9Notes = {
  uiStatus: "Phase 9 interface built with mock-query data and API-ready structure.",
  integrationStatus:
    "Live backend integration is intentionally deferred to Phase 10.",
};
