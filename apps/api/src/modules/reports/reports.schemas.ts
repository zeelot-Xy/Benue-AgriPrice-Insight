import { z } from "zod";

export const latestPricesQuerySchema = z.object({
  commodityId: z.coerce.number().int().positive().optional(),
});
