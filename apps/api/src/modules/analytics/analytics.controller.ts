import type { Request, Response } from "express";

import {
  alertsQuerySchema,
  trendsQuerySchema,
} from "./analytics.schemas.js";
import { analyticsService } from "./analytics.service.js";

export const analyticsController = {
  async trends(req: Request, res: Response) {
    const query = trendsQuerySchema.parse(req.query);
    const result = await analyticsService.trends(query);
    res.json(result);
  },

  async alerts(req: Request, res: Response) {
    const query = alertsQuerySchema.parse(req.query);
    const result = await analyticsService.alerts(query);
    res.json(result);
  },
};
