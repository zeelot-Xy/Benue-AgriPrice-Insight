import { z } from "zod";

export const submissionIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
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

export const rejectSubmissionSchema = z.object({
  reviewNote: z.string().trim().min(3).max(300).optional().nullable(),
});
