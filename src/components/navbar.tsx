import Link from "next/link";

import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { UserNavbar } from "./user-nav";
import { Menu } from "lucide-react";

export async function Navbar() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <nav className="border-b bg-background h-[10vh] flex items-center">
      <div className="container flex items-center justify-between">
        <Link href="/">
          <h1 className="font-bold text-2xl sm:text-3xl flex items-center">
            Dev<span className="text-primary">Anotar</span>
          </h1>
        </Link>

        <div className="flex items-center gap-x-5">
          {(await isAuthenticated()) ? (
            <>
              <ThemeToggle />
              <UserNavbar
                name={user?.given_name as string}
                email={user?.email as string}
                picture={user?.picture as string}
              />
            </>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-x-5">
                <LoginLink>
                  <Button>Entrar</Button>
                </LoginLink>

                <RegisterLink>
                  <Button variant="secondary">Inscreva-se</Button>
                </RegisterLink>
              </div>

              <div className="flex md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Menu />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <LoginLink className="w-full">
                        <Button className="w-full">Entrar</Button>
                      </LoginLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <RegisterLink className="w-full">
                        <Button variant="secondary" className="w-full">
                          Inscreva-se
                        </Button>
                      </RegisterLink>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
