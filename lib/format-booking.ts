// Formatting for booking dates and times. Dates and times are always shown in the business's
// timezone (that's what the assistant talks in), so the result is the same on the server and in
// any browser.

/** "Tue 20 Oct" for a calendar date "YYYY-MM-DD". */
export function formatCalendarDate(date: string): string {
  // Noon UTC on that date, formatted in UTC, always lands on the same calendar day.
  return new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).format(
    new Date(`${date}T12:00:00Z`),
  );
}

/** "14:30" for an instant, on the clock of `timeZone`. The same format as the draft's time. */
export function toClockValue(instant: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone }).format(
    instant,
  );
}

/** "2 pm" or "2:30 pm" for a clock value "14:30": the way the assistant says times. */
export function formatClockTime(clock: string): string {
  const [hours = 0, minutes = 0] = clock.split(":").map(Number);
  const suffix = hours < 12 ? "am" : "pm";
  const hour12 = hours % 12 || 12;
  return minutes === 0 ? `${hour12} ${suffix}` : `${hour12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

/** The parts of an instant's date on the clock of `timeZone`, e.g. { weekday: "Tue", day: "20", month: "Oct" }. */
export function dateParts(instant: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone }).formatToParts(
    instant,
  );
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  return { weekday: part("weekday"), day: part("day"), month: part("month") };
}

/** "October 2026" for an instant, on the clock of `timeZone`. */
export function formatMonthYear(instant: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone }).format(instant);
}

/** Today's date as "YYYY-MM-DD" in the browser's timezone, for the date picker's minimum. */
export function todayInBrowser(): string {
  return new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}
