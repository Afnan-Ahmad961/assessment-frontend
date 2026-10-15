"use client";
// The form fallback for the chat. Opens pre-filled with whatever the assistant collected, lets the
// user pick from real free times, and books through the same API as the chat (linked to it).
import { useState, type FormEvent } from "react";

import { FormErrorAlert } from "@/components/shared/form-error-alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useAvailability } from "@/hooks/booking/use-availability";
import { useBookAppointment } from "@/hooks/booking/use-book-appointment";
import { useServices } from "@/hooks/booking/use-services";
import { BffError } from "@/lib/bff/bff-client";
import { todayInBrowser, toClockValue } from "@/lib/format-booking";
import type { BookingDraft } from "@/types/chat";

import { TimeSlotPicker } from "./time-slot-picker";

type BookingFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: BookingDraft;
  chatSessionId: string;
};

export function BookingFormDialog({ open, onOpenChange, draft, chatSessionId }: BookingFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book an appointment</DialogTitle>
          <DialogDescription>Details from the chat are filled in. Change anything you like.</DialogDescription>
        </DialogHeader>
        {/* Mounted only while open, so it starts from the latest draft every time. */}
        {open && <BookingForm draft={draft} chatSessionId={chatSessionId} onBooked={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

type BookingFormProps = {
  draft: BookingDraft;
  chatSessionId: string;
  onBooked: () => void;
};

function BookingForm({ draft, chatSessionId, onBooked }: BookingFormProps) {
  const [serviceId, setServiceId] = useState(draft.service?.id ?? "");
  const [date, setDate] = useState(draft.date ?? "");
  const [notes, setNotes] = useState(draft.notes ?? "");
  const [pickedStart, setPickedStart] = useState<Date | null>(null);

  const services = useServices();
  const availability = useAvailability(serviceId, date);
  const book = useBookAppointment();

  // Until the user picks a time, pre-select the draft's time if it's still free.
  const draftSlot =
    serviceId === draft.service?.id && date === draft.date && availability.data
      ? availability.data.slots.find((slot) => toClockValue(slot.startsAt, availability.data.timeZone) === draft.time)
      : undefined;
  const selectedStart = pickedStart ?? draftSlot?.startsAt ?? null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!serviceId || !selectedStart) return;
    book.mutate(
      { serviceId, startsAt: selectedStart, notes: notes.trim() || undefined, chatSessionId },
      { onSuccess: onBooked },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FieldGroup>
        <FormErrorAlert message={book.error ? errorMessage(book.error) : undefined} />

        <Field>
          <FieldLabel htmlFor="booking-service">Service</FieldLabel>
          <NativeSelect
            id="booking-service"
            className="w-full"
            value={serviceId}
            disabled={services.isPending}
            onChange={(event) => {
              setServiceId(event.target.value);
              setPickedStart(null);
            }}
          >
            <NativeSelectOption value="" disabled>
              {services.isPending ? "Loading services..." : "Choose a service"}
            </NativeSelectOption>
            {services.data?.map((service) => (
              <NativeSelectOption key={service.id} value={service.id}>
                {service.name} ({service.durationMinutes} min)
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>

        <Field>
          <FieldLabel htmlFor="booking-date">Date</FieldLabel>
          <Input
            id="booking-date"
            type="date"
            className="h-9"
            min={todayInBrowser()}
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
              setPickedStart(null);
            }}
          />
        </Field>

        <Field>
          <FieldLabel id="booking-time-label">Time</FieldLabel>
          <TimeSlotPicker
            slots={availability.data?.slots}
            timeZone={availability.data?.timeZone}
            isLoading={availability.isFetching && !availability.data}
            error={availability.error ? errorMessage(availability.error) : null}
            selected={selectedStart}
            onSelect={setPickedStart}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="booking-notes">Notes (optional)</FieldLabel>
          <Textarea
            id="booking-notes"
            value={notes}
            maxLength={1000}
            rows={2}
            placeholder="Anything we should know?"
            onChange={(event) => setNotes(event.target.value)}
          />
        </Field>
      </FieldGroup>

      <DialogFooter>
        <Button type="submit" disabled={!serviceId || !selectedStart || book.isPending}>
          {book.isPending && <Spinner aria-hidden />}
          {book.isPending ? "Booking..." : "Book appointment"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function errorMessage(error: Error): string {
  return error instanceof BffError ? error.message : "Something went wrong. Please try again.";
}
