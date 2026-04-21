import {
  adminTasks,
  alerts as fallbackAlerts,
  dashboardSummary,
  forecastSeries as fallbackForecastSeries,
  marketCards as fallbackMarketCards,
  marketComparison as fallbackMarketComparison,
  phase9Notes,
  quickActions,
  seasonalityInsights as fallbackSeasonalityInsights,
  weeklyPriceSeries as fallbackWeeklyPriceSeries,
} from "../data/mock-data";
import { apiFetch } from "../lib/api-client";

type Market = {
  id: number;
  name: string;
  code: string;
  localGovernmentArea: string;
  state: string;
  isActive: boolean;
};

type Commodity = {
  id: number;
  name: string;
  slug: string;
  defaultUnit: string;
  isActive: boolean;
};

type PriceRecord = {
  id: number;
  marketId: number;
  commodityId: number;
  priceDate: string;
  price: number;
  unit: string;
  market?: { id: number; code: string; name: string };
  commodity?: { id: number; slug: string; name: string };
};

type PriceListResponse = {
  page: number;
  limit: number;
  total: number;
  items: PriceRecord[];
};

type ReportsOverviewResponse = {
  counts: {
    markets: number;
    commodities: number;
    priceRecords: number;
    activeAlerts: number;
  };
  latestPriceDate: string | null;
};

type LatestPricesResponse = Array<{
  commodity: {
    id: number;
    name: string;
    slug: string;
  };
  priceDate: string;
  stateAveragePrice: number;
  entries: Array<
    PriceRecord & {
      market: { id: number; code: string; name: string };
      commodity: { id: number; slug: string; name: string };
    }
  >;
}>;

type AlertsResponse = {
  count: number;
  items: Array<{
    market: { id: number; code: string; name: string };
    commodity: { id: number; slug: string; name: string };
    alertType: string;
    severity: string;
    values: { changePercent: number };
    explanation: string;
  }>;
};

type SeasonalityResponse = {
  status: "OK" | "INSUFFICIENT_DATA";
  count?: number;
  items: Array<{
    month: number;
    monthLabel: string;
    market: { id: number; code: string; name: string };
    commodity: { id: number; slug: string; name: string };
    averagePrice: number;
    observationCount: number;
    unit: string;
    explanation: string;
  }>;
  explanation?: string;
};

type ForecastResponse =
  | {
      status: "OK";
      forecastRunId: number;
      market: { id: number; code: string; name: string };
      commodity: { id: number; slug: string; name: string };
      latestObserved: { priceDate: string; price: number; unit: string };
      projectedDirection: string;
      projectedChangePercent: number;
      forecast: Array<{
        price_date: string;
        predicted_price: number;
        lower_bound: number;
        upper_bound: number;
      }>;
      performance: {
        mae: number | null;
        mape: number | null;
        confidence_label: string;
        validation_method: string;
      } | null;
      explanation: string;
      warnings: string[];
    }
  | {
      status: "SERVICE_UNAVAILABLE" | "INSUFFICIENT_DATA" | "UNAVAILABLE";
      market?: { id: number; code: string; name: string };
      commodity?: { id: number; slug: string; name: string };
      explanation: string;
      warnings: string[];
    };

type ForecastHistoryResponse = {
  count: number;
  items: Array<{
    id: number;
    createdAt: string;
    modelName: string;
    horizonWeeks: number;
    market: { id: number; code: string; name: string };
    commodity: { id: number; slug: string; name: string };
    inputSummary: Record<string, unknown>;
    outputSummary: Record<string, unknown>;
    explanation: string;
  }>;
};

type LoginResponse = {
  token: string;
  user: {
    id: number;
    fullName: string;
    email: string;
    role: string;
  };
};

type CurrentUserResponse = {
  id: number;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
};

type ImportPricesResponse = {
  importBatch: {
    id: number;
    fileName: string;
    status: string;
    totalRows: number;
    successRows: number;
    failedRows: number;
    createdAt: string;
  };
  failures: Array<{
    rowNumber: number;
    reason: string;
  }>;
};

type IntegrationSource = "live" | "fallback";

const marketDescriptions: Record<
  string,
  { focus: string; summary: string }
> = {
  MKD: {
    focus: "Administrative and distribution hub",
    summary:
      "Most complete weekly coverage with strong influence on state-average movement.",
  },
  GBK: {
    focus: "Mid-belt aggregation market",
    summary:
      "Useful for detecting moderate price shifts in maize, millet, and soybean.",
  },
  ZKB: {
    focus: "High-volume agricultural exchange",
    summary:
      "Often records the highest comparative prices for soybean and yam in the current dataset.",
  },
  OTP: {
    focus: "Southern Benue trade corridor",
    summary: "Important for cross-zone comparison and state average balancing.",
  },
};

