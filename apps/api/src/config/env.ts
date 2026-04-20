const required = ["JWT_SECRET"] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 8000),
  JWT_SECRET: process.env.JWT_SECRET!,
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD ?? "BapiAdmin123!",
  ML_SERVICE_BASE_URL: process.env.ML_SERVICE_BASE_URL ?? "http://localhost:8001",
  ML_FORECAST_TIMEOUT_MS: Number(process.env.ML_FORECAST_TIMEOUT_MS ?? 8000),
};
