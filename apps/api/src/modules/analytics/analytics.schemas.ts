import { z } from "zod";

export const analyticsFilterSchema = z.object({
  marketId: z.coerce.number().int().positive().optional(),
  commodityId: z.coerce.number().int().positive().optional(),
  from: z.string().date().optional(),
  to: z.string().date().optional(),
});

export const trendsQuerySchema = analyticsFilterSchema.extend({
  stableThresholdPercent: z.coerce.number().min(0).max(100).optional().default(3),
});

export const alertsQuerySchema = analyticsFilterSchema.extend({
  thresholdPercent: z.coerce.number().min(0).max(100).optional().default(10),
});

export const comparisonsQuerySchema = z.object({
  commodityId: z.coerce.number().int().positive(),
  priceDate: z.string().date().optional(),
});

export const seasonalityQuerySchema = analyticsFilterSchema;

export const stateAverageQuerySchema = analyticsFilterSchema;