function formatWeekLabel(value: string) {
  return new Date(`${value}T00:00:00.000Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
  });
}

function buildFallbackNote(message: string) {
  return {
    source: "fallback" as const,
    note: message,
  };
}

async function fetchJson<T>(path: string, auth = false) {
  return apiFetch<T>(path, { auth });
}

function groupAverageSeries(records: PriceRecord[]) {
  const grouped = new Map<string, { total: number; count: number }>();

  for (const record of records) {
    const current = grouped.get(record.priceDate) ?? { total: 0, count: 0 };
    current.total += record.price;
    current.count += 1;
    grouped.set(record.priceDate, current);
  }

  return [...grouped.entries()]
    .map(([priceDate, stats]) => ({
      priceDate,
      averagePrice: Number((stats.total / stats.count).toFixed(2)),
    }))
    .sort((a, b) => a.priceDate.localeCompare(b.priceDate));
}

function combineWeeklySeries(
  seriesMap: Record<string, Array<{ priceDate: string; averagePrice: number }>>,
) {
  const dates = new Set<string>();

  Object.values(seriesMap).forEach((series) => {
    series.forEach((entry) => dates.add(entry.priceDate));
  });

  return [...dates]
    .sort((a, b) => a.localeCompare(b))
    .map((date) => ({
      week: formatWeekLabel(date),
      ...Object.fromEntries(
        Object.entries(seriesMap).map(([key, series]) => {
          const match = series.find((entry) => entry.priceDate === date);
          return [key, match?.averagePrice ?? null];
        }),
      ),
    }));
}

function mapAlerts(source: AlertsResponse["items"]) {
  return source.slice(0, 3).map((item) => ({
    commodity: item.commodity.name,
    market: item.market.name,
    severity:
      item.severity.charAt(0) + item.severity.slice(1).toLowerCase(),
    delta: `${item.values.changePercent > 0 ? "+" : ""}${item.values.changePercent.toFixed(1)}%`,
    explanation: item.explanation,
  }));
}

function buildMarketComparison(latestPrices: LatestPricesResponse) {
  const slugs = ["soybean", "millet", "sorghum"];
  const items = latestPrices.filter((item) => slugs.includes(item.commodity.slug));
  const byMarket = new Map<string, Record<string, string | number>>();

  for (const commodity of items) {
    for (const entry of commodity.entries) {
      const current = byMarket.get(entry.market.code) ?? {
        market: entry.market.name,
      };
      current[commodity.commodity.slug] = entry.price;
      byMarket.set(entry.market.code, current);
    }
  }

  return [...byMarket.values()];
}

function buildSeasonalityCards(response: SeasonalityResponse) {
  if (response.status !== "OK") {
    return fallbackSeasonalityInsights;
  }

  const grouped = new Map<
    string,
    { commodity: string; month: string; averagePrice: number[]; notes: string[] }
  >();

  for (const item of response.items) {
    const key = `${item.commodity.slug}:${item.monthLabel}`;
    const current = grouped.get(key) ?? {
      commodity: item.commodity.name,
      month: item.monthLabel,
      averagePrice: [],
      notes: [],
    };
    current.averagePrice.push(item.averagePrice);
    current.notes.push(item.explanation);
    grouped.set(key, current);
  }

  return [...grouped.values()]
    .map((item) => ({
      commodity: item.commodity,
      month: item.month,
      averagePrice: Number(
        (
          item.averagePrice.reduce((sum, value) => sum + value, 0) /
          item.averagePrice.length
        ).toFixed(2),
      ),
      note: item.notes[0]!,
    }))
    .sort((a, b) => a.commodity.localeCompare(b.commodity))
    .slice(0, 3);
}

async function fetchCommoditySeries(
  commodities: Commodity[],
  slugs: string[],
  limit = 40,
) {
  const commodityIds = slugs
    .map((slug) => commodities.find((item) => item.slug === slug))
    .filter((item): item is Commodity => Boolean(item));

  const responses = await Promise.all(
    commodityIds.map((commodity) =>
      fetchJson<PriceListResponse>(
        `/prices?commodityId=${commodity.id}&page=1&limit=${limit}`,
      ),
    ),
  );

  return Object.fromEntries(
    responses.map((response, index) => [
      commodityIds[index]!.slug,
      groupAverageSeries(response.items),
    ]),
  );
}

export async function authenticate(input: { email: string; password: string }) {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getCurrentUser() {
  return fetchJson<CurrentUserResponse>("/auth/me", true);
}

export async function importPricesCsv(input: {
  fileName: string;
  csvContent: string;
}) {
  return apiFetch<ImportPricesResponse>("/prices/import", {
    method: "POST",
    auth: true,
    body: JSON.stringify(input),
  });
}

export async function getDashboardData() {
  try {
    const [overview, latestPrices, alerts, commodities] = await Promise.all([
      fetchJson<ReportsOverviewResponse>("/reports/overview"),
      fetchJson<LatestPricesResponse>("/reports/latest-prices"),
      fetchJson<AlertsResponse>("/analytics/alerts"),
      fetchJson<Commodity[]>("/commodities"),
    ]);
    const priceSeries = await fetchCommoditySeries(commodities, [
      "yam",
      "rice",
      "beans",
    ]);

    return {
      source: "live" as IntegrationSource,
      note: "Dashboard data is being refreshed from the BAPI monitoring services.",
      summary: {
        totalMarkets: overview.counts.markets,
        totalCommodities: overview.counts.commodities,
        latestWeekEnding: overview.latestPriceDate ?? "N/A",
        activeAlerts: overview.counts.activeAlerts,
        averageConfidence: "Live",
      },
      weeklyPriceSeries: combineWeeklySeries(priceSeries),
      marketComparison: buildMarketComparison(latestPrices),
      alerts: mapAlerts(alerts.items),
      quickActions,
      phase9Notes: {
        uiStatus: "Current market indicators are available across the dashboard.",
        integrationStatus:
          "Reports, alerts, and weekly price records are synchronized into this view.",
      },
    };
  } catch {
    return {
      ...buildFallbackNote(
        "Live services are temporarily unavailable, so the dashboard is showing the most recent prepared snapshot.",
      ),
      summary: dashboardSummary,
      weeklyPriceSeries: fallbackWeeklyPriceSeries,
      marketComparison: fallbackMarketComparison,
      alerts: fallbackAlerts,
      quickActions,
      phase9Notes,
    };
  }
}

export async function getMarketData() {
  try {
    const [markets, latestPrices, seasonality] = await Promise.all([
      fetchJson<Market[]>("/markets"),
      fetchJson<LatestPricesResponse>("/reports/latest-prices"),
      fetchJson<SeasonalityResponse>("/analytics/seasonality"),
    ]);

    return {
      source: "live" as IntegrationSource,
      note: "Market summaries and seasonal notes are being drawn from current BAPI records.",
      marketCards: markets.map((market) => ({
        name: market.name,
        code: market.code,
        lga: market.localGovernmentArea,
        focus: marketDescriptions[market.code]?.focus ?? "Representative market",
        summary:
          marketDescriptions[market.code]?.summary ??
          "Live market metadata is active for this card.",
      })),
      comparison: buildMarketComparison(latestPrices),
      seasonalityInsights: buildSeasonalityCards(seasonality),
    };
  } catch {
    return {
      ...buildFallbackNote(
        "Market services are temporarily unavailable, so comparison cards are showing a prepared reference snapshot.",
      ),
      marketCards: fallbackMarketCards,
      comparison: fallbackMarketComparison,
      seasonalityInsights: fallbackSeasonalityInsights,
    };
  }
}

export async function getAnalyticsData() {
  try {
    const [alerts, seasonality, commodities] = await Promise.all([
      fetchJson<AlertsResponse>("/analytics/alerts"),
      fetchJson<SeasonalityResponse>("/analytics/seasonality"),
      fetchJson<Commodity[]>("/commodities"),
    ]);
    const priceSeries = await fetchCommoditySeries(commodities, ["maize"], 40);

    return {
      source: "live" as IntegrationSource,
      note: "Analytics panels are using current trend, alert, and seasonality calculations.",
      alerts: mapAlerts(alerts.items),
      seasonalityInsights: buildSeasonalityCards(seasonality),
      weeklyPriceSeries: combineWeeklySeries({
        maize: priceSeries.maize ?? [],
      }),
    };
  } catch {
    return {
      ...buildFallbackNote(
        "Analytics services are temporarily unavailable, so this page is showing a prepared reference snapshot.",
      ),
      alerts: fallbackAlerts,
      seasonalityInsights: fallbackSeasonalityInsights,
      weeklyPriceSeries: fallbackWeeklyPriceSeries,
    };
  }
}

export async function getForecastData() {
  try {
    const [markets, commodities, alerts, overview, history] = await Promise.all([
      fetchJson<Market[]>("/markets"),
      fetchJson<Commodity[]>("/commodities"),
      fetchJson<AlertsResponse>("/analytics/alerts"),
      fetchJson<ReportsOverviewResponse>("/reports/overview"),
      fetchJson<ForecastHistoryResponse>("/forecasts/history?limit=5"),
    ]);

    const market = markets.find((item) => item.code === "MKD") ?? markets[0];
    const commodity =
      commodities.find((item) => item.slug === "yam") ?? commodities[0];

    if (!market || !commodity) {
      throw new Error("Forecast defaults unavailable.");
    }

    const forecast = await fetchJson<ForecastResponse>(
      `/forecasts?marketId=${market.id}&commodityId=${commodity.id}&horizonWeeks=4`,
    );

    if (forecast.status !== "OK") {
      return {
        ...buildFallbackNote(forecast.explanation),
        summary: dashboardSummary,
        alerts: mapAlerts(alerts.items),
        forecastSeries: fallbackForecastSeries,
        forecastMeta: {
          status: forecast.status,
          market: market.name,
          commodity: commodity.name,
          explanation: forecast.explanation,
          confidenceLabel: "Unavailable",
          historyCount: history.count,
        },
      };
    }

    const forecastData = [
      {
        week: formatWeekLabel(forecast.latestObserved.priceDate),
        actual: forecast.latestObserved.price,
        forecast: forecast.latestObserved.price,
        lower: forecast.latestObserved.price,
        upper: forecast.latestObserved.price,
      },
      ...forecast.forecast.map((item) => ({
        week: formatWeekLabel(item.price_date),
        actual: null,
        forecast: item.predicted_price,
        lower: item.lower_bound,
        upper: item.upper_bound,
      })),
    ];

    return {
      source: "live" as IntegrationSource,
      note: "Forecast results are being generated from the active forecasting workflow and stored run history.",
      summary: {
        totalMarkets: overview.counts.markets,
        totalCommodities: overview.counts.commodities,
        latestWeekEnding: overview.latestPriceDate ?? "N/A",
        activeAlerts: overview.counts.activeAlerts,
        averageConfidence:
          forecast.performance?.confidence_label ?? "Unknown",
      },
      alerts: mapAlerts(alerts.items),
      forecastSeries: forecastData,
      forecastMeta: {
        status: forecast.status,
        market: forecast.market.name,
        commodity: forecast.commodity.name,
        explanation: forecast.explanation,
        confidenceLabel:
          forecast.performance?.confidence_label ?? "Unknown",
        historyCount: history.count,
      },
    };
  } catch {
    return {
      ...buildFallbackNote(
        "Forecast services are temporarily unavailable, so this page is showing a prepared projection snapshot.",
      ),
      summary: dashboardSummary,
      alerts: fallbackAlerts,
      forecastSeries: fallbackForecastSeries,
      forecastMeta: {
        status: "Fallback",
        market: "Makurdi",
        commodity: "Yam",
        explanation:
          "A saved projection view is being shown while live forecast generation is unavailable.",
        confidenceLabel: "Moderate",
        historyCount: 0,
      },
    };
  }
}

export async function getAdminData() {
  try {
    const [overview, markets, commodities, recentPrices] = await Promise.all([
      fetchJson<ReportsOverviewResponse>("/reports/overview"),
      fetchJson<Market[]>("/markets"),
      fetchJson<Commodity[]>("/commodities"),
      fetchJson<PriceListResponse>("/prices?page=1&limit=6"),
    ]);

    return {
      source: "live" as IntegrationSource,
      note: "Administrative counts and scope information are being read from the current system records.",
      adminTasks,
      quickActions,
      summary: {
        totalMarkets: overview.counts.markets,
        totalCommodities: overview.counts.commodities,
        latestWeekEnding: overview.latestPriceDate ?? "N/A",
        activeAlerts: overview.counts.activeAlerts,
        averageConfidence: "Connected",
      },
      scopeSummary: {
        markets: markets.length,
        commodities: commodities.length,
      },
      importTemplate: {
        acceptedFileTypes: ".csv",
        requiredColumns: [
          "market_code",
          "commodity_slug",
          "price_date",
          "price",
          "unit",
          "source_note",
        ],
        note: "Use one row per commodity, market, and week. Dates must be in YYYY-MM-DD format.",
      },
      recentRecords: recentPrices.items.map((item) => ({
        id: item.id,
        market: item.market?.name ?? `Market ${item.marketId}`,
        commodity: item.commodity?.name ?? `Commodity ${item.commodityId}`,
        priceDate: item.priceDate,
        price: item.price,
        unit: item.unit,
      })),
    };
  } catch {
    return {
      ...buildFallbackNote(
        "Administrative services are temporarily unavailable, so this workspace is showing a prepared summary snapshot.",
      ),
      adminTasks,
      quickActions,
      summary: dashboardSummary,
      scopeSummary: {
        markets: 4,
        commodities: 8,
      },
      importTemplate: {
        acceptedFileTypes: ".csv",
        requiredColumns: [
          "market_code",
          "commodity_slug",
          "price_date",
          "price",
          "unit",
          "source_note",
        ],
        note: "Use one row per commodity, market, and week. Dates must be in YYYY-MM-DD format.",
      },
      recentRecords: [],
    };
  }
}
