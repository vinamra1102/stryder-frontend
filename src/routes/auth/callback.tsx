import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { api } from "@/lib/api";
import { MobileFrame } from "@/components/MobileFrame";

const searchSchema = z.object({
  token: z.string().optional(),
  error: z.string().optional(),
});

export const Route = createFileRoute("/auth/callback")({
  validateSearch: searchSchema,
  component: CallbackPage,
});

async function syncOnboardingGoal() {
  const stored = localStorage.getItem("strydr_goal");
  if (!stored) return;
  try {
    await api.put("/user/settings", { goal: parseInt(stored, 10) });
    // Goal is now owned by the backend — localStorage copy is no longer needed.
    localStorage.removeItem("strydr_goal");
  } catch {
    // Non-fatal: the backend will use its own default. User can adjust in Settings.
  }
}

function CallbackPage() {
  const navigate = useNavigate();
  const { token, error } = Route.useSearch();

  useEffect(() => {
    if (error || !token) {
      navigate({ to: "/auth/login" });
      return;
    }

    auth.setToken(token);

    // Push the goal the user picked during onboarding to the backend, then navigate.
    syncOnboardingGoal().finally(() => {
      navigate({ to: "/home" });
    });
  }, [token, error, navigate]);

  return (
    <MobileFrame>
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground">Signing you in…</p>
      </div>
    </MobileFrame>
  );
}
