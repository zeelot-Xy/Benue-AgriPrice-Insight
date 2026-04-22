import { z } from "zod";

export const priceIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const listPricesQuerySchema = z.object({
  marketId: z.coerce.number().int().positive().optional(),
  commodityId: z.coerce.number().int().positive().optional(),
  from: z.string().date().optional(),
  to: z.string().date().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export const createPriceSchema = z.object({
  marketId: z.number().int().positive(),
  commodityId: z.number().int().positive(),
  priceDate: z.string().date(),
  price: z.number().positive(),
  unit: z.string().min(2),
  sourceNote: z.string().trim().optional().nullable(),
});

export const updatePriceSchema = createPriceSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided for update.",
);

export const importPricesSchema = z.object({
  fileName: z.string().min(1),
  csvContent: z.string().min(1),
});
