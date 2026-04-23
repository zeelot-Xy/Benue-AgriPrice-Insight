import { z } from "zod";

export const submissionIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const submissionReferenceCodeParamSchema = z.object({
  referenceCode: z.string().trim().min(4).max(40),
});

export const listPendingSubmissionsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(20).optional().default(10),
});

export const publicPriceUploadSchema = z.object({
  fileName: z.string().min(1),
  csvContent: z.string().min(1),
  submitterName: z.string().trim().min(2).max(100).optional().nullable(),
  submitterEmail: z.string().trim().email().optional().nullable(),
});

const manualSubmissionRowSchema = z.object({
  marketCode: z.string().trim().min(2).max(20),
  commoditySlug: z.string().trim().min(2).max(50),
  priceDate: z.string().date(),
  price: z.coerce.number().positive(),
  unit: z.string().trim().min(2).max(30),
  sourceNote: z.string().trim().max(200).optional().nullable(),
});

export const publicPriceManualSubmissionSchema = z.object({
  fileName: z.string().trim().min(1).max(120).optional().default("manual-price-entry.json"),
  submitterName: z.string().trim().min(2).max(100).optional().nullable(),
  submitterEmail: z.string().trim().email().optional().nullable(),
  rows: z.array(manualSubmissionRowSchema).min(1).max(100),
});

export const rejectSubmissionSchema = z.object({
  reviewNote: z.string().trim().min(3).max(300).optional().nullable(),
});
