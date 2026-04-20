import cors from "cors";
import express from "express";
import helmet from "helmet";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
    }),
  );
  app.use(express.json());

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
      phase: 4,
      message: "Backend bootstrap is ready for later feature implementation.",
    });
  });

  return app;
}
