import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, RefreshCw, Target, Flame } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { BottomNav } from "@/components/BottomNav";
import { ProgressRing } from "@/components/ProgressRing";
import { Skeleton } from "@/components/ui/skeleton";
import { useSummary, useMe, useUserSettings } from "@/lib/queries";
import { ErrorState } from "@/components/ErrorState";

export const Route = createFileRoute("/home")({
  component: HomePage,
});

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const actions = [
  { label: "Add Steps", icon: Plus, to: "/sync" as const },
  { label: "Sync Data", icon: RefreshCw, to: "/sync" as const },
  { label: "Set Goal", icon: Target, to: "/settings" as const },
];

function HomePage() {
  const { data: summary, isLoading: summaryLoading, error: summaryError, refetch } = useSummary();
  const { data: user, isLoading: userLoading } = useMe();
  const { data: settings, isLoading: settingsLoading } = useUserSettings();

  const isLoading = summaryLoading || userLoading || settingsLoading;

  const steps = summary?.today ?? 0;
  const goal = settings?.goal ?? parseInt(localStorage.getItem("strydr_goal") ?? "10000", 10);
  const remaining = Math.max(0, goal - steps);
  const pct = Math.min(1, steps / goal);

  const avatarInitial = user?.name ? user.name.charAt(0).toUpperCase() : "?";
  const displayName = user?.name?.split(" ")[0] ?? "there";

  return (
    <MobileFrame>
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="px-6 pt-10 pb-6">
          <div className="flex items-center justify-between animate-fade-up">
            <div>
              <p className="text-sm text-muted-foreground">{getGreeting()}</p>
              {userLoading ? (
                <Skeleton className="h-6 w-32 mt-1" />
              ) : (
                <h1 className="text-xl font-semibold text-foreground mt-0.5">
                  Hi, {displayName} 👋
                </h1>
              )}
            </div>
            <Link
              to="/profile"
              className="w-11 h-11 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold shadow-soft overflow-hidden"
            >
              {user?.picture ? (
                <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                avatarInitial
              )}
            </Link>
          </div>

          {isLoading ? (
            <HomeSkeleton />
          ) : summaryError ? (
            <ErrorState onRetry={() => refetch()} />
          ) : (
            <>
              <div className="mt-7 bg-card rounded-[28px] p-7 shadow-card animate-fade-up">
                <div className="flex flex-col items-center">
                  <ProgressRing value={pct} size={220} stroke={16}>
                    <div className="text-center">
                      <p className="text-[42px] leading-none font-bold tracking-tight text-foreground">
                        {steps.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">
                        steps today
                      </p>
                    </div>
                  </ProgressRing>
                  <p className="mt-5 text-sm text-muted-foreground">
                    Steps remaining:{" "}
                    <span className="text-foreground font-medium">{remaining.toLocaleString()}</span>
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {actions.map(({ label, icon: Icon, to }) => (
                  <Link
                    key={label}
                    to={to}
                    className="bg-card rounded-2xl py-4 px-2 flex flex-col items-center gap-2 shadow-card active:scale-95 transition-transform"
                  >
                    <span className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary">
                      <Icon size={18} />
                    </span>
                    <span className="text-xs font-medium text-foreground">{label}</span>
                  </Link>
                ))}
              </div>

              <div className="mt-5 bg-gradient-primary rounded-2xl p-5 text-primary-foreground flex items-center gap-3 shadow-soft">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Flame size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    You're {Math.round(pct * 100)}% toward your goal today
                  </p>
                  <p className="text-xs text-primary-foreground/80 mt-0.5">
                    {summary?.streak
                      ? `🔥 ${summary.streak}-day streak — keep it going!`
                      : "Every step counts."}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <BottomNav />
    </MobileFrame>
  );
}

function HomeSkeleton() {
  return (
    <>
      <div className="mt-7 bg-card rounded-[28px] p-7 shadow-card">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="w-[220px] h-[220px] rounded-full" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-card rounded-2xl py-4 px-2 flex flex-col items-center gap-2 shadow-card">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <Skeleton className="h-3 w-14" />
          </div>
        ))}
      </div>
      <div className="mt-5 bg-card rounded-2xl p-5 shadow-card flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-36" />
        </div>
      </div>
    </>
  );
}
