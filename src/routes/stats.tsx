import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MobileFrame } from "@/components/MobileFrame";
import { BottomNav } from "@/components/BottomNav";
import { Skeleton } from "@/components/ui/skeleton";
import { dailyDataset, weeklyDataset, monthlyDataset } from "@/lib/mock-data";

export const Route = createFileRoute("/stats")({
  component: StatsPage,
});

const tabs = ["Daily", "Weekly", "Monthly"] as const;
type Tab = (typeof tabs)[number];

const datasets: Record<Tab, typeof dailyDataset> = {
  Daily: dailyDataset,
  Weekly: weeklyDataset,
  Monthly: monthlyDataset,
};

function StatsPage() {
  const [tab, setTab] = useState<Tab>("Weekly");
  const [isLoading] = useState(false); // flip to true once backend is wired

  const ds = datasets[tab];

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
          <StatsSkeleton />
        ) : (
          <>
            <ChartCard ds={ds} />

            <div className="mt-4 grid grid-cols-2 gap-3">
              {Object.entries(ds.summary).map(([key, value], i) => (
                <StatCard key={key} label={ds.summaryLabels[i]} value={value} />
              ))}
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </MobileFrame>
  );
}

function ChartCard({ ds }: { ds: typeof dailyDataset }) {
  const w = 320;
  const h = 160;
  const pad = 16;
  const max = Math.max(...ds.data);
  const points = ds.data.map((v, i) => {
    const x = pad + (i * (w - pad * 2)) / (ds.data.length - 1);
    const y = h - pad - (v / max) * (h - pad * 2);
    return [x, y] as const;
  });
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const area = `${path} L${points[points.length - 1][0]},${h - pad} L${points[0][0]},${h - pad} Z`;

  return (
    <div className="mt-6 bg-card rounded-3xl p-5 shadow-card">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{ds.periodLabel}</p>
          <p className="text-2xl font-bold mt-1">
            {ds.total} <span className="text-sm font-normal text-muted-foreground">steps</span>
          </p>
        </div>
        <span className="text-xs font-semibold text-primary bg-accent px-2.5 py-1 rounded-full">
          {ds.change}
        </span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full mt-4">
        <defs>
          <linearGradient id="stats-area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.62 0.21 290)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="oklch(0.62 0.21 290)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#stats-area-grad)" />
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
        {ds.labels.map((l, i) => (
          <span key={i} className="text-[10px] text-muted-foreground font-medium">
            {l}
          </span>
        ))}
      </div>
    </div>
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

function StatsSkeleton() {
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
