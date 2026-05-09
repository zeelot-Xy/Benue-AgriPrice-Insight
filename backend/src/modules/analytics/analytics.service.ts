import type { Commodity, Market, Prisma, PriceRecord } from "@prisma/client";

import { HttpError } from "../../lib/http-error.js";
import { prisma } from "../../lib/prisma.js";
import { parseDateOnly, toDateOnly } from "../../utils/date.js";
import { averageDecimal } from "../../utils/serializers.js";

type PriceRecordWithRelations = PriceRecord & {
  market: Market;
  commodity: Commodity;
};

type FilterInput = {
  marketId?: number;
  commodityId?: number;
  from?: string;
  to?: string;
};

function buildWhere(input: FilterInput): Prisma.PriceRecordWhereInput {
  return {
    ...(input.marketId ? { marketId: input.marketId } : {}),
    ...(input.commodityId ? { commodityId: input.commodityId } : {}),
    ...(input.from || input.to
      ? {
          priceDate: {
            ...(input.from ? { gte: parseDateOnly(input.from) } : {}),
            ...(input.to ? { lte: parseDateOnly(input.to) } : {}),
          },
        }
      : {}),
  };
}

function percentageChange(current: number, previous: number) {
  if (previous === 0) {
    return 0;
  }

  return Number((((current - previous) / previous) * 100).toFixed(2));
}

function classifyTrend(changePercent: number, stableThresholdPercent: number) {
  if (changePercent > stableThresholdPercent) {
    return "UPWARD";
  }

  if (changePercent < -stableThresholdPercent) {
    return "DOWNWARD";
  }

  return "STABLE";
}

async function getFilteredPriceRecords(input: FilterInput) {
  return prisma.priceRecord.findMany({
    where: buildWhere(input),
    include: {
      market: true,
      commodity: true,
    },
    orderBy: [
      { commodityId: "asc" },
      { marketId: "asc" },
      { priceDate: "asc" },
    ],
  });
}

function monthLabel(month: number) {
  return new Date(Date.UTC(2026, month - 1, 1)).toLocaleString("en-US", {
    month: "long",
    timeZone: "UTC",
  });
}

