import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileFrame } from "@/components/MobileFrame";
import { BottomNav } from "@/components/BottomNav";
import { Settings, Flame, Calendar, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <MobileFrame>
      <div className="flex-1 overflow-y-auto px-6 pt-10 pb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
          <Link to="/settings" className="w-10 h-10 rounded-full bg-card shadow-card flex items-center justify-center">
            <Settings size={18} />
          </Link>
        </div>

        <div className="mt-6 bg-card rounded-3xl p-6 shadow-card flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-semibold shadow-soft">
            A
          </div>
          <h2 className="mt-4 text-lg font-semibold">Amelia Chen</h2>
          <p className="text-sm text-muted-foreground">Goal: 10,000 steps / day</p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3">
          <ProfileStat icon={TrendingUp} label="Total steps" value="284,920" />
          <ProfileStat icon={Flame} label="Current streak" value="12 days" />
          <ProfileStat icon={Calendar} label="Active days" value="48 / 60" />
        </div>
      </div>
      <BottomNav />
    </MobileFrame>
  );
}

function ProfileStat({ icon: Icon, label, value }: { icon: React.ComponentType<{ size?: number }>; label: string; value: string }) {
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