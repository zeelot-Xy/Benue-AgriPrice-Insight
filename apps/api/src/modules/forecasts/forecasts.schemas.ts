import { z } from "zod";

export const forecastQuerySchema = z.object({
  marketId: z.coerce.number().int().positive(),
  commodityId: z.coerce.number().int().positive(),
  horizonWeeks: z.coerce.number().int().min(1).max(12).default(4),
});

export const forecastHistoryQuerySchema = z.object({
  marketId: z.coerce.number().int().positive().optional(),
  commodityId: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
