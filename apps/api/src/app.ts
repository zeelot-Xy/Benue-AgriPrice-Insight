import cors from "cors";
import express from "express";
import helmet from "helmet";

import { errorHandler, notFoundHandler } from "./middlewares/error-handler.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { commodityRouter } from "./modules/commodities/commodities.routes.js";
import { marketRouter } from "./modules/markets/markets.routes.js";
import { priceRouter } from "./modules/prices/prices.routes.js";
import { reportRouter } from "./modules/reports/reports.routes.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
    }),
  );
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => {
    res.json({
      service: "bapi-api",
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  });

  app.get("/api", (_req, res) => {
    res.json({
      name: "BAPI Backend API",
      phase: 6,
      message: "Auth, reference data, price management, and report endpoints are available.",
    });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/markets", marketRouter);
  app.use("/api/commodities", commodityRouter);
  app.use("/api/prices", priceRouter);
  app.use("/api/reports", reportRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
