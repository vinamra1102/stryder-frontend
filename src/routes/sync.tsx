import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileFrame } from "@/components/MobileFrame";
import { ChevronLeft, Footprints } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/sync")({
  component: SyncPage,
});

function SyncPage() {
  const [val, setVal] = useState("");

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    const num = parseInt(raw, 10);
    if (raw === "") {
      setVal("");
    } else if (!isNaN(num) && num >= 0 && num <= 99999) {
      setVal(String(num));
    }
  }
  return (
    <MobileFrame>
      <div className="flex-1 px-6 pt-10 pb-8 flex flex-col">
        <Link to="/home" className="w-10 h-10 rounded-full bg-card shadow-card flex items-center justify-center">
          <ChevronLeft size={18} />
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight mt-6">Add Steps</h1>
        <p className="text-sm text-muted-foreground mt-1">Log manually or sync from Google Fit</p>

        <div className="mt-8 bg-card rounded-3xl p-6 shadow-card">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Manual entry</label>
          <div className="mt-3 flex items-center gap-3 bg-accent/60 rounded-2xl px-4 py-4">
            <Footprints size={20} className="text-primary" />
            <input
              value={val}
              onChange={handleInput}
              placeholder="Enter steps"
              inputMode="numeric"
              type="text"
              maxLength={5}
              className="flex-1 bg-transparent outline-none text-lg font-semibold placeholder:text-muted-foreground/60"
            />
          </div>
          <button className="mt-4 w-full py-4 rounded-full bg-gradient-primary text-primary-foreground font-semibold shadow-soft active:scale-[0.98] transition-transform">
            Add Steps
          </button>
        </div>

        <div className="mt-5 bg-card rounded-3xl p-6 shadow-card">
          <p className="text-sm font-semibold">Connect a source</p>
          <p className="text-xs text-muted-foreground mt-1">Sync automatically in the background.</p>
          <button className="mt-4 w-full py-4 rounded-full border-2 border-primary/20 text-primary font-semibold active:scale-[0.98] transition-transform">
            Sync with Google Fit
          </button>
        </div>
      </div>
    </MobileFrame>
  );
}