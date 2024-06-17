import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "../lib/db";
import { Button } from "@/components/ui/button";
import { Edit, File } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TrashDelete } from "../components/SubmitButton";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

async function getData(userId: string) {
  noStore();
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      Notes: true,
      Subscription: {
        select: {
          status: true,
        },
      },
    },
  });

  return data;
}

export default async function DashboardPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getData(user?.id as string);

  async function deleteNote(formData: FormData) {
    "use server";

    const noteId = formData.get("noteId") as string;

    await prisma.note.delete({
      where: {
        id: noteId,
      },
    });

    revalidatePath("/dashboard");
  }

  console.log(data?.Subscription?.status);

  return (
    <div className="grid items-start gap-8">
      <div className="flex items-center justify-between gap-2 px-2 flex-col md:flex-row">
        <div className="grid gap-1">
          <h1 className="text-3xl md:text-4xl font-medium">Suas notas</h1>
          <p className="text-lg text-muted-foreground">
            {" "}
            Aqui você pode ver e criar novas notas.
          </p>
        </div>
        {data?.Subscription?.status === "active" ? (
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/new">Crie uma nova nota</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href="/dashboard/billing">Crie uma nova nota</Link>
          </Button>
        )}
      </div>

      {data?.Notes.length == 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed animate-in fade-in-50 p-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <File className="w-10 h-10 text-primary" />
          </div>

          <h2 className="mt-6 text-xl font-semibold">
            Você ainda não tem nenhuma nota
          </h2>
          <p className="mb-8 mt-2 text-center text-sm leading-6 text-muted-foreground max-w-sm mx-auto">
            Crie algumas para visualizá-las aqui.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-y-4">
          {data?.Notes.map((item) => (
            <Card
              key={item.id}
              className="flex items-center justify-between p-4"
            >
              <div>
                <h2 className="font-semibold text-xl text-primary">
                  {item.title}
                </h2>
                <p className="text-muted-foreground">
                  {new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "full",
                  }).format(new Date(item.createdAt))}
                </p>
              </div>

              <div className="flex gap-x-4">
                <Link href={`/dashboard/new/${item.id}`}>
                  <Button variant="outline" size="icon">
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>

                <form action={deleteNote}>
                  <TrashDelete />
                  <input type="hidden" name="noteId" value={item.id} />
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
