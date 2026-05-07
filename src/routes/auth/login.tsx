import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { MobileFrame } from "@/components/MobileFrame";
import { auth } from "@/lib/auth";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
});

const BACKEND_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";

function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated()) {
      navigate({ to: "/home" });
    }
  }, [navigate]);

  return (
    <MobileFrame>
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">
        <div className="text-center animate-fade-up">
          <div className="w-20 h-20 rounded-[28px] bg-gradient-primary mx-auto flex items-center justify-center shadow-glow mb-6">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-10 h-10 text-primary-foreground"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome to Stryder</h1>
          <p className="mt-3 text-[15px] text-muted-foreground leading-relaxed">
            Sign in to track your steps, build streaks, and hit your daily goals.
          </p>
        </div>

        <div className="w-full space-y-3 animate-fade-up">
          <a
            href={`${BACKEND_URL}/auth/login`}
            className="flex items-center justify-center gap-3 w-full py-4 rounded-full bg-white border border-border shadow-card text-foreground font-semibold text-sm active:scale-[0.98] transition-transform"
          >
            <GoogleIcon />
            Continue with Google
          </a>
        </div>

        <p className="text-xs text-muted-foreground text-center px-4 animate-fade-up">
          By continuing, you agree to sync your fitness data via Google Fit.
        </p>
      </div>
    </MobileFrame>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
