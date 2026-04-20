import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import { requireAdmin, requireAuth } from "../../middlewares/require-auth.js";
import { commoditiesController } from "./commodities.controller.js";

export const commodityRouter = Router();

commodityRouter.get("/", asyncHandler(commoditiesController.list));
commodityRouter.get("/:id", asyncHandler(commoditiesController.getById));
commodityRouter.post(
  "/",
  requireAuth,
  requireAdmin,
  asyncHandler(commoditiesController.create),
);
commodityRouter.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  asyncHandler(commoditiesController.update),
);
