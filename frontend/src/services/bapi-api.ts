import {
  adminTasks,
  alerts as fallbackAlerts,
  dashboardSummary,
  allCommoditySnapshot as fallbackAllCommoditySnapshot,
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

type SubmissionBatchRow = {
  id: number;
  marketId: number;
  commodityId: number;
  marketCode: string;
  commoditySlug: string;
  priceDate: string;
  price: number;
  unit: string;
  sourceNote: string | null;
  market?: { id: number; code: string; name: string };
  commodity?: { id: number; slug: string; name: string };
  currentOfficialValue?: {
    id: number;
    priceDate: string;
    price: number;
    unit: string;
    sourceNote: string | null;
  } | null;
};

type SubmissionBatch = {
  id: number;
  publicReferenceCode: string;
  fileName: string;
  submitterName: string | null;
  submitterEmail: string | null;
  sourceChannel: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  totalRows: number;
  validRows: number;
  invalidRows: number;
  reviewNote: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  reviewedBy: { id: number; fullName: string; email: string } | null;
  rows: SubmissionBatchRow[];
  affectedMarkets: Array<{ id: number; code: string; name: string }>;
  affectedCommodities: Array<{ id: number; slug: string; name: string }>;
  previewRows: SubmissionBatchRow[];
  impactSummary: {
    created: number;
    updated: number;
  };
};

type PublicPriceUploadResponse = {
  batch: SubmissionBatch;
  failures: Array<{
    rowNumber: number;
    reason: string;
  }>;
  message: string;
};

type PublicPriceManualEntryResponse = PublicPriceUploadResponse;

type PendingSubmissionBatchesResponse = {
  count: number;
  items: SubmissionBatch[];
};

type ApproveSubmissionResponse = {
  batch: SubmissionBatch;
  appliedRows: {
    created: number;
    updated: number;
  };
  message: string;
};

type RejectSubmissionResponse = {
  batch: SubmissionBatch;
  message: string;
};

type SubmissionStatusLookupResponse = {
  referenceCode: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  statusLabel: string;
  statusDescription: string;
  fileName: string;
  submittedAt: string;
  reviewedAt: string | null;
  totalRows: number;
  acceptedRows: number;
  excludedRows: number;
  reviewNote: string | null;
};

type IntegrationSource = "live" | "fallback";

const dashboardCommodityOrder = [
  "yam",
  "cassava",
  "rice",
  "maize",
  "beans",
  "soybean",
  "millet",
  "sorghum",
] as const;

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

function normalizeReferenceCode(value: string) {
  return value.trim().toUpperCase();
}

function slugifyLabel(value: string) {
  return value.toLowerCase().replaceAll(" ", "-");
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
    commoditySlug: item.commodity.slug,
    market: item.market.name,
    marketCode: item.market.code,
    severity:
      item.severity.charAt(0) + item.severity.slice(1).toLowerCase(),
    delta: `${item.values.changePercent > 0 ? "+" : ""}${item.values.changePercent.toFixed(1)}%`,
    explanation: item.explanation,
  }));
}

