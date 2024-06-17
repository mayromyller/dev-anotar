import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { ReactNode } from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "../lib/db";
import { stripe } from "../lib/stripe";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

interface UserDataProps {
  id: string;
  email: string;
  firstName: string | undefined | null;
  lastName: string | undefined | null;
  profileImage: string | undefined | null;
}

async function getData({
  id,
  email,
  firstName,
  lastName,
  profileImage,
}: UserDataProps) {
  noStore();
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      stripeCustomerId: true,
    },
  });

  if (!user) {
    const name = `${firstName ?? ""} ${lastName ?? ""}`;
    await prisma.user.create({
      data: {
        id,
        name,
        email,
      },
    });
  }

  if (!user?.stripeCustomerId) {
    const data = await stripe.customers.create({
      email,
    });

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        stripeCustomerId: data.id,
      },
    });
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { getUser } = getKindeServerSession();

  const user = await getUser();
  if (!user) {
    return redirect("/");
  }

  await getData({
    id: user.id,
    email: user.email as string,
    firstName: user.given_name,
    lastName: user.family_name,
    profileImage: user.picture,
  });

  return (
    <div className="flex flex-col space-y-6 mt-10">
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav />
        </aside>
        <main className="min-h-[100vh]">{children}</main>
      </div>

      <footer className="my-8 border-t">
        <div className="flex items-center justify-center py-8">
          <p className="text-white text-xs">
            developed by{" "}
            <span className="text-primary">
              <Link href="https://github.com/mayromyller">Mayro Myller</Link>
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
