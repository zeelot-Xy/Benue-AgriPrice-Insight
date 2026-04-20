import { useQuery } from "@tanstack/react-query";

import {
  getAdminData,
  getAnalyticsData,
  getDashboardData,
  getForecastData,
  getMarketData,
} from "../services/mock-api";

export function useDashboardData() {
  return useQuery({
    queryKey: ["dashboard-data"],
    queryFn: getDashboardData,
  });
}

export function useMarketData() {
  return useQuery({
    queryKey: ["market-data"],
    queryFn: getMarketData,
  });
}

export function useAnalyticsData() {
  return useQuery({
    queryKey: ["analytics-data"],
    queryFn: getAnalyticsData,
  });
}

export function useForecastData() {
  return useQuery({
    queryKey: ["forecast-data"],
    queryFn: getForecastData,
  });
}

export function useAdminData() {
  return useQuery({
    queryKey: ["admin-data"],
    queryFn: getAdminData,
  });
}
