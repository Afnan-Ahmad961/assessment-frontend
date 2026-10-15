// Grid of free start times for the chosen service and date. Only real free slots are offered, so
// the form can't submit a time the API would reject.
import { Skeleton } from "@/components/ui/skeleton";
import { formatClockTime, toClockValue } from "@/lib/format-booking";
import { cn } from "@/lib/utils";

type Slot = { startsAt: Date };

type TimeSlotPickerProps = {
  slots: Slot[] | undefined;
  timeZone: string | undefined;
  isLoading: boolean;
  error: string | null;
  selected: Date | null;
  onSelect: (startsAt: Date) => void;
};

export function TimeSlotPicker({ slots, timeZone, isLoading, error, selected, onSelect }: TimeSlotPickerProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="h-8" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (!slots || !timeZone) {
    return <p className="text-sm text-muted-foreground">Choose a service and date to see free times.</p>;
  }

  if (slots.length === 0) {
    return <p className="text-sm text-muted-foreground">No free times on this day. Try another date.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="grid max-h-48 grid-cols-4 gap-2 overflow-y-auto p-0.5" role="group" aria-label="Free times">
        {slots.map((slot) => {
          const isSelected = selected?.getTime() === slot.startsAt.getTime();
          return (
            <button
              key={slot.startsAt.toISOString()}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(slot.startsAt)}
              className={cn(
                "h-8 rounded-lg border text-sm tabular-nums transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                isSelected ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              {formatClockTime(toClockValue(slot.startsAt, timeZone))}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">Times are in {timeZone}.</p>
    </div>
  );
}
