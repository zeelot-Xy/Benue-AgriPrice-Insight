import type { Commodity, Market } from "@prisma/client";

import { HttpError } from "../../lib/http-error.js";
import { prisma } from "../../lib/prisma.js";
import { parseCsvContent } from "../../utils/csv.js";
import { parseDateOnly, toDateOnly } from "../../utils/date.js";
import { serializePriceSubmissionBatch } from "../../utils/serializers.js";

const SUBMISSION_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

type SubmissionStatus = (typeof SUBMISSION_STATUS)[keyof typeof SUBMISSION_STATUS];

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

type SubmissionBatchWithContext = Awaited<
  ReturnType<typeof fetchSubmissionBatchWithContext>
>;

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

function getPublicStatusMeta(status: SubmissionStatus) {
  switch (status) {
    case SUBMISSION_STATUS.APPROVED:
      return {
        label: "Approved",
        description:
          "This submission has been accepted into the official market dataset.",
      };
    case SUBMISSION_STATUS.REJECTED:
      return {
        label: "Rejected",
        description:
          "This submission was reviewed but was not added to the official market dataset.",
      };
    case SUBMISSION_STATUS.PENDING:
    default:
      return {
        label: "Under review",
        description:
          "This submission has been received and is waiting for administrator review.",
      };
  }
}

function formatReferenceCode(id: number) {
  const today = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `BAPI-${today}-${String(id).padStart(4, "0")}`;
}

