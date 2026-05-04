import { ReactNode } from "react";

export function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-gradient-soft flex items-center justify-center p-0 sm:p-6">
      <div className="relative w-full sm:max-w-[420px] sm:rounded-[40px] bg-background sm:shadow-glow overflow-hidden min-h-screen sm:min-h-[860px] sm:max-h-[860px] flex flex-col">
        {children}
      </div>
    </div>
  );
}