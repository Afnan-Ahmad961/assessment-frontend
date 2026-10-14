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

/** "14:30" for an instant, on the clock of `timeZone`. */
export function formatTimeInZone(instant: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone }).format(
    instant,
  );
}

/** Today's date as "YYYY-MM-DD" in the browser's timezone, for the date picker's minimum. */
export function todayInBrowser(): string {
  return new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}
