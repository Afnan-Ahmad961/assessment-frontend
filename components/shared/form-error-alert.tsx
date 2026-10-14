// Shows a problem with a whole form (wrong credentials, server down, slot taken) above its fields.
import { CircleAlertIcon } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";

export function FormErrorAlert({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <Alert variant="destructive">
      <CircleAlertIcon aria-hidden />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