export const analyticsService = {
  async trends(input: FilterInput & { stableThresholdPercent: number }) {
    const records = await getFilteredPriceRecords(input);
    const grouped = new Map<string, PriceRecordWithRelations[]>();

    for (const record of records) {
      const key = `${record.marketId}:${record.commodityId}`;
      const list = grouped.get(key) ?? [];
      list.push(record);
      grouped.set(key, list);
    }

    const items = [...grouped.values()]
      .map((series) => {
        if (series.length < 2) {
          return {
            market: {
              id: series[0]!.market.id,
              code: series[0]!.market.code,
              name: series[0]!.market.name,
            },
            commodity: {
              id: series[0]!.commodity.id,
              slug: series[0]!.commodity.slug,
              name: series[0]!.commodity.name,
            },
            status: "INSUFFICIENT_DATA",
            explanation: `Insufficient data for ${series[0]!.commodity.name} in ${series[0]!.market.name}. At least two records are required to detect a trend.`,
          };
        }

        const previous = series[series.length - 2]!;
        const current = series[series.length - 1]!;
        const currentPrice = Number(current.price);
        const previousPrice = Number(previous.price);
        const change = Number((currentPrice - previousPrice).toFixed(2));
        const changePercent = percentageChange(currentPrice, previousPrice);
        const trendDirection = classifyTrend(
          changePercent,
          input.stableThresholdPercent,
        );

        return {
          market: {
            id: current.market.id,
            code: current.market.code,
            name: current.market.name,
          },
          commodity: {
            id: current.commodity.id,
            slug: current.commodity.slug,
            name: current.commodity.name,
          },
          status: "OK",
          trendDirection,
          period: {
            previousDate: toDateOnly(previous.priceDate),
            currentDate: toDateOnly(current.priceDate),
          },
          values: {
            previousPrice,
            currentPrice,
            change,
            changePercent,
            unit: current.unit,
          },
          explanation: `${current.commodity.name} price in ${current.market.name} changed from ${previousPrice.toFixed(2)} to ${currentPrice.toFixed(2)} between ${toDateOnly(previous.priceDate)} and ${toDateOnly(current.priceDate)}, a ${changePercent.toFixed(2)}% change. The system classifies this as ${trendDirection.toLowerCase()}.`,
        };
      })
      .sort((a, b) => a.commodity.name.localeCompare(b.commodity.name) || a.market.name.localeCompare(b.market.name));

    return {
      stableThresholdPercent: input.stableThresholdPercent,
      count: items.length,
      items,
    };
  },

  async alerts(input: FilterInput & { thresholdPercent: number }) {
    const trendResults = await this.trends({
      ...input,
      stableThresholdPercent: input.thresholdPercent,
    });

    const items = [];

    for (const item of trendResults.items) {
      if (item.status !== "OK") {
        continue;
      }

      const values = item.values;

      if (!values) {
        continue;
      }

      if (Math.abs(values.changePercent) < input.thresholdPercent) {
        continue;
      }

      items.push({
        market: item.market,
        commodity: item.commodity,
        alertType:
          values.changePercent > 0 ? "PRICE_SPIKE" : "PRICE_DROP",
        severity:
          Math.abs(values.changePercent) >= input.thresholdPercent * 2
            ? "HIGH"
            : "MEDIUM",
        thresholdPercent: input.thresholdPercent,
        period: item.period,
        values,
        explanation: `${item.explanation} An alert is triggered because the absolute change exceeds the configured ${input.thresholdPercent}% threshold.`,
      });
    }

    return {
      thresholdPercent: input.thresholdPercent,
      count: items.length,
      items,
    };
  },

  async activeAlertCount() {
    const result = await this.alerts({ thresholdPercent: 10 });
    return result.count;
  },

  async comparisons(input: { commodityId: number; priceDate?: string }) {
    const commodity = await prisma.commodity.findUnique({
      where: { id: input.commodityId },
    });

    if (!commodity) {
      throw new HttpError(404, "Commodity not found for comparison.");
    }

    const latestDateRecord = input.priceDate
      ? { priceDate: parseDateOnly(input.priceDate) }
      : await prisma.priceRecord.findFirst({
          where: { commodityId: input.commodityId },
          orderBy: { priceDate: "desc" },
          select: { priceDate: true },
        });

    if (!latestDateRecord) {
      throw new HttpError(404, "No price records found for the selected commodity.");
    }

    const records = await prisma.priceRecord.findMany({
      where: {
        commodityId: input.commodityId,
        priceDate: latestDateRecord.priceDate,
      },
      include: {
        market: true,
        commodity: true,
      },
      orderBy: {
        price: "desc",
      },
    });

    if (!records.length) {
      throw new HttpError(404, "No price records found for the selected comparison date.");
    }

    const highest = records[0]!;
    const lowest = records[records.length - 1]!;
    const stateAveragePrice = averageDecimal(
      records.map((record: PriceRecordWithRelations) => record.price),
    );

    return {
      commodity: {
        id: commodity.id,
        slug: commodity.slug,
        name: commodity.name,
      },
      priceDate: toDateOnly(latestDateRecord.priceDate),
      stateAveragePrice,
      spread: Number((Number(highest.price) - Number(lowest.price)).toFixed(2)),
      highestMarket: {
        id: highest.market.id,
        code: highest.market.code,
        name: highest.market.name,
        price: Number(highest.price),
      },
      lowestMarket: {
        id: lowest.market.id,
        code: lowest.market.code,
        name: lowest.market.name,
        price: Number(lowest.price),
      },
      rankings: records.map((record: PriceRecordWithRelations, index: number) => ({
        rank: index + 1,
        market: {
          id: record.market.id,
          code: record.market.code,
          name: record.market.name,
        },
        price: Number(record.price),
        unit: record.unit,
      })),
      explanation: `${commodity.name} prices were compared across ${records.length} markets on ${toDateOnly(latestDateRecord.priceDate)}. ${highest.market.name} recorded the highest price while ${lowest.market.name} recorded the lowest price.`,
    };
  },

  async seasonality(input: FilterInput) {
    const records = await getFilteredPriceRecords(input);

    if (records.length < 4) {
      return {
        status: "INSUFFICIENT_DATA",
        explanation:
          "Insufficient data for seasonality analysis. At least four records are required for grouped monthly comparison.",
        items: [],
      };
    }

    const groups = new Map<
      string,
      {
        month: number;
        market: Market;
        commodity: Commodity;
        prices: number[];
        unit: string;
      }
    >();

    for (const record of records) {
      const month = record.priceDate.getUTCMonth() + 1;
      const key = `${record.marketId}:${record.commodityId}:${month}`;
      const existing = groups.get(key);

      if (existing) {
        existing.prices.push(Number(record.price));
      } else {
        groups.set(key, {
          month,
          market: record.market,
          commodity: record.commodity,
          prices: [Number(record.price)],
          unit: record.unit,
        });
      }
    }

    const items = [...groups.values()]
      .map((group) => {
        const averagePrice =
          group.prices.reduce((sum, value) => sum + value, 0) / group.prices.length;

        return {
          month: group.month,
          monthLabel: monthLabel(group.month),
          market: {
            id: group.market.id,
            code: group.market.code,
            name: group.market.name,
          },
          commodity: {
            id: group.commodity.id,
            slug: group.commodity.slug,
            name: group.commodity.name,
          },
          averagePrice: Number(averagePrice.toFixed(2)),
          observationCount: group.prices.length,
          unit: group.unit,
          explanation: `${group.commodity.name} in ${group.market.name} averaged ${averagePrice.toFixed(2)} during ${monthLabel(group.month)} across ${group.prices.length} observed record(s).`,
        };
      })
      .sort(
        (a, b) =>
          a.commodity.name.localeCompare(b.commodity.name) ||
          a.market.name.localeCompare(b.market.name) ||
          a.month - b.month,
      );

    return {
      status: "OK",
      count: items.length,
      items,
    };
  },

  async stateAverage(input: FilterInput) {
    const records = await getFilteredPriceRecords(input);

    const grouped = new Map<
      string,
      {
        commodity: Commodity;
        priceDate: string;
        prices: Prisma.Decimal[];
        availableMarkets: number;
        unit: string;
      }
    >();

    for (const record of records) {
      const key = `${record.commodityId}:${toDateOnly(record.priceDate)}`;
      const existing = grouped.get(key);

      if (existing) {
        existing.prices.push(record.price);
        existing.availableMarkets += 1;
      } else {
        grouped.set(key, {
          commodity: record.commodity,
          priceDate: toDateOnly(record.priceDate),
          prices: [record.price],
          availableMarkets: 1,
          unit: record.unit,
        });
      }
    }

    const items = [...grouped.values()]
      .map((group) => ({
        commodity: {
          id: group.commodity.id,
          slug: group.commodity.slug,
          name: group.commodity.name,
        },
        priceDate: group.priceDate,
        stateAveragePrice: averageDecimal(group.prices),
        availableMarkets: group.availableMarkets,
        expectedMarkets: 4,
        unit: group.unit,
        explanation:
          group.availableMarkets === 4
            ? `${group.commodity.name} state average on ${group.priceDate} is based on all four approved markets.`
            : `${group.commodity.name} state average on ${group.priceDate} is based on ${group.availableMarkets} available market record(s), not the full four-market set.`,
      }))
      .sort(
        (a, b) =>
          a.commodity.name.localeCompare(b.commodity.name) ||
          a.priceDate.localeCompare(b.priceDate),
      );

    return {
      count: items.length,
      items,
    };
  },
};
