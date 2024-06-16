"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
// @ts-ignore
import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  title?: string;
}

export function SubmitButton({ title }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled className="w-fit">
          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
          Enviado...
        </Button>
      ) : (
        <Button type="submit">{title ?? "Salvar"}</Button>
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

export function StripePortal() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled className="w-fit">
          <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Carregando...
        </Button>
      ) : (
        <Button className="w-fit" type="submit">
          Ver detalhes de pagamento
        </Button>
      )}
    </>
  );
}

export function TrashDelete() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button variant={"destructive"} size="icon" disabled>
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
      ) : (
        <Button variant={"destructive"} size="icon" type="submit">
          <Trash className="h-4 w-4" />
        </Button>
      )}
    </>
  );
}
