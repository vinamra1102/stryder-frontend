import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileFrame } from "@/components/MobileFrame";
import { ChevronLeft, ChevronRight, Bell, Target, Link2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [reminders, setReminders] = useState(true);
  const [goal, setGoal] = useState<number>(() => {
    if (typeof window === "undefined") return 10000;
    const stored = localStorage.getItem("strydr_goal");
    return stored ? parseInt(stored, 10) : 10000;
  });
  const goals = [5000, 8000, 10000, 12000];

  function handleGoalChange(g: number) {
    setGoal(g);
    if (typeof window !== "undefined") {
      localStorage.setItem("strydr_goal", String(g));
    }
  }

  return (
    <MobileFrame>
      <div className="flex-1 overflow-y-auto px-6 pt-10 pb-8">
        <Link to="/profile" className="w-10 h-10 rounded-full bg-card shadow-card flex items-center justify-center">
          <ChevronLeft size={18} />
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight mt-6">Settings</h1>

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
            {goals.map((g) => (
              <button
                key={g}
                onClick={() => handleGoalChange(g)}
                className={`py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  goal === g ? "bg-gradient-primary text-primary-foreground" : "bg-accent text-foreground"
                }`}
              >
                {g / 1000}k
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 bg-card rounded-3xl shadow-card overflow-hidden">
          <Row icon={Bell} label="Reminders" right={
            <button
              onClick={() => setReminders(!reminders)}
              className={`w-12 h-7 rounded-full p-1 transition-colors ${reminders ? "bg-gradient-primary" : "bg-accent"}`}
            >
              <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${reminders ? "translate-x-5" : ""}`} />
            </button>
          } />
          <div className="border-t border-border/50" />
          <Row icon={Link2} label="Connect Google Fit" right={<ChevronRight size={18} className="text-muted-foreground" />} />
        </div>
      </div>
    </MobileFrame>
  );
}

function Row({ icon: Icon, label, right }: { icon: React.ComponentType<{ size?: number }>; label: string; right: React.ReactNode }) {
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