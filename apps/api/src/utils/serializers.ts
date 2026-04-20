import type {
  Commodity,
  ImportBatch,
  Market,
  PriceRecord,
  Prisma,
  User,
} from "@prisma/client";

import { toDateOnly } from "./date.js";

type PriceRecordWithRelations = PriceRecord & {
  market?: Market;
  commodity?: Commodity;
  importBatch?: ImportBatch | null;
  createdBy?: User | null;
};

export function serializePriceRecord(record: PriceRecordWithRelations) {
  return {
    id: record.id,
    marketId: record.marketId,
    commodityId: record.commodityId,
    createdById: record.createdById,
    importBatchId: record.importBatchId,
    priceDate: toDateOnly(record.priceDate),
    price: Number(record.price),
    unit: record.unit,
    sourceNote: record.sourceNote,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    market: record.market
      ? {
          id: record.market.id,
          code: record.market.code,
          name: record.market.name,
        }
      : undefined,
    commodity: record.commodity
      ? {
          id: record.commodity.id,
          slug: record.commodity.slug,
          name: record.commodity.name,
        }
      : undefined,
  };
}

export function averageDecimal(values: Prisma.Decimal[]) {
  if (!values.length) {
    return 0;
  }

  const total = values.reduce((sum, value) => sum + Number(value), 0);
  return Number((total / values.length).toFixed(2));
}
