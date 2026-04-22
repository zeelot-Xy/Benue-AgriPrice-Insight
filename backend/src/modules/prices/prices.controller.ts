import type { Request, Response } from "express";

import {
  createPriceSchema,
  importPricesSchema,
  listPricesQuerySchema,
  priceIdParamSchema,
  updatePriceSchema,
} from "./prices.schemas.js";
import { pricesService } from "./prices.service.js";

export const pricesController = {
  async list(req: Request, res: Response) {
    const query = listPricesQuerySchema.parse(req.query);
    const result = await pricesService.list(query);
    res.json(result);
  },

  async getById(req: Request, res: Response) {
    const { id } = priceIdParamSchema.parse(req.params);
    const result = await pricesService.getById(id);
    res.json(result);
  },

  async create(req: Request, res: Response) {
    const payload = createPriceSchema.parse(req.body);
    const result = await pricesService.create(payload, req.auth!.userId);
    res.status(201).json(result);
  },

  async update(req: Request, res: Response) {
    const { id } = priceIdParamSchema.parse(req.params);
    const payload = updatePriceSchema.parse(req.body);
    const result = await pricesService.update(id, payload, req.auth!.userId);
    res.json(result);
  },

  async import(req: Request, res: Response) {
    const payload = importPricesSchema.parse(req.body);
    const result = await pricesService.importFromCsv(payload, req.auth!.userId);
    res.status(201).json(result);
  },
};
