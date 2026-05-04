import { createFileRoute } from "@tanstack/react-router";
import { MobileFrame } from "@/components/MobileFrame";
import { BottomNav } from "@/components/BottomNav";
import { useState } from "react";

export const Route = createFileRoute("/stats")({
  component: StatsPage,
});

const tabs = ["Daily", "Weekly", "Monthly"] as const;
const data = [4200, 6800, 5100, 9200, 7800, 10500, 7842];
const labels = ["M", "T", "W", "T", "F", "S", "S"];

function StatsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Weekly");
  const max = Math.max(...data);
  const w = 320, h = 160, pad = 16;
  const points = data.map((v, i) => {
    const x = pad + (i * (w - pad * 2)) / (data.length - 1);
    const y = h - pad - (v / max) * (h - pad * 2);
    return [x, y] as const;
  });
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const area = `${path} L${points[points.length - 1][0]},${h - pad} L${points[0][0]},${h - pad} Z`;

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

        <div className="mt-6 bg-card rounded-3xl p-5 shadow-card">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">This week</p>
              <p className="text-2xl font-bold mt-1">51,442 <span className="text-sm font-normal text-muted-foreground">steps</span></p>
            </div>
            <span className="text-xs font-semibold text-primary bg-accent px-2.5 py-1 rounded-full">+12%</span>
          </div>
          <svg viewBox={`0 0 ${w} ${h}`} className="w-full mt-4">
            <defs>
              <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.62 0.21 290)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="oklch(0.62 0.21 290)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={area} fill="url(#area-grad)" />
            <path d={path} fill="none" stroke="oklch(0.62 0.21 290)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {points.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={i === points.length - 1 ? 5 : 3} fill="oklch(0.62 0.21 290)" stroke="white" strokeWidth="2" />
            ))}
          </svg>
          <div className="flex justify-between px-1 mt-2">
            {labels.map((l, i) => (
              <span key={i} className="text-[10px] text-muted-foreground font-medium">{l}</span>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <StatCard label="Avg steps" value="7,349" />
          <StatCard label="Goal completion" value="73%" />
          <StatCard label="Best day" value="10,500" sub="Saturday" />
          <StatCard label="Active days" value="6 / 7" />
        </div>
      </div>
      <BottomNav />
    </MobileFrame>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-card">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold mt-1">{value}</p>
      {sub && <p className="text-[11px] text-primary mt-0.5">{sub}</p>}
    </div>
  );
}