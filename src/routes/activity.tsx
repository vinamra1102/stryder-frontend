import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, X, List, CalendarDays } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { BottomNav } from "@/components/BottomNav";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { activityEntries, goalMetDates, entryToDate } from "@/lib/mock-data";

export const Route = createFileRoute("/activity")({
  component: ActivityPage,
});

type ViewMode = "list" | "calendar";

function ActivityPage() {
  const [view, setView] = useState<ViewMode>("list");
  const [isLoading] = useState(false); // flip to true once backend is wired
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const selectedEntry =
    selectedDate &&
    activityEntries.find((e) => {
      if (e.day === "Today") return false;
      return entryToDate(e.date).toDateString() === selectedDate.toDateString();
    });

  return (
    <MobileFrame>
      <div className="flex-1 overflow-y-auto px-6 pt-10 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Activity</h1>
            <p className="text-sm text-muted-foreground mt-1">Recent step history</p>
          </div>

          <div className="flex bg-accent/60 rounded-full p-1 gap-1">
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-full transition-all ${view === "list" ? "bg-card shadow-card text-primary" : "text-muted-foreground"}`}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`p-2 rounded-full transition-all ${view === "calendar" ? "bg-card shadow-card text-primary" : "text-muted-foreground"}`}
            >
              <CalendarDays size={16} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <ActivitySkeleton />
        ) : view === "list" ? (
          <ListView />
        ) : (
          <CalendarView
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
            selectedEntry={selectedEntry}
          />
        )}
      </div>
      <BottomNav />
    </MobileFrame>
  );
}

function ListView() {
  if (activityEntries.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="mt-6 bg-card rounded-3xl shadow-card overflow-hidden">
      {activityEntries.map((e, i) => (
        <div
          key={e.date}
          className={`flex items-center gap-4 px-5 py-4 ${
            i !== activityEntries.length - 1 ? "border-b border-border/50" : ""
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
  );
}

function CalendarView({
  selectedDate,
  onSelect,
  selectedEntry,
}: {
  selectedDate: Date | undefined;
  onSelect: (d: Date | undefined) => void;
  selectedEntry: (typeof activityEntries)[number] | undefined | false;
}) {
  return (
    <div className="mt-6 space-y-4">
      <div className="bg-card rounded-3xl p-4 shadow-card flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelect}
          defaultMonth={new Date(2025, 4, 1)}
          modifiers={{ goalMet: goalMetDates }}
          modifiersClassNames={{
            goalMet: "!bg-primary !text-primary-foreground rounded-full font-semibold",
          }}
        />
      </div>

      <div className="flex items-center gap-4 px-1">
        <LegendDot className="bg-gradient-primary" label="Goal met" />
        <LegendDot className="bg-accent border border-border" label="Not reached" />
      </div>

      {selectedEntry ? (
        <div className="bg-card rounded-2xl p-5 shadow-card flex items-center gap-4 animate-fade-up">
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
              selectedEntry.done ? "bg-gradient-primary text-primary-foreground" : "bg-accent text-muted-foreground"
            }`}
          >
            {selectedEntry.done ? <Check size={18} /> : <X size={18} />}
          </div>
          <div>
            <p className="text-sm font-semibold">
              {selectedEntry.day} · {selectedEntry.date}
            </p>
            <p className="text-2xl font-bold mt-0.5">{selectedEntry.steps.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">steps</p>
          </div>
        </div>
      ) : selectedDate ? (
        <div className="bg-card rounded-2xl p-5 shadow-card text-center">
          <p className="text-sm text-muted-foreground">No data for this day.</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl p-5 shadow-card text-center">
          <p className="text-sm text-muted-foreground">Tap a day to see its details.</p>
        </div>
      )}
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-3 h-3 rounded-full ${className}`} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-16 flex flex-col items-center text-center gap-3">
      <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
        <CalendarDays size={28} className="text-muted-foreground" />
      </div>
      <p className="text-base font-semibold text-foreground">No activity yet</p>
      <p className="text-sm text-muted-foreground">
        Start logging your steps and your history will appear here.
      </p>
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="mt-6 bg-card rounded-3xl shadow-card overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`flex items-center gap-4 px-5 py-4 ${i < 4 ? "border-b border-border/50" : ""}`}
        >
          <div className="w-12 space-y-1">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-10" />
          </div>
          <div className="flex-1 space-y-1">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="w-9 h-9 rounded-full" />
        </div>
      ))}
    </div>
  );
}
