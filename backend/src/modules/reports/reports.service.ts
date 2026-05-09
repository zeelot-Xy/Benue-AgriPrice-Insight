import { analyticsService } from "../analytics/analytics.service.js";
import { prisma } from "../../lib/prisma.js";
import { averageDecimal, serializePriceRecord } from "../../utils/serializers.js";
import type { PriceRecord } from "@prisma/client";

export const reportsService = {
  async overview() {
    const [marketCount, commodityCount, priceRecordCount, latestRecord, activeAlerts] =
      await Promise.all([
        prisma.market.count(),
        prisma.commodity.count(),
        prisma.priceRecord.count(),
        prisma.priceRecord.findFirst({
          orderBy: { priceDate: "desc" },
        }),
        analyticsService.activeAlertCount(),
      ]);

    return {
      counts: {
        markets: marketCount,
        commodities: commodityCount,
        priceRecords: priceRecordCount,
        activeAlerts,
      },
      latestPriceDate: latestRecord?.priceDate.toISOString().slice(0, 10) ?? null,
    };
  },

  async latestPrices(commodityId?: number) {
    const latestByCommodity = commodityId
      ? [{ commodityId }]
      : await prisma.priceRecord.groupBy({
          by: ["commodityId"],
        });

    const items = await Promise.all(
      latestByCommodity.map(async (entry: { commodityId: number }) => {
        const latestRecord = await prisma.priceRecord.findFirst({
          where: {
            commodityId: entry.commodityId,
          },
          orderBy: { priceDate: "desc" },
        });

        if (!latestRecord) {
          return null;
        }

        const records = await prisma.priceRecord.findMany({
          where: {
            commodityId: entry.commodityId,
            priceDate: latestRecord.priceDate,
          },
          include: {
            market: true,
            commodity: true,
          },
          orderBy: {
            market: {
              name: "asc",
            },
          },
        });

        return {
          commodity: {
            id: records[0]!.commodity.id,
            name: records[0]!.commodity.name,
            slug: records[0]!.commodity.slug,
          },
          priceDate: latestRecord.priceDate.toISOString().slice(0, 10),
          stateAveragePrice: averageDecimal(
            records.map((record: PriceRecord) => record.price),
          ),
          entries: records.map(serializePriceRecord),
        };
      }),
    );

    return items.filter(Boolean);
  },
};
