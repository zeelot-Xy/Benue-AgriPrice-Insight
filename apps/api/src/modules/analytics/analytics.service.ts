import type { Commodity, Market, Prisma, PriceRecord } from "@prisma/client";

import { prisma } from "../../lib/prisma.js";
import { toDateOnly } from "../../utils/date.js";

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
};
