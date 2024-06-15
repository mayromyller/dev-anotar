import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/app/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { SubmitButton } from "../../components/SubmitButton";
import { revalidatePath } from "next/cache";

async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      colorScheme: true,
    },
  });
  return data;
}

export default async function SettingsPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getData(user?.id as string);

  async function updateUser(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const colorScheme = formData.get("color") as string;

    await prisma.user.update({
      where: { id: user?.id },
      data: {
        name: name ?? undefined,
        colorScheme: colorScheme ?? undefined,
      },
    });

    revalidatePath("/", "layout");
  }

  return (
    <div className="grid items-start gap-8">
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <h1 className="text-3xl md:text-4xl font-medium">Configurações</h1>
          <p className="text-lg text-muted-foreground">
            Seu perfil de configurações
          </p>
        </div>
      </div>

      <Card>
        <form action={updateUser}>
          <CardHeader>
            <CardTitle>Dados gerais</CardTitle>
            <CardDescription>
              Por favor, forneça informações gerais sobre você. Não esqueça de
              salvar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="space-y-1">
                <Label>Seu nome</Label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Seu nome"
                  defaultValue={data?.name ?? ""}
                />
              </div>

              <div className="space-y-1">
                <Label>Seu email</Label>
                <Input
                  type="email"
                  name="name"
                  placeholder="Seu email"
                  defaultValue={data?.email as string}
                  disabled
                />
              </div>

              <div className="space-y-1">
                <Label>Cores</Label>
                <Select name="color" defaultValue={data?.colorScheme as string}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione uma cor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Cores</SelectLabel>
                      <SelectItem value="theme-green">Verde</SelectItem>
                      <SelectItem value="theme-orange">Laranja</SelectItem>
                      <SelectItem value="theme-blue">Azul</SelectItem>
                      <SelectItem value="theme-violet">Roxo</SelectItem>
                      <SelectItem value="theme-rose">Rosa</SelectItem>
                      <SelectItem value="theme-red">Vermelho</SelectItem>
                      <SelectItem value="theme-yellow">Amarelo</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
