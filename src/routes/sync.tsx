import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { MobileFrame } from "@/components/MobileFrame";
import { useRefreshToken } from "@/lib/queries";

export const Route = createFileRoute("/sync")({
  component: SyncPage,
});

function SyncPage() {
  const refresh = useRefreshToken();

  function handleSync() {
    refresh.mutate();
  }

  function handleManualEntry() {
    toast.info("Manual entry is not yet supported. Your steps sync automatically from Google Fit.");
  }

  return (
    <MobileFrame>
      <div className="flex-1 px-6 pt-10 pb-8 flex flex-col">
        <Link to="/home" className="w-10 h-10 rounded-full bg-card shadow-card flex items-center justify-center">
          <ChevronLeft size={18} />
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight mt-6">Sync Data</h1>
        <p className="text-sm text-muted-foreground mt-1">Keep your steps up to date</p>

        {/* Google Fit sync */}
        <div className="mt-8 bg-card rounded-3xl p-6 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent text-primary flex items-center justify-center">
              <RefreshCw size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold">Google Fit</p>
              <p className="text-xs text-muted-foreground">Pull latest steps from your account</p>
            </div>
          </div>
          <button
            onClick={handleSync}
            disabled={refresh.isPending}
            className="w-full py-4 rounded-full bg-gradient-primary text-primary-foreground font-semibold shadow-soft active:scale-[0.98] transition-transform disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} className={refresh.isPending ? "animate-spin" : ""} />
            {refresh.isPending ? "Syncing…" : "Sync with Google Fit"}
          </button>
        </div>

        {/* Manual entry — not supported yet */}
        <div className="mt-5 bg-card rounded-3xl p-6 shadow-card opacity-60">
          <p className="text-sm font-semibold">Manual entry</p>
          <p className="text-xs text-muted-foreground mt-1">
            Coming soon — steps will be entered manually here.
          </p>
          <button
            onClick={handleManualEntry}
            className="mt-4 w-full py-4 rounded-full border-2 border-primary/20 text-primary font-semibold active:scale-[0.98] transition-transform"
          >
            Add Steps Manually
          </button>
        </div>
      </div>
    </MobileFrame>
  );
}
