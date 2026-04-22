import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import { analyticsController } from "./analytics.controller.js";

export const analyticsRouter = Router();

analyticsRouter.get("/trends", asyncHandler(analyticsController.trends));
analyticsRouter.get("/alerts", asyncHandler(analyticsController.alerts));
analyticsRouter.get("/comparisons", asyncHandler(analyticsController.comparisons));
analyticsRouter.get("/seasonality", asyncHandler(analyticsController.seasonality));
analyticsRouter.get("/state-average", asyncHandler(analyticsController.stateAverage));
