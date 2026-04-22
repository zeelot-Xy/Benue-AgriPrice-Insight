import { HttpError } from "../../lib/http-error.js";
import { prisma } from "../../lib/prisma.js";
import { parseCsvContent } from "../../utils/csv.js";
import { parseDateOnly } from "../../utils/date.js";
import { serializePriceSubmissionBatch } from "../../utils/serializers.js";

const SUBMISSION_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

type PublicUploadInput = {
  fileName: string;
  csvContent: string;
  submitterName?: string | null;
  submitterEmail?: string | null;
};

type ManualSubmissionRowInput = {
  marketCode: string;
  commoditySlug: string;
  priceDate: string;
  price: number;
  unit: string;
  sourceNote?: string | null;
};

type ManualSubmissionInput = {
  fileName: string;
  submitterName?: string | null;
  submitterEmail?: string | null;
  rows: ManualSubmissionRowInput[];
};

type ResolvedSubmissionRow = {
  marketId: number;
  commodityId: number;
  marketCode: string;
  commoditySlug: string;
  priceDate: Date;
  price: number;
  unit: string;
  sourceNote: string | null;
};

function assertDateOnly(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error("Dates must use YYYY-MM-DD format.");
  }

  const parsed = parseDateOnly(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Dates must be valid calendar dates.");
  }

  return parsed;
}

function assertPriceValue(value: string) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error("Price must be a positive number.");
  }

  return parsed;
}

async function resolveApprovedScope() {
  const [markets, commodities] = await Promise.all([
    prisma.market.findMany({ where: { isActive: true } }),
    prisma.commodity.findMany({ where: { isActive: true } }),
  ]);

  return {
    marketByCode: new Map(markets.map((market) => [market.code, market])),
    commodityBySlug: new Map(
      commodities.map((commodity) => [commodity.slug, commodity]),
    ),
  };
}

async function createSubmissionBatch(input: {
  fileName: string;
  submitterName?: string | null;
  submitterEmail?: string | null;
  totalRows: number;
  validRows: ResolvedSubmissionRow[];
  failures: Array<{ rowNumber: number; reason: string }>;
}) {
  const batch = await prisma.priceSubmissionBatch.create({
    data: {
      fileName: input.fileName,
      submitterName: input.submitterName?.trim() || null,
      submitterEmail: input.submitterEmail?.trim() || null,
      totalRows: input.totalRows,
      validRows: input.validRows.length,
      invalidRows: input.failures.length,
      rows: {
        create: input.validRows.map((row) => ({
          marketId: row.marketId,
          commodityId: row.commodityId,
          marketCode: row.marketCode,
          commoditySlug: row.commoditySlug,
          priceDate: row.priceDate,
          price: row.price,
          unit: row.unit,
          sourceNote: row.sourceNote,
        })),
      },
    },
    include: {
      rows: {
        include: {
          market: true,
          commodity: true,
        },
      },
    },
  });

  return {
    batch: serializePriceSubmissionBatch(batch),
    failures: input.failures,
    message:
      "Your submission has been received and placed in the review queue. It will not affect statistics until an admin approves it.",
  };
}

