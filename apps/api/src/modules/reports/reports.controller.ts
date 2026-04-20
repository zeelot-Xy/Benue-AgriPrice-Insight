import type { Request, Response } from "express";

import { latestPricesQuerySchema } from "./reports.schemas.js";
import { reportsService } from "./reports.service.js";

export const reportsController = {
  async overview(_req: Request, res: Response) {
    const result = await reportsService.overview();
    res.json(result);
  },

  async latestPrices(req: Request, res: Response) {
    const query = latestPricesQuerySchema.parse(req.query);
    const result = await reportsService.latestPrices(query.commodityId);
    res.json(result);
  },
};
