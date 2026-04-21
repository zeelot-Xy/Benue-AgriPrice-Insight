import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import { requireAdmin, requireAuth } from "../../middlewares/require-auth.js";
import { submissionsController } from "./submissions.controller.js";

export const submissionsRouter = Router();

submissionsRouter.post(
  "/public-upload",
  asyncHandler(submissionsController.submitPublicUpload),
);
submissionsRouter.get(
  "/pending",
  requireAuth,
  requireAdmin,
  asyncHandler(submissionsController.listPending),
);
submissionsRouter.post(
  "/:id/approve",
  requireAuth,
  requireAdmin,
  asyncHandler(submissionsController.approve),
);
submissionsRouter.post(
  "/:id/reject",
  requireAuth,
  requireAdmin,
  asyncHandler(submissionsController.reject),
);
