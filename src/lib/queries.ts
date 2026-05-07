import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "./api";
import { auth } from "./auth";
import type {
  SummaryResponse,
  StepsWeekResponse,
  StepsMonthlyResponse,
  StepsHistoryResponse,
  UserMeResponse,
  UserSettingsResponse,
  AuthRefreshResponse,
  UpdateSettingsPayload,
} from "./types";

// ─── Fitness ─────────────────────────────────────────────────────────────────

export function useSummary() {
  return useQuery({
    queryKey: ["fitness", "summary"],
    queryFn: () => api.get<SummaryResponse>("/fitness/summary"),
    staleTime: 30_000,
  });
}

export function useStepsWeek() {
  return useQuery({
    queryKey: ["fitness", "steps", "week"],
    queryFn: () => api.get<StepsWeekResponse>("/fitness/steps/week"),
    staleTime: 30_000,
  });
}

export function useStepsMonthly(year: number, month: number) {
  return useQuery({
    queryKey: ["fitness", "steps", "monthly", year, month],
    queryFn: () =>
      api.get<StepsMonthlyResponse>(`/fitness/steps/monthly?year=${year}&month=${month}`),
    staleTime: 60_000,
  });
}

export function useStepsHistory(params?: {
  from_date?: string;
  to_date?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["fitness", "steps", "history", params],
    queryFn: () => {
      const qs = new URLSearchParams();
      if (params?.from_date) qs.set("from_date", params.from_date);
      if (params?.to_date) qs.set("to_date", params.to_date);
      if (params?.limit) qs.set("limit", String(params.limit));
      const q = qs.toString();
      return api.get<StepsHistoryResponse>(`/fitness/steps/history${q ? `?${q}` : ""}`);
    },
    staleTime: 30_000,
  });
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export function useMe() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => api.get<UserMeResponse>("/auth/me"),
    staleTime: 300_000,
  });
}

export function useRefreshToken() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post<AuthRefreshResponse>("/auth/refresh"),
    onSuccess: (data) => {
      auth.setToken(data.token);
      // Re-fetch all fitness data after token refresh
      qc.invalidateQueries({ queryKey: ["fitness"] });
      toast.success("Synced successfully");
    },
    onError: () => {
      toast.error("Sync failed. Please try again.");
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: () => api.post("/auth/logout"),
    onSettled: () => {
      auth.clearToken();
      window.location.href = "/auth/login";
    },
  });
}

// ─── User settings ───────────────────────────────────────────────────────────

export function useUserSettings() {
  return useQuery({
    queryKey: ["user", "settings"],
    queryFn: () => api.get<UserSettingsResponse>("/user/settings"),
    staleTime: 60_000,
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateSettingsPayload) =>
      api.put<UserSettingsResponse>("/user/settings", payload),
    onSuccess: (data) => {
      qc.setQueryData(["user", "settings"], data);
      // Keep localStorage in sync so the home page reads the right goal before next fetch
      if (data.goal) {
        localStorage.setItem("strydr_goal", String(data.goal));
      }
      toast.success("Settings saved");
    },
    onError: () => {
      toast.error("Failed to save settings. Please try again.");
    },
  });
}
