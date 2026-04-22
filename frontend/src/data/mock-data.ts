export const dashboardSummary = {
  totalMarkets: 4,
  totalCommodities: 8,
  latestWeekEnding: "2026-04-18",
  activeAlerts: 6,
  averageConfidence: "Medium",
};

export const weeklyPriceSeries = [
  {
    week: "Mar 01",
    yam: 5200,
    cassava: 2380,
    rice: 4120,
    maize: 2750,
    beans: 3600,
    soybean: 3890,
    millet: 2610,
    sorghum: 2840,
  },
  {
    week: "Mar 08",
    yam: 5350,
    cassava: 2440,
    rice: 4210,
    maize: 2810,
    beans: 3740,
    soybean: 3945,
    millet: 2660,
    sorghum: 2880,
  },
  {
    week: "Mar 15",
    yam: 5480,
    cassava: 2495,
    rice: 4350,
    maize: 2890,
    beans: 3810,
    soybean: 4015,
    millet: 2715,
    sorghum: 2925,
  },
  {
    week: "Mar 22",
    yam: 5560,
    cassava: 2550,
    rice: 4460,
    maize: 3010,
    beans: 3950,
    soybean: 4070,
    millet: 2755,
    sorghum: 2960,
  },
  {
    week: "Mar 29",
    yam: 5690,
    cassava: 2620,
    rice: 4540,
    maize: 3125,
    beans: 4020,
    soybean: 4125,
    millet: 2790,
    sorghum: 2995,
  },
  {
    week: "Apr 05",
    yam: 5810,
    cassava: 2685,
    rice: 4625,
    maize: 3190,
    beans: 4090,
    soybean: 4180,
    millet: 2825,
    sorghum: 3030,
  },
  {
    week: "Apr 12",
    yam: 5960,
    cassava: 2740,
    rice: 4730,
    maize: 3240,
    beans: 4180,
    soybean: 4235,
    millet: 2865,
    sorghum: 3060,
  },
  {
    week: "Apr 18",
    yam: 6040,
    cassava: 2810,
    rice: 4810,
    maize: 3310,
    beans: 4260,
    soybean: 4098,
    millet: 2818,
    sorghum: 3009,
  },
];

export const marketComparison = [
  { market: "Makurdi", soybean: 4120, millet: 2840, sorghum: 3010 },
  { market: "Gboko", soybean: 3980, millet: 2725, sorghum: 2950 },
  { market: "Zaki Biam", soybean: 4250, millet: 2910, sorghum: 3085 },
  { market: "Otukpo", soybean: 4040, millet: 2795, sorghum: 2990 },
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
      "Soybean retains a premium in Zaki Biam and Makurdi, making it a strong commodity for cross-market analysis.",
  },
];

export const allCommoditySnapshot = [
  { commodity: "Yam", slug: "yam", averagePrice: 6040 },
  { commodity: "Cassava", slug: "cassava", averagePrice: 2810 },
  { commodity: "Rice", slug: "rice", averagePrice: 4810 },
  { commodity: "Maize", slug: "maize", averagePrice: 3310 },
  { commodity: "Beans", slug: "beans", averagePrice: 4260 },
  { commodity: "Soybean", slug: "soybean", averagePrice: 4098 },
  { commodity: "Millet", slug: "millet", averagePrice: 2818 },
  { commodity: "Sorghum", slug: "sorghum", averagePrice: 3009 },
];

export const adminTasks = [
  "Add weekly price records only for approved markets and commodities",
  "Upload CSV files that follow the approved BAPI format",
  "Check rows that failed validation before uploading again",
  "Review alert summaries before sharing updates with users",
];

export const quickActions = [
  {
    title: "Upload Weekly CSV",
    caption: "Add weekly market prices using the approved upload format.",
  },
  {
    title: "Review Trend Alerts",
    caption: "See which prices are rising, falling, or changing unusually.",
  },
  {
    title: "Compare Markets",
    caption: "Compare prices across Makurdi, Gboko, Zaki Biam, and Otukpo.",
  },
];

export const phase9Notes = {
  uiStatus: "The main monitoring tools are available on this screen.",
  integrationStatus:
    "Saved data is shown whenever live updates are not available.",
};
