import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import { reportsController } from "./reports.controller.js";

export const reportRouter = Router();

reportRouter.get("/overview", asyncHandler(reportsController.overview));
reportRouter.get("/latest-prices", asyncHandler(reportsController.latestPrices));
