"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
// @ts-ignore
import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled className="w-fit">
          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
          Enviado...
        </Button>
      ) : (
        <Button type="submit">Salvar</Button>
      )}
    </>
  );
}

export function StripeSubscriptionCreationButton() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled className="w-full">
          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
          Enviando...
        </Button>
      ) : (
        <Button type="submit" className="w-full">
          Assinar
        </Button>
      )}
    </>
  );
}
