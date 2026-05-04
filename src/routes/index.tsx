import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { MobileFrame } from "@/components/MobileFrame";
import onboardingImg from "@/assets/onboarding.png";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [goal, setGoal] = useState(8000);
  const goals = [5000, 8000, 10000];
  return (
    <MobileFrame>
      <div className="flex flex-col flex-1 px-7 pt-10 pb-8">
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full aspect-square max-w-[300px] rounded-[40px] bg-gradient-soft flex items-center justify-center shadow-soft animate-fade-up">
            <img src={onboardingImg} alt="Person walking" width={300} height={300} className="w-[78%] h-[78%] object-contain" />
          </div>
        </div>
        <div className="mt-8 animate-fade-up">
          <h1 className="text-[28px] leading-[1.15] font-semibold tracking-tight text-foreground">
            Track Your Life.<br/>Not Just Steps.
          </h1>
          <p className="mt-3 text-[15px] text-muted-foreground leading-relaxed">
            A calmer way to move. Set a daily goal and let Strydr quietly cheer you on.
          </p>
        </div>
        <div className="mt-7">
          <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Daily step goal</p>
          <div className="grid grid-cols-3 gap-3">
            {goals.map((g) => (
              <button
                key={g}
                onClick={() => setGoal(g)}
                className={`py-4 rounded-2xl text-sm font-semibold transition-all ${
                  goal === g
                    ? "bg-gradient-primary text-primary-foreground shadow-soft"
                    : "bg-card text-foreground shadow-card hover:shadow-soft"
                }`}
              >
                {g / 1000}k
              </button>
            ))}
          </div>
        </div>
        <div className="mt-7 space-y-3">
          <Link
            to="/home"
            className="block w-full text-center py-4 rounded-full bg-gradient-primary text-primary-foreground font-semibold shadow-soft active:scale-[0.98] transition-transform"
          >
            Get Started
          </Link>
          <Link to="/home" className="block text-center text-sm text-muted-foreground font-medium">
            Skip for now
          </Link>
        </div>
      </div>
    </MobileFrame>
  );
}
