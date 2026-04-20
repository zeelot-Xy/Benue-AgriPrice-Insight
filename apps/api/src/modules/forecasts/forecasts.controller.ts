import type { Request, Response } from "express";

import {
  forecastHistoryQuerySchema,
  forecastQuerySchema,
} from "./forecasts.schemas.js";
import { forecastsService } from "./forecasts.service.js";

export const forecastsController = {
  async generate(req: Request, res: Response) {
    const query = forecastQuerySchema.parse(req.query);
    const result = await forecastsService.generate(query);
    res.json(result);
  },

  async history(req: Request, res: Response) {
    const query = forecastHistoryQuerySchema.parse(req.query);
    const result = await forecastsService.history(query);
    res.json(result);
  },
};
