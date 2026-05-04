import { createFileRoute } from "@tanstack/react-router";
import { MobileFrame } from "@/components/MobileFrame";
import { BottomNav } from "@/components/BottomNav";
import { Check, X } from "lucide-react";

export const Route = createFileRoute("/activity")({
  component: ActivityPage,
});

const entries = [
  { day: "Today", date: "May 4", steps: 7842, done: false },
  { day: "Sun", date: "May 3", steps: 10500, done: true },
  { day: "Sat", date: "May 2", steps: 9200, done: true },
  { day: "Fri", date: "May 1", steps: 7800, done: false },
  { day: "Thu", date: "Apr 30", steps: 5100, done: false },
  { day: "Wed", date: "Apr 29", steps: 11200, done: true },
  { day: "Tue", date: "Apr 28", steps: 6800, done: false },
  { day: "Mon", date: "Apr 27", steps: 4200, done: false },
];

function ActivityPage() {
  return (
    <MobileFrame>
      <div className="flex-1 overflow-y-auto px-6 pt-10 pb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Activity</h1>
        <p className="text-sm text-muted-foreground mt-1">Recent step history</p>

        <div className="mt-6 bg-card rounded-3xl shadow-card overflow-hidden">
          {entries.map((e, i) => (
            <div
              key={e.date}
              className={`flex items-center gap-4 px-5 py-4 ${
                i !== entries.length - 1 ? "border-b border-border/50" : ""
              }`}
            >
              <div className="w-12 text-center">
                <p className="text-xs text-muted-foreground">{e.day}</p>
                <p className="text-xs font-medium mt-0.5">{e.date}</p>
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold">{e.steps.toLocaleString()}</p>
                <p className="text-[11px] text-muted-foreground">steps</p>
              </div>
              <span
                className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  e.done ? "bg-gradient-primary text-primary-foreground" : "bg-accent text-muted-foreground"
                }`}
              >
                {e.done ? <Check size={16} /> : <X size={16} />}
              </span>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </MobileFrame>
  );
}