function buildMarketComparison(latestPrices: LatestPricesResponse) {
  const byMarket = new Map<string, Record<string, string | number>>();

  for (const commodity of latestPrices) {
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

function buildAllCommoditySnapshot(latestPrices: LatestPricesResponse) {
  return latestPrices
    .map((item) => ({
      commodity: item.commodity.name,
      slug: item.commodity.slug,
      averagePrice: item.stateAveragePrice,
    }))
    .sort(
      (left, right) =>
        dashboardCommodityOrder.indexOf(left.slug as (typeof dashboardCommodityOrder)[number]) -
        dashboardCommodityOrder.indexOf(right.slug as (typeof dashboardCommodityOrder)[number]),
    );
}

function buildSeasonalityCards(response: SeasonalityResponse) {
  if (response.status !== "OK") {
    return fallbackSeasonalityInsights;
  }

  const grouped = new Map<
    string,
    {
      commodity: string;
      commoditySlug: string;
      month: string;
      averagePrice: number[];
      notes: string[];
    }
  >();

  for (const item of response.items) {
    const key = `${item.commodity.slug}:${item.monthLabel}`;
    const current = grouped.get(key) ?? {
      commodity: item.commodity.name,
      commoditySlug: item.commodity.slug,
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
      commoditySlug: item.commoditySlug,
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

export async function submitPublicPriceUpload(input: {
  fileName: string;
  csvContent: string;
  submitterName?: string;
  submitterEmail?: string;
}) {
  return apiFetch<PublicPriceUploadResponse>("/submissions/public-upload", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function submitPublicPriceManualEntry(input: {
  fileName?: string;
  submitterName?: string;
  submitterEmail?: string;
  rows: Array<{
    marketCode: string;
    commoditySlug: string;
    priceDate: string;
    price: number;
    unit: string;
    sourceNote?: string;
  }>;
}) {
  return apiFetch<PublicPriceManualEntryResponse>("/submissions/public-entry", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getPendingSubmissionBatches(limit = 10) {
  return fetchJson<PendingSubmissionBatchesResponse>(
    `/submissions/pending?limit=${limit}`,
    true,
  );
}

export async function approveSubmissionBatch(id: number) {
  return apiFetch<ApproveSubmissionResponse>(`/submissions/${id}/approve`, {
    method: "POST",
    auth: true,
  });
}

export async function rejectSubmissionBatch(id: number, reviewNote?: string) {
  return apiFetch<RejectSubmissionResponse>(`/submissions/${id}/reject`, {
    method: "POST",
    auth: true,
    body: JSON.stringify({
      reviewNote,
    }),
  });
}

export async function lookupSubmissionStatus(referenceCode: string) {
  return fetchJson<SubmissionStatusLookupResponse>(
    `/submissions/status/${normalizeReferenceCode(referenceCode)}`,
  );
}

export async function getUploadPageData() {
  try {
    const [markets, commodities] = await Promise.all([
      fetchJson<Market[]>("/markets"),
      fetchJson<Commodity[]>("/commodities"),
    ]);

    return {
      source: "live" as IntegrationSource,
      note:
        "Public submissions are reviewed first and only affect official statistics after approval.",
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
        note: "Only the four approved Benue markets and eight approved commodities are accepted.",
      },
      scopeSummary: {
        markets: markets.map((item) => ({
          id: item.id,
          name: item.name,
          code: item.code,
        })),
        commodities: commodities.map((item) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          defaultUnit: item.defaultUnit,
        })),
      },
    };
  } catch {
    return {
      ...buildFallbackNote(
        "Live reference data is temporarily unavailable, but you can still prepare a submission using the approved BAPI format.",
      ),
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
        note: "Only the four approved Benue markets and eight approved commodities are accepted.",
      },
      scopeSummary: {
        markets: [
          { id: 1, name: "Makurdi", code: "MKD" },
          { id: 2, name: "Gboko", code: "GBK" },
          { id: 3, name: "Zaki Biam", code: "ZKB" },
          { id: 4, name: "Otukpo", code: "OTP" },
        ],
        commodities: [
          { id: 1, name: "Yam", slug: "yam", defaultUnit: "bag" },
          { id: 2, name: "Cassava", slug: "cassava", defaultUnit: "bag" },
          { id: 3, name: "Rice", slug: "rice", defaultUnit: "bag" },
          { id: 4, name: "Maize", slug: "maize", defaultUnit: "bag" },
          { id: 5, name: "Beans", slug: "beans", defaultUnit: "bag" },
          { id: 6, name: "Soybean", slug: "soybean", defaultUnit: "bag" },
          { id: 7, name: "Millet", slug: "millet", defaultUnit: "bag" },
          { id: 8, name: "Sorghum", slug: "sorghum", defaultUnit: "bag" },
        ],
      },
    };
  }
}

export async function getDashboardData() {
  try {
    const [overview, latestPrices, alerts, commodities, markets] = await Promise.all([
      fetchJson<ReportsOverviewResponse>("/reports/overview"),
      fetchJson<LatestPricesResponse>("/reports/latest-prices"),
      fetchJson<AlertsResponse>("/analytics/alerts"),
      fetchJson<Commodity[]>("/commodities"),
      fetchJson<Market[]>("/markets"),
    ]);
    const priceSeries = await fetchCommoditySeries(commodities, [...dashboardCommodityOrder]);

    return {
      source: "live" as IntegrationSource,
      note: "Official statistics are based on approved submissions and validated admin records.",
      commodityOptions: commodities
        .filter((commodity) =>
          dashboardCommodityOrder.includes(
            commodity.slug as (typeof dashboardCommodityOrder)[number],
          ),
        )
        .sort(
          (left, right) =>
            dashboardCommodityOrder.indexOf(left.slug as (typeof dashboardCommodityOrder)[number]) -
            dashboardCommodityOrder.indexOf(right.slug as (typeof dashboardCommodityOrder)[number]),
        )
        .map((commodity) => ({
          slug: commodity.slug,
          name: commodity.name,
        })),
      marketOptions: markets.map((market) => ({
        id: market.id,
        code: market.code,
        name: market.name,
      })),
      summary: {
        totalMarkets: overview.counts.markets,
        totalCommodities: overview.counts.commodities,
        latestWeekEnding: overview.latestPriceDate ?? "N/A",
        activeAlerts: overview.counts.activeAlerts,
        averageConfidence: "Live",
      },
      weeklyPriceSeries: combineWeeklySeries(priceSeries),
      allCommoditySnapshot: buildAllCommoditySnapshot(latestPrices),
      marketComparison: buildMarketComparison(latestPrices),
      alerts: mapAlerts(alerts.items),
      quickActions,
      phase9Notes: {
        uiStatus: "Current market indicators are available across the dashboard.",
        integrationStatus:
          "Reports, alerts, and weekly records are shown together in one public view.",
      },
    };
  } catch {
    return {
      ...buildFallbackNote(
        "Market data is temporarily unavailable, so this dashboard is showing saved data.",
      ),
      summary: dashboardSummary,
      commodityOptions: [
        { slug: "yam", name: "Yam" },
        { slug: "cassava", name: "Cassava" },
        { slug: "rice", name: "Rice" },
        { slug: "maize", name: "Maize" },
        { slug: "beans", name: "Beans" },
        { slug: "soybean", name: "Soybean" },
        { slug: "millet", name: "Millet" },
        { slug: "sorghum", name: "Sorghum" },
      ],
      marketOptions: [
        { id: 1, code: "MKD", name: "Makurdi" },
        { id: 2, code: "GBK", name: "Gboko" },
        { id: 3, code: "ZKB", name: "Zaki Biam" },
        { id: 4, code: "OTP", name: "Otukpo" },
      ],
      weeklyPriceSeries: fallbackWeeklyPriceSeries,
      allCommoditySnapshot: fallbackAllCommoditySnapshot,
      marketComparison: fallbackMarketComparison,
      alerts: fallbackAlerts.map((alert) => ({
        ...alert,
        commoditySlug: slugifyLabel(alert.commodity),
        marketCode: slugifyLabel(alert.market),
      })),
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
      note: "Official statistics are based on approved submissions and validated admin records.",
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
      comparisonCommodityOptions: latestPrices.map((item) => ({
        slug: item.commodity.slug,
        name: item.commodity.name,
      })),
      seasonalityInsights: buildSeasonalityCards(seasonality),
    };
  } catch {
    return {
      ...buildFallbackNote(
        "Market data is temporarily unavailable, so this page is showing saved data.",
      ),
      marketCards: fallbackMarketCards,
      comparison: fallbackMarketComparison,
      comparisonCommodityOptions: [
        { slug: "soybean", name: "Soybean" },
        { slug: "millet", name: "Millet" },
        { slug: "sorghum", name: "Sorghum" },
      ],
      seasonalityInsights: fallbackSeasonalityInsights,
    };
  }
}

export async function getAnalyticsData() {
  try {
    const [alerts, seasonality, commodities, latestPrices] = await Promise.all([
      fetchJson<AlertsResponse>("/analytics/alerts"),
      fetchJson<SeasonalityResponse>("/analytics/seasonality"),
      fetchJson<Commodity[]>("/commodities"),
      fetchJson<LatestPricesResponse>("/reports/latest-prices"),
    ]);
    const priceSeries = await fetchCommoditySeries(commodities, [...dashboardCommodityOrder], 40);

    return {
      source: "live" as IntegrationSource,
      note: "Official statistics are based on approved submissions and validated admin records.",
      commodityOptions: commodities
        .filter((commodity) =>
          dashboardCommodityOrder.includes(
            commodity.slug as (typeof dashboardCommodityOrder)[number],
          ),
        )
        .sort(
          (left, right) =>
            dashboardCommodityOrder.indexOf(left.slug as (typeof dashboardCommodityOrder)[number]) -
            dashboardCommodityOrder.indexOf(right.slug as (typeof dashboardCommodityOrder)[number]),
        )
        .map((commodity) => ({
          slug: commodity.slug,
          name: commodity.name,
        })),
      alerts: mapAlerts(alerts.items),
      seasonalityInsights: buildSeasonalityCards(seasonality),
      allCommoditySnapshot: buildAllCommoditySnapshot(latestPrices),
      weeklyPriceSeries: combineWeeklySeries(priceSeries),
    };
  } catch {
    return {
      ...buildFallbackNote(
        "Analytics are temporarily unavailable, so this page is showing saved data.",
      ),
      commodityOptions: [
        { slug: "yam", name: "Yam" },
        { slug: "cassava", name: "Cassava" },
        { slug: "rice", name: "Rice" },
        { slug: "maize", name: "Maize" },
        { slug: "beans", name: "Beans" },
        { slug: "soybean", name: "Soybean" },
        { slug: "millet", name: "Millet" },
        { slug: "sorghum", name: "Sorghum" },
      ],
      alerts: fallbackAlerts.map((alert) => ({
        ...alert,
        commoditySlug: slugifyLabel(alert.commodity),
        marketCode: slugifyLabel(alert.market),
      })),
      seasonalityInsights: fallbackSeasonalityInsights.map((item) => ({
        ...item,
        commoditySlug: slugifyLabel(item.commodity),
      })),
      allCommoditySnapshot: fallbackAllCommoditySnapshot,
      weeklyPriceSeries: fallbackWeeklyPriceSeries,
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
      note: "Only approved records feed the public dashboard, comparisons, and analytics.",
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
      marketOptions: markets.map((market) => ({
        id: market.id,
        code: market.code,
        name: market.name,
      })),
      commodityOptions: commodities.map((commodity) => ({
        id: commodity.id,
        slug: commodity.slug,
        name: commodity.name,
      })),
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
        marketCode: item.market?.code ?? "",
        commoditySlug: item.commodity?.slug ?? "",
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
        "Admin records are temporarily unavailable, so this workspace is showing saved data.",
      ),
      adminTasks,
      quickActions,
      summary: dashboardSummary,
      scopeSummary: {
        markets: 4,
        commodities: 8,
      },
      marketOptions: [
        { id: 1, code: "MKD", name: "Makurdi" },
        { id: 2, code: "GBK", name: "Gboko" },
        { id: 3, code: "ZKB", name: "Zaki Biam" },
        { id: 4, code: "OTP", name: "Otukpo" },
      ],
      commodityOptions: [
        { id: 1, slug: "yam", name: "Yam" },
        { id: 2, slug: "cassava", name: "Cassava" },
        { id: 3, slug: "rice", name: "Rice" },
        { id: 4, slug: "maize", name: "Maize" },
        { id: 5, slug: "beans", name: "Beans" },
        { id: 6, slug: "soybean", name: "Soybean" },
        { id: 7, slug: "millet", name: "Millet" },
        { id: 8, slug: "sorghum", name: "Sorghum" },
      ],
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
