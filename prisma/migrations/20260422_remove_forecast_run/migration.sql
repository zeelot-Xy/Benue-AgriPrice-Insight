-- Remove the deprecated forecasting table and keep the database aligned
-- with the simplified monitoring-and-analysis architecture.
DROP TABLE IF EXISTS "ForecastRun";
