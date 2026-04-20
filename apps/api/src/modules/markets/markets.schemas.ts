import { z } from "zod";

export const marketIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createMarketSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2).max(10).toUpperCase(),
  localGovernmentArea: z.string().min(2),
  state: z.string().min(2).default("Benue"),
  isActive: z.boolean().optional(),
});

export const updateMarketSchema = createMarketSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided for update.",
);
