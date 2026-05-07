import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MobileFrame } from "@/components/MobileFrame";
import { BottomNav } from "@/components/BottomNav";
import { Skeleton } from "@/components/ui/skeleton";
import { ProgressRing } from "@/components/ProgressRing";
import { useSummary, useStepsWeek, useStepsMonthly, useUserSettings } from "@/lib/queries";
import type { DaySteps } from "@/lib/types";

export const Route = createFileRoute("/stats")({
  component: StatsPage,
});

const tabs = ["Daily", "Weekly", "Monthly"] as const;
type Tab = (typeof tabs)[number];

const now = new Date();
const YEAR = now.getFullYear();
const MONTH = now.getMonth() + 1;

// Build a full 7-slot array (Mon–Sun) from the API's sparse days array.
function toWeekPoints(days: DaySteps[]): number[] {
  const slots = Array<number>(7).fill(0);
  const today = new Date();
  days.forEach((d) => {
    const date = new Date(d.date + "T00:00:00");
    const daysAgo = Math.round((today.getTime() - date.getTime()) / 86_400_000);
    if (daysAgo >= 0 && daysAgo < 7) slots[6 - daysAgo] = d.steps;
  });
  return slots;
}

// Aggregate monthly daily data into 4–5 weekly buckets.
function toMonthlyPoints(days: DaySteps[]): { data: number[]; labels: string[] } {
  const weeks: number[] = [];
  const labels: string[] = [];
  days.forEach((d) => {
    const dayNum = new Date(d.date + "T00:00:00").getDate();
    const wk = Math.floor((dayNum - 1) / 7);
    weeks[wk] = (weeks[wk] ?? 0) + d.steps;
    labels[wk] = `Wk ${wk + 1}`;
  });
  return { data: weeks.filter(Boolean), labels: labels.filter(Boolean) };
}

function StatsPage() {
  const [tab, setTab] = useState<Tab>("Weekly");

  const { data: summary, isLoading: summaryLoading } = useSummary();
  const { data: weekData, isLoading: weekLoading } = useStepsWeek();
  const { data: monthData, isLoading: monthLoading } = useStepsMonthly(YEAR, MONTH);
  const { data: settings } = useUserSettings();

  const goal = settings?.goal ?? parseInt(localStorage.getItem("strydr_goal") ?? "10000", 10);

  const isLoading =
    tab === "Daily" ? summaryLoading :
    tab === "Weekly" ? weekLoading :
    monthLoading;

  return (
    <MobileFrame>
      <div className="flex-1 overflow-y-auto px-6 pt-10 pb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Statistics</h1>
        <p className="text-sm text-muted-foreground mt-1">Your activity at a glance</p>

        <div className="mt-6 bg-accent/60 rounded-full p-1 flex">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all ${
                tab === t ? "bg-card text-foreground shadow-card" : "text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {isLoading ? (
          <StatsSkeleton tab={tab} />
        ) : tab === "Daily" ? (
          <DailyView summary={summary} goal={goal} />
        ) : tab === "Weekly" ? (
          <ChartView
            periodLabel="This week"
            total={(weekData?.total ?? 0).toLocaleString()}
            change={summary ? `${Math.round(((summary.today / 7) / (summary.week / 7) - 1) * 100) > 0 ? "+" : ""}${Math.round(((summary.today / 7) / (summary.week / 7) - 1) * 100)}%` : "—"}
            data={toWeekPoints(weekData?.days ?? [])}
            labels={["M", "T", "W", "T", "F", "S", "S"]}
            summaryCards={[
              { label: "Avg steps/day", value: weekData ? Math.round(weekData.total / 7).toLocaleString() : "—" },
              { label: "Goal completion", value: weekData ? `${Math.round((weekData.days.filter(d => d.steps >= goal).length / 7) * 100)}%` : "—" },
              { label: "Best day", value: weekData ? Math.max(...(weekData.days.map(d => d.steps) || [0])).toLocaleString() : "—" },
              { label: "Active days", value: weekData ? `${weekData.days.filter(d => d.steps > 0).length} / 7` : "—" },
            ]}
          />
        ) : (
          (() => {
            const { data: pts, labels: wkLabels } = toMonthlyPoints(monthData?.days ?? []);
            return (
              <ChartView
                periodLabel="This month"
                total={(monthData?.total ?? 0).toLocaleString()}
                change="—"
                data={pts}
                labels={wkLabels}
                summaryCards={[
                  { label: "Avg steps/day", value: monthData ? Math.round(monthData.total / monthData.days.length).toLocaleString() : "—" },
                  { label: "Goal completion", value: monthData ? `${Math.round((monthData.days.filter(d => d.steps >= goal).length / monthData.days.length) * 100)}%` : "—" },
                  { label: "Best day", value: monthData ? Math.max(...monthData.days.map(d => d.steps)).toLocaleString() : "—" },
                  { label: "Active days", value: monthData ? `${monthData.days.filter(d => d.steps > 0).length} / ${monthData.days.length}` : "—" },
                ]}
              />
            );
          })()
        )}
      </div>
      <BottomNav />
    </MobileFrame>
  );
}

