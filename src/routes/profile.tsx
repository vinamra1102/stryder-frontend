import { createFileRoute, Link } from "@tanstack/react-router";
import { Settings, Flame, Calendar, TrendingUp } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { BottomNav } from "@/components/BottomNav";
import { Skeleton } from "@/components/ui/skeleton";
import { useMe, useSummary, useUserSettings } from "@/lib/queries";
import { ErrorState } from "@/components/ErrorState";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { data: user, isLoading: userLoading, error: userError, refetch } = useMe();
  const { data: summary, isLoading: summaryLoading } = useSummary();
  const { data: settings, isLoading: settingsLoading } = useUserSettings();

  const isLoading = userLoading || summaryLoading || settingsLoading;

  const avatarInitial = user?.name ? user.name.charAt(0).toUpperCase() : "?";
  const goal = settings?.goal ?? 10000;

  return (
    <MobileFrame>
      <div className="flex-1 overflow-y-auto px-6 pt-10 pb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
          <Link
            to="/settings"
            className="w-10 h-10 rounded-full bg-card shadow-card flex items-center justify-center"
          >
            <Settings size={18} />
          </Link>
        </div>

        {isLoading ? (
          <ProfileSkeleton />
        ) : userError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : (
          <>
            <div className="mt-6 bg-card rounded-3xl p-6 shadow-card flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-semibold shadow-soft overflow-hidden">
                {user?.picture ? (
                  <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  avatarInitial
                )}
              </div>
              <h2 className="mt-4 text-lg font-semibold">{user?.name ?? "—"}</h2>
              <p className="text-sm text-muted-foreground">
                Goal: {goal.toLocaleString()} steps / day
              </p>
              {user?.email && (
                <p className="text-xs text-muted-foreground/70 mt-0.5">{user.email}</p>
              )}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <ProfileStat
                icon={TrendingUp}
                label="Today"
                value={`${(summary?.today ?? 0).toLocaleString()} steps`}
              />
              <ProfileStat
                icon={Flame}
                label="Current streak"
                value={`${summary?.streak ?? 0} ${summary?.streak === 1 ? "day" : "days"}`}
              />
              <ProfileStat
                icon={Calendar}
                label="This week"
                value={`${(summary?.week ?? 0).toLocaleString()} steps`}
              />
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </MobileFrame>
  );
}

function ProfileStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center text-primary">
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-base font-semibold mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <>
      <div className="mt-6 bg-card rounded-3xl p-6 shadow-card flex flex-col items-center gap-3">
        <Skeleton className="w-20 h-20 rounded-full" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-44" />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-card rounded-2xl p-4 shadow-card flex items-center gap-4">
            <Skeleton className="w-11 h-11 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
