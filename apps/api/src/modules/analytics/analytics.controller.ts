import type { Request, Response } from "express";

import {
  alertsQuerySchema,
  comparisonsQuerySchema,
  seasonalityQuerySchema,
  stateAverageQuerySchema,
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

  async comparisons(req: Request, res: Response) {
    const query = comparisonsQuerySchema.parse(req.query);
    const result = await analyticsService.comparisons(query);
    res.json(result);
  },

  async seasonality(req: Request, res: Response) {
    const query = seasonalityQuerySchema.parse(req.query);
    const result = await analyticsService.seasonality(query);
    res.json(result);
  },

  async stateAverage(req: Request, res: Response) {
    const query = stateAverageQuerySchema.parse(req.query);
    const result = await analyticsService.stateAverage(query);
    res.json(result);
  },
};
