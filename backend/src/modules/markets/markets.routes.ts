import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import { requireAdmin, requireAuth } from "../../middlewares/require-auth.js";
import { marketsController } from "./markets.controller.js";

export const marketRouter = Router();

marketRouter.get("/", asyncHandler(marketsController.list));
marketRouter.get("/:id", asyncHandler(marketsController.getById));
marketRouter.post(
  "/",
  requireAuth,
  requireAdmin,
  asyncHandler(marketsController.create),
);
marketRouter.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  asyncHandler(marketsController.update),
);
