"use client";
// Mobile and tablet version of the booking panel: a button in the chat header that opens the
// booking summary in a bottom sheet. Hidden on large screens, where the side panel is visible.
import type { ReactNode } from "react";
import { ClipboardListIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type BookingSheetProps = {
  progressLabel: string;
  children: ReactNode;
};

export function BookingSheet({ progressLabel, children }: BookingSheetProps) {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" size="sm" className="lg:hidden" />}>
        <ClipboardListIcon aria-hidden />
        Booking
        <span className="text-muted-foreground tabular-nums">{progressLabel}</span>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[85dvh] rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>Your booking</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto px-4 pb-6">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
