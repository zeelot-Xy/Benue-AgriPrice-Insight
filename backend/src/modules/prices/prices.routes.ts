import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import { requireAdmin, requireAuth } from "../../middlewares/require-auth.js";
import { pricesController } from "./prices.controller.js";

export const priceRouter = Router();

priceRouter.get("/", asyncHandler(pricesController.list));
priceRouter.get("/:id", asyncHandler(pricesController.getById));
priceRouter.post(
  "/",
  requireAuth,
  requireAdmin,
  asyncHandler(pricesController.create),
);
priceRouter.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  asyncHandler(pricesController.update),
);
priceRouter.post(
  "/import",
  requireAuth,
  requireAdmin,
  asyncHandler(pricesController.import),
);
