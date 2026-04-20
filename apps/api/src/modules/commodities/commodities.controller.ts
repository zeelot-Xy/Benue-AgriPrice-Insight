import type { Request, Response } from "express";

import {
  commodityIdParamSchema,
  createCommoditySchema,
  updateCommoditySchema,
} from "./commodities.schemas.js";
import { commoditiesService } from "./commodities.service.js";

export const commoditiesController = {
  async list(_req: Request, res: Response) {
    const result = await commoditiesService.list();
    res.json(result);
  },

  async getById(req: Request, res: Response) {
    const { id } = commodityIdParamSchema.parse(req.params);
    const result = await commoditiesService.getById(id);
    res.json(result);
  },

  async create(req: Request, res: Response) {
    const payload = createCommoditySchema.parse(req.body);
    const result = await commoditiesService.create(payload);
    res.status(201).json(result);
  },

  async update(req: Request, res: Response) {
    const { id } = commodityIdParamSchema.parse(req.params);
    const payload = updateCommoditySchema.parse(req.body);
    const result = await commoditiesService.update(id, payload);
    res.json(result);
  },
};
