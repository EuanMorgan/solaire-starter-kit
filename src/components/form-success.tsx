import { CheckCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";

interface FormSuccessProps {
  message?: string;
}

export function FormSuccess({ message }: FormSuccessProps) {
  if (!message) return null;

  return (
    <Alert className="border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
      <CheckCircle className="size-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
