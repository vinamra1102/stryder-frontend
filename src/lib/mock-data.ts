export interface ActivityEntry {
  day: string;
  date: string;
  steps: number;
  done: boolean;
}

// Canonical 8-day history used across activity, profile, and stats pages.
// "done" means steps >= 10,000 (the default goal).
export const activityEntries: ActivityEntry[] = [
  { day: "Today", date: "May 4", steps: 7842, done: false },
  { day: "Sun", date: "May 3", steps: 10500, done: true },
  { day: "Sat", date: "May 2", steps: 10200, done: true },
  { day: "Fri", date: "May 1", steps: 10100, done: true },
  { day: "Thu", date: "Apr 30", steps: 10300, done: true },
  { day: "Wed", date: "Apr 29", steps: 11200, done: true },
  { day: "Tue", date: "Apr 28", steps: 6800, done: false },
  { day: "Mon", date: "Apr 27", steps: 4200, done: false },
];

// Consecutive goal-met days from yesterday going back (today excluded if not done).
export function computeStreak(entries: ActivityEntry[]): number {
  const past = entries.filter((e) => e.day !== "Today");
  let streak = 0;
  for (const e of past) {
    if (e.done) streak++;
    else break;
  }
  return streak;
}

export function computeActiveDays(entries: ActivityEntry[]): number {
  return entries.filter((e) => e.done).length;
}

// Date objects for the activity entries (year 2025).
const MONTH_INDEX: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

export function entryToDate(dateStr: string): Date {
  const [month, day] = dateStr.split(" ");
  return new Date(2025, MONTH_INDEX[month], parseInt(day, 10));
}

export const goalMetDates: Date[] = activityEntries
  .filter((e) => e.done && e.day !== "Today")
  .map((e) => entryToDate(e.date));

// ─── Chart datasets per stats tab ───────────────────────────────────────────

export const dailyDataset = {
  periodLabel: "Today",
  total: "7,842",
  change: "+5%",
  data: [1200, 800, 1500, 2100, 600, 900, 742],
  labels: ["6am", "9am", "12pm", "3pm", "6pm", "9pm", "Now"],
  summary: {
    avg: "—",
    completion: "78%",
    best: "3 pm",
    active: "4 hrs",
  },
  summaryLabels: ["Avg steps", "Goal completion", "Peak hour", "Active hours"],
};

export const weeklyDataset = {
  periodLabel: "This week",
  total: "60,942",
  change: "+18%",
  data: [4200, 6800, 11200, 10100, 10300, 10500, 7842],
  labels: ["M", "T", "W", "T", "F", "S", "S"],
  summary: {
    avg: "8,706",
    completion: "71%",
    best: "11,200",
    active: "5 / 7",
  },
  summaryLabels: ["Avg steps", "Goal completion", "Best day", "Active days"],
};

export const monthlyDataset = {
  periodLabel: "This month",
  total: "234,200",
  change: "+22%",
  data: [42000, 58400, 69800, 63942],
  labels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4"],
  summary: {
    avg: "8,007",
    completion: "67%",
    best: "11,500",
    active: "22 / 30",
  },
  summaryLabels: ["Avg steps", "Goal completion", "Best day", "Active days"],
};
