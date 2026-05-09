import type {
  Commodity,
  ImportBatch,
  Market,
  PriceSubmissionBatch,
  PriceSubmissionRow,
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

type PriceSubmissionBatchWithRelations = PriceSubmissionBatch & {
  reviewedBy?: User | null;
  rows?: Array<
    PriceSubmissionRow & {
      market?: Market;
      commodity?: Commodity;
    }
  >;
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

export function serializePriceSubmissionBatch(
  batch: PriceSubmissionBatchWithRelations,
) {
  return {
    id: batch.id,
    publicReferenceCode: batch.publicReferenceCode,
    fileName: batch.fileName,
    submitterName: batch.submitterName,
    submitterEmail: batch.submitterEmail,
    sourceChannel: batch.sourceChannel,
    status: batch.status,
    totalRows: batch.totalRows,
    validRows: batch.validRows,
    invalidRows: batch.invalidRows,
    reviewNote: batch.reviewNote,
    reviewedAt: batch.reviewedAt?.toISOString() ?? null,
    createdAt: batch.createdAt.toISOString(),
    updatedAt: batch.updatedAt.toISOString(),
    reviewedBy: batch.reviewedBy
      ? {
          id: batch.reviewedBy.id,
          fullName: batch.reviewedBy.fullName,
          email: batch.reviewedBy.email,
        }
      : null,
    rows:
      batch.rows?.map((row: NonNullable<PriceSubmissionBatchWithRelations["rows"]>[number]) => ({
        id: row.id,
        marketId: row.marketId,
        commodityId: row.commodityId,
        marketCode: row.marketCode,
        commoditySlug: row.commoditySlug,
        priceDate: toDateOnly(row.priceDate),
        price: Number(row.price),
        unit: row.unit,
        sourceNote: row.sourceNote,
        market: row.market
          ? {
              id: row.market.id,
              code: row.market.code,
              name: row.market.name,
            }
          : undefined,
        commodity: row.commodity
          ? {
              id: row.commodity.id,
              slug: row.commodity.slug,
              name: row.commodity.name,
            }
          : undefined,
      })) ?? [],
  };
}

export function averageDecimal(values: Prisma.Decimal[]) {
  if (!values.length) {
    return 0;
  }

  const total = values.reduce((sum, value) => sum + Number(value), 0);
  return Number((total / values.length).toFixed(2));
}
