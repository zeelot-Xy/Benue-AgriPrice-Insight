import {
  adminTasks,
  alerts,
  dashboardSummary,
  forecastSeries,
  marketCards,
  marketComparison,
  phase9Notes,
  quickActions,
  seasonalityInsights,
  weeklyPriceSeries,
} from "../data/mock-data";

function delay<T>(value: T) {
  return new Promise<T>((resolve) => {
    window.setTimeout(() => resolve(value), 120);
  });
}

export async function getDashboardData() {
  return delay({
    summary: dashboardSummary,
    weeklyPriceSeries,
    marketComparison,
    alerts,
    quickActions,
    phase9Notes,
  });
}

export async function getMarketData() {
  return delay({
    marketCards,
    comparison: marketComparison,
    seasonalityInsights,
  });
}

export async function getAnalyticsData() {
  return delay({
    alerts,
    seasonalityInsights,
    marketComparison,
    weeklyPriceSeries,
  });
}

export async function getForecastData() {
  return delay({
    forecastSeries,
    summary: dashboardSummary,
    alerts,
  });
}

export async function getAdminData() {
  return delay({
    adminTasks,
    quickActions,
    summary: dashboardSummary,
  });
}