export const submissionsService = {
  async submitPublicUpload(input: PublicUploadInput) {
    const rows = parseCsvContent(input.csvContent);

    if (!rows.length) {
      throw new HttpError(400, "CSV upload content is empty.");
    }

    const { marketByCode, commodityBySlug } = await resolveApprovedScope();

    const failures: Array<{ rowNumber: number; reason: string }> = [];
    const validRows: ResolvedSubmissionRow[] = [];

    for (const [index, row] of rows.entries()) {
      try {
        const marketCode = row.market_code?.trim();
        const commoditySlug = row.commodity_slug?.trim();
        const unit = row.unit?.trim();

        if (!marketCode || !commoditySlug || !unit) {
          throw new Error(
            "market_code, commodity_slug, price_date, price, and unit are required.",
          );
        }

        const market = marketByCode.get(marketCode);
        const commodity = commodityBySlug.get(commoditySlug);

        if (!market || !commodity) {
          throw new Error("Unknown market code or commodity slug.");
        }

        validRows.push({
          marketId: market.id,
          commodityId: commodity.id,
          marketCode,
          commoditySlug,
          priceDate: assertDateOnly(row.price_date?.trim() ?? ""),
          price: assertPriceValue(row.price?.trim() ?? ""),
          unit,
          sourceNote: row.source_note?.trim() || null,
        });
      } catch (error) {
        failures.push({
          rowNumber: index + 2,
          reason: error instanceof Error ? error.message : "Unknown validation error.",
        });
      }
    }

    if (!validRows.length) {
      throw new HttpError(
        400,
        "No valid rows were found in this upload. Check the file format and approved scope before submitting again.",
      );
    }

    return createSubmissionBatch({
      fileName: input.fileName,
      submitterName: input.submitterName,
      submitterEmail: input.submitterEmail,
      totalRows: rows.length,
      validRows,
      failures,
    });
  },

  async submitManualEntry(input: ManualSubmissionInput) {
    const { marketByCode, commodityBySlug } = await resolveApprovedScope();
    const failures: Array<{ rowNumber: number; reason: string }> = [];
    const validRows: ResolvedSubmissionRow[] = [];

    for (const [index, row] of input.rows.entries()) {
      try {
        const marketCode = row.marketCode.trim();
        const commoditySlug = row.commoditySlug.trim();
        const unit = row.unit.trim();

        if (!marketCode || !commoditySlug || !unit) {
          throw new Error(
            "marketCode, commoditySlug, priceDate, price, and unit are required.",
          );
        }

        const market = marketByCode.get(marketCode);
        const commodity = commodityBySlug.get(commoditySlug);

        if (!market || !commodity) {
          throw new Error("Unknown market code or commodity slug.");
        }

        validRows.push({
          marketId: market.id,
          commodityId: commodity.id,
          marketCode,
          commoditySlug,
          priceDate: assertDateOnly(row.priceDate),
          price: assertPriceValue(String(row.price)),
          unit,
          sourceNote: row.sourceNote?.trim() || null,
        });
      } catch (error) {
        failures.push({
          rowNumber: index + 1,
          reason: error instanceof Error ? error.message : "Unknown validation error.",
        });
      }
    }

    if (!validRows.length) {
      throw new HttpError(
        400,
        "No valid rows were found in this manual submission. Review the selected market, commodity, date, and price values.",
      );
    }

    return createSubmissionBatch({
      fileName: input.fileName,
      submitterName: input.submitterName,
      submitterEmail: input.submitterEmail,
      totalRows: input.rows.length,
      validRows,
      failures,
    });
  },

  async listPending(limit: number) {
    const items = await prisma.priceSubmissionBatch.findMany({
      where: { status: SUBMISSION_STATUS.PENDING },
      include: {
        rows: {
          take: 5,
          orderBy: { id: "asc" },
          include: {
            market: true,
            commodity: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return {
      count: items.length,
      items: items.map(serializePriceSubmissionBatch),
    };
  },

  async approve(id: number, reviewedById: number) {
    const batch = await prisma.priceSubmissionBatch.findUnique({
      where: { id },
      include: {
        rows: true,
      },
    });

    if (!batch) {
      throw new HttpError(404, "Submission batch not found.");
    }

    if (batch.status !== SUBMISSION_STATUS.PENDING) {
      throw new HttpError(400, "Only pending submission batches can be approved.");
    }

    let created = 0;
    let updated = 0;

    for (const row of batch.rows) {
      const existing = await prisma.priceRecord.findUnique({
        where: {
          marketId_commodityId_priceDate_unit: {
            marketId: row.marketId,
            commodityId: row.commodityId,
            priceDate: row.priceDate,
            unit: row.unit,
          },
        },
      });

      await prisma.priceRecord.upsert({
        where: {
          marketId_commodityId_priceDate_unit: {
            marketId: row.marketId,
            commodityId: row.commodityId,
            priceDate: row.priceDate,
            unit: row.unit,
          },
        },
        update: {
          price: row.price,
          sourceNote: row.sourceNote,
          createdById: reviewedById,
        },
        create: {
          marketId: row.marketId,
          commodityId: row.commodityId,
          priceDate: row.priceDate,
          price: row.price,
          unit: row.unit,
          sourceNote: row.sourceNote,
          createdById: reviewedById,
        },
      });

      if (existing) {
        updated += 1;
      } else {
        created += 1;
      }
    }

    const reviewedBatch = await prisma.priceSubmissionBatch.update({
      where: { id: batch.id },
      data: {
        status: SUBMISSION_STATUS.APPROVED,
        reviewedById,
        reviewedAt: new Date(),
      },
      include: {
        reviewedBy: true,
        rows: {
          include: {
            market: true,
            commodity: true,
          },
        },
      },
    });

    return {
      batch: serializePriceSubmissionBatch(reviewedBatch),
      appliedRows: {
        created,
        updated,
      },
      message:
        "The submission batch has been approved and the validated records are now part of the monitored dataset.",
    };
  },

  async reject(id: number, reviewedById: number, reviewNote?: string | null) {
    const batch = await prisma.priceSubmissionBatch.findUnique({
      where: { id },
    });

    if (!batch) {
      throw new HttpError(404, "Submission batch not found.");
    }

    if (batch.status !== SUBMISSION_STATUS.PENDING) {
      throw new HttpError(400, "Only pending submission batches can be rejected.");
    }

    const reviewedBatch = await prisma.priceSubmissionBatch.update({
      where: { id: batch.id },
      data: {
        status: SUBMISSION_STATUS.REJECTED,
        reviewedById,
        reviewedAt: new Date(),
        reviewNote:
          reviewNote?.trim() ||
          "Submission rejected during review. The records were not added to the monitored dataset.",
      },
      include: {
        reviewedBy: true,
        rows: {
          include: {
            market: true,
            commodity: true,
          },
        },
      },
    });

    return {
      batch: serializePriceSubmissionBatch(reviewedBatch),
      message:
        "The submission batch has been rejected and remains excluded from dashboard statistics and analytics.",
    };
  },
};
