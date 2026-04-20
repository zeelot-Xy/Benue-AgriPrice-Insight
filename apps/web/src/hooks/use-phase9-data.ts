import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  authenticate,
  getAdminData,
  getAnalyticsData,
  getCurrentUser,
  getDashboardData,
  getForecastData,
  getMarketData,
} from "../services/bapi-api";
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from "../lib/auth-storage";

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

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    enabled: Boolean(getStoredToken()),
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authenticate,
    onSuccess: (result) => {
      setStoredToken(result.token);
      void queryClient.invalidateQueries({ queryKey: ["current-user"] });
      void queryClient.invalidateQueries();
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return () => {
    clearStoredToken();
    void queryClient.invalidateQueries();
  };
}
