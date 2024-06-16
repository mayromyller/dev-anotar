import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SubmitButton } from "@/app/components/SubmitButton";
import prisma from "@/app/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

interface GetNoteProps {
  noteId: string;
  userId: string;
}

async function getNote({ userId, noteId }: GetNoteProps) {
  noStore();
  const note = await prisma.note.findUnique({
    where: {
      id: noteId,
      userId,
    },
    select: {
      title: true,
      description: true,
      id: true,
    },
  });

  return note;
}

interface DynamicNotePageProps {
  params: {
    id: string;
  };
}

export default async function DynamicNotePage({
  params,
}: DynamicNotePageProps) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const note = await getNote({ userId: user?.id as string, noteId: params.id });

  async function updateNote(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    await prisma.note.update({
      where: {
        id: note?.id,
        userId: user?.id,
      },
      data: {
        description,
        title,
      },
    });

    revalidatePath("/dashboard");

    return redirect("/dashboard");
  }

  return (
    <Card>
      <form action={updateNote}>
        <CardHeader>
          <CardTitle>Editar nota</CardTitle>
          <CardDescription>
            Você pode editar sua nova nota diretamente aqui
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-5">
          <div className="gap-y-2 flex flex-col">
            <Label>Título</Label>
            <Input
              required
              type="text"
              name="title"
              placeholder="Título para sua nota"
              defaultValue={note?.title}
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label>Descrição</Label>
            <Textarea
              required
              name="description"
              placeholder="Descreva sua nota da maneira que preferir."
              defaultValue={note?.description}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <SubmitButton title="Criar nota" />
          <Button asChild variant="destructive">
            <Link href="/dashboard">Cancelar</Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
