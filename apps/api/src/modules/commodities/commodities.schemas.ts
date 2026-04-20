import { z } from "zod";

export const commodityIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createCommoditySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).max(40),
  defaultUnit: z.string().min(2),
  isActive: z.boolean().optional(),
});

export const updateCommoditySchema = createCommoditySchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided for update.",
);
