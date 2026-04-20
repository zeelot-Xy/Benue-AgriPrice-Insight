import { ImportStatus } from "@prisma/client";

import { HttpError } from "../../lib/http-error.js";
import { prisma } from "../../lib/prisma.js";
import { parseCsvContent } from "../../utils/csv.js";
import { parseDateOnly } from "../../utils/date.js";
import { serializePriceRecord } from "../../utils/serializers.js";

type PriceInput = {
  marketId: number;
  commodityId: number;
  priceDate: string;
  price: number;
  unit: string;
  sourceNote?: string | null;
};

export const pricesService = {
  async list(input: {
    marketId?: number;
    commodityId?: number;
    from?: string;
    to?: string;
    page: number;
    limit: number;
  }) {
    const where = {
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

    const [items, total] = await Promise.all([
      prisma.priceRecord.findMany({
        where,
        include: {
          market: true,
          commodity: true,
        },
        orderBy: { priceDate: "desc" },
        skip: (input.page - 1) * input.limit,
        take: input.limit,
      }),
      prisma.priceRecord.count({ where }),
    ]);

    return {
      page: input.page,
      limit: input.limit,
      total,
      items: items.map(serializePriceRecord),
    };
  },

  async getById(id: number) {
    const record = await prisma.priceRecord.findUnique({
      where: { id },
      include: {
        market: true,
        commodity: true,
      },
    });

    if (!record) {
      throw new HttpError(404, "Price record not found.");
    }

    return serializePriceRecord(record);
  },

  async create(input: PriceInput, createdById: number) {
    await this.assertReferencesExist(input.marketId, input.commodityId);

    const record = await prisma.priceRecord.create({
      data: {
        marketId: input.marketId,
        commodityId: input.commodityId,
        createdById,
        priceDate: parseDateOnly(input.priceDate),
        price: input.price,
        unit: input.unit,
        sourceNote: input.sourceNote ?? null,
      },
      include: {
        market: true,
        commodity: true,
      },
    });

    return serializePriceRecord(record);
  },

  async update(
    id: number,
    input: Partial<PriceInput>,
    createdById: number,
  ) {
    const existing = await prisma.priceRecord.findUnique({ where: { id } });

    if (!existing) {
      throw new HttpError(404, "Price record not found.");
    }

    const marketId = input.marketId ?? existing.marketId;
    const commodityId = input.commodityId ?? existing.commodityId;
    await this.assertReferencesExist(marketId, commodityId);

    const record = await prisma.priceRecord.update({
      where: { id },
      data: {
        marketId,
        commodityId,
        createdById,
        ...(input.priceDate ? { priceDate: parseDateOnly(input.priceDate) } : {}),
        ...(typeof input.price === "number" ? { price: input.price } : {}),
        ...(input.unit ? { unit: input.unit } : {}),
        ...(input.sourceNote !== undefined ? { sourceNote: input.sourceNote } : {}),
      },
      include: {
        market: true,
        commodity: true,
      },
    });

    return serializePriceRecord(record);
  },

  async importFromCsv(input: { fileName: string; csvContent: string }, createdById: number) {
    const rows = parseCsvContent(input.csvContent);

    if (!rows.length) {
      throw new HttpError(400, "CSV import content is empty.");
    }

    const batch = await prisma.importBatch.create({
      data: {
        fileName: input.fileName,
        status: ImportStatus.PENDING,
        totalRows: rows.length,
        createdById,
      },
    });

    let successRows = 0;
    let failedRows = 0;
    const failures: Array<{ rowNumber: number; reason: string }> = [];

    for (const [index, row] of rows.entries()) {
      try {
        const market = await prisma.market.findUnique({
          where: { code: row.market_code },
        });
        const commodity = await prisma.commodity.findUnique({
          where: { slug: row.commodity_slug },
        });

        if (!market || !commodity) {
          throw new Error("Unknown market code or commodity slug.");
        }

        await prisma.priceRecord.upsert({
          where: {
            marketId_commodityId_priceDate_unit: {
              marketId: market.id,
              commodityId: commodity.id,
              priceDate: parseDateOnly(row.price_date),
              unit: row.unit,
            },
          },
          update: {
            price: Number(row.price),
            sourceNote: row.source_note || null,
            importBatchId: batch.id,
            createdById,
          },
          create: {
            marketId: market.id,
            commodityId: commodity.id,
            priceDate: parseDateOnly(row.price_date),
            price: Number(row.price),
            unit: row.unit,
            sourceNote: row.source_note || null,
            importBatchId: batch.id,
            createdById,
          },
        });

        successRows += 1;
      } catch (error) {
        failedRows += 1;
        failures.push({
          rowNumber: index + 2,
          reason: error instanceof Error ? error.message : "Unknown import error.",
        });
      }
    }

    const status =
      failedRows === 0
        ? ImportStatus.COMPLETED
        : successRows === 0
          ? ImportStatus.FAILED
          : ImportStatus.PARTIAL;

    const updatedBatch = await prisma.importBatch.update({
      where: { id: batch.id },
      data: {
        status,
        successRows,
        failedRows,
      },
    });

    return {
      importBatch: updatedBatch,
      failures,
    };
  },

  async assertReferencesExist(marketId: number, commodityId: number) {
    const [market, commodity] = await Promise.all([
      prisma.market.findUnique({ where: { id: marketId } }),
      prisma.commodity.findUnique({ where: { id: commodityId } }),
    ]);

    if (!market) {
      throw new HttpError(404, "Referenced market was not found.");
    }

    if (!commodity) {
      throw new HttpError(404, "Referenced commodity was not found.");
    }
  },
};
