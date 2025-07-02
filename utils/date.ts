export type Day =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export type DayColumns =
  | "sunday_times"
  | "monday_times"
  | "tuesday_times"
  | "wednesday_times"
  | "thursday_times"
  | "friday_times"
  | "saturday_times";

export function getDayName(date: Date | string): Day {
  const d = new Date(date);
  const days: Day[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return days[d.getDay()];
}

export function buildDayColumnString(date: Date | string): DayColumns {
  const d = new Date(date);
  const dayColumns: DayColumns[] = [
    "sunday_times",
    "monday_times",
    "tuesday_times",
    "wednesday_times",
    "thursday_times",
    "friday_times",
    "saturday_times",
  ];
  return dayColumns[d.getDay()];
}
