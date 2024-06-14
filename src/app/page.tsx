import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <section className="flex items-center justify-center bg-background h-[90vh]">
      <div className="relative items-center w-full px-5 py-12 mx-auto lg:px-16 max-w-7xl md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <div>
            {/* <span className="w-auto px-6 py-3 rounded-full bg-secondary">
              <span className="text-sm font-medium text-primary">
                Classifique suas anotações facilmente
              </span>
            </span> */}

            <h1 className="mt-8 text-3xl font-extrabold tracking-tight lg:text-6xl">
              Crie Notas com facilidade
            </h1>
            <p className="max-w-xl mx-auto mt-8 text-base">
              Com a nossa ferramenta, você pode criar notas e classificar com
              facilidade e acessá-las em qualquer dispositivo. Experimente agora
              mesmo!
            </p>
          </div>

          <div className="flex justify-center max-w-sm mx-auto mt-10">
            <RegisterLink>
              <Button size="lg" className="w-full">
                Cadastre-se gratuitamente
              </Button>
            </RegisterLink>
          </div>
        </div>
      </div>
    </section>
  );
}
