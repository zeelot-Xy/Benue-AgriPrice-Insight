import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  approveSubmissionBatch,
  authenticate,
  getAdminData,
  getAnalyticsData,
  getCurrentUser,
  getDashboardData,
  getForecastData,
  getPendingSubmissionBatches,
  getUploadPageData,
  importPricesCsv,
  getMarketData,
  rejectSubmissionBatch,
  submitPublicPriceUpload,
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

export function useUploadPageData() {
  return useQuery({
    queryKey: ["upload-page-data"],
    queryFn: getUploadPageData,
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

export function useImportPrices() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: importPricesCsv,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-data"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-data"] }),
        queryClient.invalidateQueries({ queryKey: ["market-data"] }),
        queryClient.invalidateQueries({ queryKey: ["analytics-data"] }),
        queryClient.invalidateQueries({ queryKey: ["forecast-data"] }),
      ]);
    },
  });
}

export function usePublicPriceUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitPublicPriceUpload,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pending-submissions"] });
    },
  });
}

export function usePendingSubmissionBatches() {
  return useQuery({
    queryKey: ["pending-submissions"],
    queryFn: () => getPendingSubmissionBatches(10),
    enabled: Boolean(getStoredToken()),
    retry: false,
  });
}

export function useApproveSubmissionBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveSubmissionBatch,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["pending-submissions"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-data"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-data"] }),
        queryClient.invalidateQueries({ queryKey: ["market-data"] }),
        queryClient.invalidateQueries({ queryKey: ["analytics-data"] }),
        queryClient.invalidateQueries({ queryKey: ["forecast-data"] }),
      ]);
    },
  });
}

export function useRejectSubmissionBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reviewNote }: { id: number; reviewNote?: string }) =>
      rejectSubmissionBatch(id, reviewNote),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pending-submissions"] });
    },
  });
}