// ─── Daily view — ring + 4 cards ─────────────────────────────────────────────

function DailyView({
  summary,
  goal,
}: {
  summary: { today: number; week: number; streak: number; best_day: number } | undefined;
  goal: number;
}) {
  const steps = summary?.today ?? 0;
  const pct = Math.min(1, steps / goal);

  return (
    <>
      <div className="mt-6 bg-card rounded-3xl p-6 shadow-card flex flex-col items-center">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Today</p>
        <ProgressRing value={pct} size={160} stroke={13}>
          <div className="text-center">
            <p className="text-2xl font-bold">{steps.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">steps</p>
          </div>
        </ProgressRing>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <StatCard label="Goal completion" value={`${Math.round(pct * 100)}%`} />
        <StatCard label="Remaining" value={Math.max(0, goal - steps).toLocaleString()} />
        <StatCard label="Current streak" value={`${summary?.streak ?? 0} days`} />
        <StatCard label="Best day ever" value={(summary?.best_day ?? 0).toLocaleString()} />
      </div>
    </>
  );
}

// ─── Chart view — line chart + 4 cards ───────────────────────────────────────

function ChartView({
  periodLabel,
  total,
  change,
  data,
  labels,
  summaryCards,
}: {
  periodLabel: string;
  total: string;
  change: string;
  data: number[];
  labels: string[];
  summaryCards: { label: string; value: string }[];
}) {
  const w = 320, h = 160, pad = 16;
  const max = Math.max(...data, 1);
  const points = data.map((v, i) => {
    const x = pad + (i * (w - pad * 2)) / Math.max(data.length - 1, 1);
    const y = h - pad - (v / max) * (h - pad * 2);
    return [x, y] as const;
  });
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const area = `${path} L${points[points.length - 1][0]},${h - pad} L${points[0][0]},${h - pad} Z`;

  return (
    <>
      <div className="mt-6 bg-card rounded-3xl p-5 shadow-card">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{periodLabel}</p>
            <p className="text-2xl font-bold mt-1">
              {total} <span className="text-sm font-normal text-muted-foreground">steps</span>
            </p>
          </div>
          <span className="text-xs font-semibold text-primary bg-accent px-2.5 py-1 rounded-full">
            {change}
          </span>
        </div>

        {data.length > 1 && (
          <>
            <svg viewBox={`0 0 ${w} ${h}`} className="w-full mt-4">
              <defs>
                <linearGradient id="stats-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.62 0.21 290)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="oklch(0.62 0.21 290)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={area} fill="url(#stats-grad)" />
              <path
                d={path}
                fill="none"
                stroke="oklch(0.62 0.21 290)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {points.map(([x, y], i) => (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={i === points.length - 1 ? 5 : 3}
                  fill="oklch(0.62 0.21 290)"
                  stroke="white"
                  strokeWidth="2"
                />
              ))}
            </svg>
            <div className="flex justify-between px-1 mt-2">
              {labels.map((l, i) => (
                <span key={i} className="text-[10px] text-muted-foreground font-medium">
                  {l}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {summaryCards.map((c) => (
          <StatCard key={c.label} label={c.label} value={c.value} />
        ))}
      </div>
    </>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-card">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold mt-1">{value}</p>
    </div>
  );
}

function StatsSkeleton({ tab }: { tab: Tab }) {
  if (tab === "Daily") {
    return (
      <>
        <div className="mt-6 bg-card rounded-3xl p-6 shadow-card flex flex-col items-center gap-4">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="w-40 h-40 rounded-full" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card rounded-2xl p-4 shadow-card space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      </>
    );
  }
  return (
    <>
      <div className="mt-6 bg-card rounded-3xl p-5 shadow-card space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="flex justify-between">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-4" />
          ))}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card rounded-2xl p-4 shadow-card space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
    </>
  );
}
