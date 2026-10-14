// Full-width submit button that shows a spinner and a "working" label while the action runs.
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type SubmitButtonProps = {
  pending: boolean;
  label: string;
  pendingLabel: string;
};

export function SubmitButton({ pending, label, pendingLabel }: SubmitButtonProps) {
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending} aria-busy={pending}>
      {pending && <Spinner aria-hidden />}
      {pending ? pendingLabel : label}
    </Button>
  );
}
