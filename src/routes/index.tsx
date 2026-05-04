import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileFrame } from "@/components/MobileFrame";
import { ProgressRing } from "@/components/ProgressRing";
import onboardingImg from "@/assets/onboarding.png";
import consistencyImg from "@/assets/onboarding-consistency.png";
import goalImg from "@/assets/onboarding-goal.png";

export const Route = createFileRoute("/")({
  component: Onboarding,
});

const STORAGE_KEY = "strydr_onboarded";

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState(10000);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY)) {
      navigate({ to: "/home" });
    }
  }, [navigate]);

  const finish = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, "1");
      localStorage.setItem("strydr_goal", String(goal));
    }
    navigate({ to: "/home" });
  };

  const next = () => setStep((s) => Math.min(2, s + 1));

  return (
    <MobileFrame>
      <div className="flex-1 overflow-hidden relative">
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${step * 100}%)` }}
        >
          <Slide>
            <Illustration src={onboardingImg} alt="Person walking" />
            <Copy
              title={<>Move Better.<br/>Live Better.</>}
              subtitle="Track your daily steps and build consistent habits."
            />
            <Footer>
              <PrimaryButton onClick={next}>Next</PrimaryButton>
              <SkipButton onClick={finish}>Skip</SkipButton>
              <Dots active={0} />
            </Footer>
          </Slide>

          <Slide>
            <Illustration src={consistencyImg} alt="Person progressing" />
            <Copy
              title="Stay Consistent"
              subtitle="Track progress, build streaks, and stay on top of your goals."
            />
            <div className="mx-7 mt-5 rounded-[20px] bg-card shadow-card p-4 flex items-center gap-4 animate-fade-up">
              <ProgressRing value={0.72} size={64} stroke={7}>
                <span className="text-[11px] font-semibold text-foreground">72%</span>
              </ProgressRing>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Today's progress</p>
                <p className="text-xs text-muted-foreground mt-0.5">7,200 of 10,000 steps</p>
              </div>
            </div>
            <Footer>
              <PrimaryButton onClick={next}>Next</PrimaryButton>
              <SkipButton onClick={finish}>Skip</SkipButton>
              <Dots active={1} />
            </Footer>
          </Slide>

          <Slide>
            <div className="px-7 pt-10">
              <Copy
                title="Set Your Daily Goal"
                subtitle="Choose a step goal to get started."
                inline
              />
            </div>
            <div className="px-7 mt-7 space-y-3">
              {[5000, 8000, 10000].map((g) => {
                const selected = goal === g;
                return (
                  <button
                    key={g}
                    onClick={() => setGoal(g)}
                    className={`w-full p-5 rounded-[20px] flex items-center justify-between transition-all ${
                      selected
                        ? "bg-gradient-primary text-primary-foreground shadow-soft"
                        : "bg-card text-foreground shadow-card"
                    }`}
                  >
                    <span className="text-lg font-semibold">{g.toLocaleString()}</span>
                    <span className={`text-xs font-medium ${selected ? "opacity-90" : "text-muted-foreground"}`}>
                      steps / day
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex-1 flex items-end justify-center pt-4">
              <img src={goalImg} alt="Goal" width={768} height={768} loading="lazy" className="w-[60%] max-w-[220px] object-contain" />
            </div>
            <Footer>
              <PrimaryButton onClick={finish}>Get Started</PrimaryButton>
              <Dots active={2} />
            </Footer>
          </Slide>
        </div>
      </div>
    </MobileFrame>
  );
}

function Slide({ children }: { children: React.ReactNode }) {
  return <div className="w-full flex-shrink-0 flex flex-col">{children}</div>;
}

function Illustration({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="px-7 pt-10">
      <div className="relative w-full aspect-square max-w-[300px] mx-auto rounded-[40px] bg-gradient-soft flex items-center justify-center shadow-soft animate-fade-up">
        <img src={src} alt={alt} width={300} height={300} className="w-[78%] h-[78%] object-contain" />
      </div>
    </div>
  );
}

function Copy({ title, subtitle, inline }: { title: React.ReactNode; subtitle: string; inline?: boolean }) {
  return (
    <div className={`${inline ? "" : "px-7"} mt-7 animate-fade-up`}>
      <h1 className="text-[28px] leading-[1.15] font-semibold tracking-tight text-foreground">{title}</h1>
      <p className="mt-3 text-[15px] text-muted-foreground leading-relaxed">{subtitle}</p>
    </div>
  );
}

function Footer({ children }: { children: React.ReactNode }) {
  return <div className="px-7 pb-8 pt-6 space-y-3">{children}</div>;
}

function PrimaryButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="block w-full text-center py-4 rounded-full bg-gradient-primary text-primary-foreground font-semibold shadow-soft active:scale-[0.98] transition-transform"
    >
      {children}
    </button>
  );
}

function SkipButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="block w-full text-center text-sm text-muted-foreground font-medium">
      {children}
    </button>
  );
}

function Dots({ active }: { active: number }) {
  return (
    <div className="flex items-center justify-center gap-2 pt-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all ${i === active ? "w-6 bg-primary" : "w-1.5 bg-secondary/60"}`}
        />
      ))}
    </div>
  );
}