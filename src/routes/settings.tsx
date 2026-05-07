import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Bell, Target, Link2, LogOut } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserSettings, useUpdateSettings, useLogout } from "@/lib/queries";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

const GOALS = [5000, 8000, 10000, 12000];

function SettingsPage() {
  const { data: settings, isLoading } = useUserSettings();
  const updateSettings = useUpdateSettings();
  const logout = useLogout();

  const [goal, setGoal] = useState<number>(10000);
  const [reminders, setReminders] = useState<boolean>(true);

  // Sync local state once settings load from the API.
  useEffect(() => {
    if (settings) {
      setGoal(settings.goal);
      setReminders(settings.notifications);
    }
  }, [settings]);

  function handleGoalChange(g: number) {
    setGoal(g);
    updateSettings.mutate({ goal: g });
  }

  function handleRemindersToggle() {
    const next = !reminders;
    setReminders(next);
    updateSettings.mutate({ notifications: next });
  }

  return (
    <MobileFrame>
      <div className="flex-1 overflow-y-auto px-6 pt-10 pb-8">
        <Link to="/profile" className="w-10 h-10 rounded-full bg-card shadow-card flex items-center justify-center">
          <ChevronLeft size={18} />
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight mt-6">Settings</h1>

        {isLoading ? (
          <SettingsSkeleton />
        ) : (
          <>
            {/* Goal */}
            <div className="mt-6 bg-card rounded-3xl p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent text-primary flex items-center justify-center">
                  <Target size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Daily step goal</p>
                  <p className="text-xs text-muted-foreground">Currently {goal.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {GOALS.map((g) => (
                  <button
                    key={g}
                    onClick={() => handleGoalChange(g)}
                    disabled={updateSettings.isPending}
                    className={`py-2.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-60 ${
                      goal === g ? "bg-gradient-primary text-primary-foreground" : "bg-accent text-foreground"
                    }`}
                  >
                    {g / 1000}k
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="mt-4 bg-card rounded-3xl shadow-card overflow-hidden">
              <Row
                icon={Bell}
                label="Reminders"
                right={
                  <button
                    onClick={handleRemindersToggle}
                    disabled={updateSettings.isPending}
                    className={`w-12 h-7 rounded-full p-1 transition-colors disabled:opacity-60 ${reminders ? "bg-gradient-primary" : "bg-accent"}`}
                  >
                    <span
                      className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${reminders ? "translate-x-5" : ""}`}
                    />
                  </button>
                }
              />
              <div className="border-t border-border/50" />
              <Row
                icon={Link2}
                label="Connect Google Fit"
                right={<ChevronRight size={18} className="text-muted-foreground" />}
              />
            </div>

            {/* Sign out */}
            <div className="mt-4 bg-card rounded-3xl shadow-card overflow-hidden">
              <button
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
                className="flex items-center gap-3 px-5 py-4 w-full text-left disabled:opacity-60"
              >
                <div className="w-10 h-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
                  <LogOut size={18} />
                </div>
                <p className="flex-1 text-sm font-medium text-destructive">
                  {logout.isPending ? "Signing out…" : "Sign out"}
                </p>
              </button>
            </div>
          </>
        )}
      </div>
    </MobileFrame>
  );
}

function Row({
  icon: Icon,
  label,
  right,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  right: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <div className="w-10 h-10 rounded-xl bg-accent text-primary flex items-center justify-center">
        <Icon size={18} />
      </div>
      <p className="flex-1 text-sm font-medium">{label}</p>
      {right}
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <>
      <div className="mt-6 bg-card rounded-3xl p-5 shadow-card space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="mt-4 bg-card rounded-3xl shadow-card overflow-hidden">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className={`flex items-center gap-3 px-5 py-4 ${i === 0 ? "border-b border-border/50" : ""}`}>
            <Skeleton className="w-10 h-10 rounded-xl" />
            <Skeleton className="h-4 flex-1 max-w-[140px]" />
            <Skeleton className="h-7 w-12 rounded-full" />
          </div>
        ))}
      </div>
    </>
  );
}
