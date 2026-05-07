// ─── Shared ─────────────────────────────────────────────────────────────────

export interface DaySteps {
  date: string; // YYYY-MM-DD
  steps: number;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface UserMeResponse {
  success: true;
  sub: string;
  email: string;
  name: string;
  picture: string;
}

export interface AuthStatusResponse {
  success: true;
  authenticated: boolean;
}

export interface AuthRefreshResponse {
  success: true;
  token: string;
}

// ─── Fitness ─────────────────────────────────────────────────────────────────

export interface SummaryResponse {
  success: true;
  today: number;    // today's step count
  week: number;     // this week's total
  streak: number;   // current streak in days
  best_day: number; // best single-day step count
}

export interface StepsTodayResponse {
  success: true;
  steps: number;
  date: string; // YYYY-MM-DD
}

export interface StepsWeekResponse {
  success: true;
  days: DaySteps[];
  total: number;
}

export interface StepsMonthlyResponse {
  success: true;
  days: DaySteps[];
  total: number;
  year: number;
  month: number;
}

export interface StepsHistoryResponse {
  success: true;
  history: DaySteps[];
}

// ─── User settings ───────────────────────────────────────────────────────────

export interface UserSettingsResponse {
  success: true;
  goal: number;
  units: string;
  theme: string;
  notifications: boolean;
}

export type UpdateSettingsPayload = Partial<
  Pick<UserSettingsResponse, "goal" | "units" | "theme" | "notifications">
>;
