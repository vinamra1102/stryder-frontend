import { Link, useLocation } from "@tanstack/react-router";
import { Home, BarChart3, Activity, User } from "lucide-react";

const items = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/stats", label: "Stats", icon: BarChart3 },
  { to: "/activity", label: "Activity", icon: Activity },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-border/60 px-4 pt-3 pb-5">
      <ul className="flex items-center justify-between">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className="flex flex-col items-center gap-1 group"
              >
                <span
                  className={`flex items-center justify-center w-11 h-11 rounded-2xl transition-all ${
                    active
                      ? "bg-gradient-primary text-primary-foreground shadow-soft"
                      : "text-muted-foreground group-hover:text-primary"
                  }`}
                >
                  <Icon size={20} strokeWidth={2} />
                </span>
                <span
                  className={`text-[10px] font-medium ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}