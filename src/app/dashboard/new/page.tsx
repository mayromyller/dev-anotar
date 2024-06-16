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
import { unstable_noStore as noStore } from "next/cache";

export default async function NewNotePage() {
  noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  async function postData(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    await prisma.note.create({
      data: {
        userId: user?.id as string,
        description,
        title,
      },
    });

    return redirect("/dashboard");
  }

  return (
    <Card>
      <form action={postData}>
        <CardHeader>
          <CardTitle>Nova nota</CardTitle>
          <CardDescription>
            Você pode criar sua nova nota diretamente aqui
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
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label>Descrição</Label>
            <Textarea
              required
              name="description"
              placeholder="Descreva sua nota da maneira que preferir."
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
