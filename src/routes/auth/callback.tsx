import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { MobileFrame } from "@/components/MobileFrame";

const searchSchema = z.object({
  token: z.string().optional(),
  error: z.string().optional(),
});

export const Route = createFileRoute("/auth/callback")({
  validateSearch: searchSchema,
  component: CallbackPage,
});

function CallbackPage() {
  const navigate = useNavigate();
  const { token, error } = Route.useSearch();

  useEffect(() => {
    if (error || !token) {
      navigate({ to: "/auth/login" });
      return;
    }
    auth.setToken(token);
    navigate({ to: "/home" });
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