function temporaryReferenceCode() {
  return `BAPI-TMP-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

async function resolveApprovedScope() {
  const [markets, commodities] = await Promise.all([
    prisma.market.findMany({ where: { isActive: true } }),
    prisma.commodity.findMany({ where: { isActive: true } }),
  ]);

  return {
    marketByCode: new Map<string, Market>(
      markets.map((market: Market) => [market.code, market]),
    ),
    commodityBySlug: new Map(
      commodities.map((commodity: Commodity) => [commodity.slug, commodity]),
    ) as Map<string, Commodity>,
  };
}

async function fetchSubmissionBatchWithContext(id: number) {
  const batch = await prisma.priceSubmissionBatch.findUnique({
    where: { id },
    include: {
      reviewedBy: true,
      rows: {
        orderBy: { id: "asc" },
        include: {
          market: true,
          commodity: true,
        },
      },
    },
  });

  if (!batch) {
    throw new HttpError(404, "Submission batch not found.");
  }

  const previewRows = batch.rows.slice(0, 5);
  const matchKeys = previewRows.map((row: (typeof batch.rows)[number]) => ({
    marketId: row.marketId,
    commodityId: row.commodityId,
    priceDate: row.priceDate,
    unit: row.unit,
  }));

  const officialMatches = matchKeys.length
    ? await Promise.all(
        matchKeys.map((key: (typeof matchKeys)[number]) =>
          prisma.priceRecord.findUnique({
            where: {
              marketId_commodityId_priceDate_unit: {
                marketId: key.marketId,
                commodityId: key.commodityId,
                priceDate: key.priceDate,
                unit: key.unit,
              },
            },
            include: {
              market: true,
              commodity: true,
            },
          }),
        ),
      )
    : [];

  const existingKeys = new Set<string>();

  if (batch.rows.length) {
    const groupedWhere = batch.rows.map((row: (typeof batch.rows)[number]) => ({
      marketId: row.marketId,
      commodityId: row.commodityId,
      priceDate: row.priceDate,
      unit: row.unit,
    }));

    const existingRecords = await prisma.priceRecord.findMany({
      where: {
        OR: groupedWhere,
      },
      select: {
        marketId: true,
        commodityId: true,
        priceDate: true,
        unit: true,
      },
    });

    for (const record of existingRecords) {
      existingKeys.add(
        `${record.marketId}:${record.commodityId}:${toDateOnly(record.priceDate)}:${record.unit}`,
      );
    }
  }

  return {
    batch,
    officialMatches,
    existingKeys,
  };
}

function buildSubmissionResponse(context: SubmissionBatchWithContext) {
  const { batch, officialMatches, existingKeys } = context;
  const serialized = serializePriceSubmissionBatch(batch);

  const affectedMarkets = Array.from(
    new Map(
      batch.rows.map((row: (typeof batch.rows)[number]) => [
        row.marketId,
        {
          id: row.marketId,
          code: row.market?.code ?? row.marketCode,
          name: row.market?.name ?? row.marketCode,
        },
      ]),
    ).values(),
  );

  const affectedCommodities = Array.from(
    new Map(
      batch.rows.map((row: (typeof batch.rows)[number]) => [
        row.commodityId,
        {
          id: row.commodityId,
          slug: row.commodity?.slug ?? row.commoditySlug,
          name: row.commodity?.name ?? row.commoditySlug,
        },
      ]),
    ).values(),
  );

  const previewRows = serialized.rows.slice(0, 5).map((row: (typeof serialized.rows)[number], index: number) => {
    const match = officialMatches[index];

    return {
      ...row,
      currentOfficialValue: match
        ? {
            id: match.id,
            priceDate: toDateOnly(match.priceDate),
            price: Number(match.price),
            unit: match.unit,
            sourceNote: match.sourceNote,
          }
        : null,
    };
  });

  let updated = 0;
  let created = 0;

  for (const row of batch.rows) {
    const rowKey = `${row.marketId}:${row.commodityId}:${toDateOnly(row.priceDate)}:${row.unit}`;

    if (existingKeys.has(rowKey)) {
      updated += 1;
    } else {
      created += 1;
    }
  }

  return {
    ...serialized,
    affectedMarkets,
    affectedCommodities,
    previewRows,
    impactSummary: {
      created,
      updated,
    },
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
    const createdBatch: { id: number } = await prisma.priceSubmissionBatch.create({
    data: {
      publicReferenceCode: temporaryReferenceCode(),
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
    select: {
      id: true,
    },
  });

  await prisma.priceSubmissionBatch.update({
    where: { id: createdBatch.id },
    data: {
      publicReferenceCode: formatReferenceCode(createdBatch.id),
    },
  });

  const context = await fetchSubmissionBatchWithContext(createdBatch.id);

  return {
    batch: buildSubmissionResponse(context),
    failures: input.failures,
    message: `Submission received. Reference code ${context.batch.publicReferenceCode}. Your submission is now under admin review.`,
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
          reason:
            error instanceof Error ? error.message : "Unknown validation error.",
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
          reason:
            error instanceof Error ? error.message : "Unknown validation error.",
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

  async getPublicStatus(referenceCode: string) {
    const batch = await prisma.priceSubmissionBatch.findUnique({
      where: { publicReferenceCode: referenceCode.trim().toUpperCase() },
    });

    if (!batch) {
      throw new HttpError(
        404,
        "No submission was found for that reference code. Check the code and try again.",
      );
    }

    const meta = getPublicStatusMeta(batch.status as SubmissionStatus);

    return {
      referenceCode: batch.publicReferenceCode,
      status: batch.status,
      statusLabel: meta.label,
      statusDescription: meta.description,
      fileName: batch.fileName,
      submittedAt: batch.createdAt.toISOString(),
      reviewedAt: batch.reviewedAt?.toISOString() ?? null,
      totalRows: batch.totalRows,
      acceptedRows: batch.validRows,
      excludedRows: batch.invalidRows,
      reviewNote: batch.reviewNote,
    };
  },

  async listPending(limit: number) {
    const batches: Array<{ id: number }> = await prisma.priceSubmissionBatch.findMany({
      where: { status: SUBMISSION_STATUS.PENDING },
      select: {
        id: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const items = await Promise.all(
      batches.map(async (item: { id: number }) =>
        buildSubmissionResponse(await fetchSubmissionBatchWithContext(item.id)),
      ),
    );

    return {
      count: items.length,
      items,
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
      throw new HttpError(
        400,
        "Only pending submission batches can be approved.",
      );
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

    await prisma.priceSubmissionBatch.update({
      where: { id: batch.id },
      data: {
        status: SUBMISSION_STATUS.APPROVED,
        reviewedById,
        reviewedAt: new Date(),
      },
    });

    const reviewed = buildSubmissionResponse(
      await fetchSubmissionBatchWithContext(batch.id),
    );

    return {
      batch: reviewed,
      appliedRows: {
        created,
        updated,
      },
      message: `${created + updated} records approved and added to official market data.`,
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
      throw new HttpError(
        400,
        "Only pending submission batches can be rejected.",
      );
    }

    await prisma.priceSubmissionBatch.update({
      where: { id: batch.id },
      data: {
        status: SUBMISSION_STATUS.REJECTED,
        reviewedById,
        reviewedAt: new Date(),
        reviewNote:
          reviewNote?.trim() ||
          "Submission rejected during review. The records were not added to the official market dataset.",
      },
    });

    const reviewed = buildSubmissionResponse(
      await fetchSubmissionBatchWithContext(batch.id),
    );

    return {
      batch: reviewed,
      message: "Submission rejected. No official statistics were changed.",
    };
  },
};
