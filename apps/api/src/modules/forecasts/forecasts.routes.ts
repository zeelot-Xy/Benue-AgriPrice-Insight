import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import { forecastsController } from "./forecasts.controller.js";

export const forecastsRouter = Router();

forecastsRouter.get("/", asyncHandler(forecastsController.generate));
forecastsRouter.get("/history", asyncHandler(forecastsController.history));
