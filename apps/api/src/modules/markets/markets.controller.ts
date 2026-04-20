import type { Request, Response } from "express";

import {
  createMarketSchema,
  marketIdParamSchema,
  updateMarketSchema,
} from "./markets.schemas.js";
import { marketsService } from "./markets.service.js";

export const marketsController = {
  async list(_req: Request, res: Response) {
    const result = await marketsService.list();
    res.json(result);
  },

  async getById(req: Request, res: Response) {
    const { id } = marketIdParamSchema.parse(req.params);
    const result = await marketsService.getById(id);
    res.json(result);
  },

  async create(req: Request, res: Response) {
    const payload = createMarketSchema.parse(req.body);
    const result = await marketsService.create(payload);
    res.status(201).json(result);
  },

  async update(req: Request, res: Response) {
    const { id } = marketIdParamSchema.parse(req.params);
    const payload = updateMarketSchema.parse(req.body);
    const result = await marketsService.update(id, payload);
    res.json(result);
  },
};
