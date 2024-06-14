import { CreditCard, Home, Settings } from "lucide-react";

export const navItems = [
  { name: "Início", href: "/dashboard", icon: Home },
  { name: "Configurações", href: "/dashboard/settings", icon: Settings },
  { name: "Faturamento", href: "/dashboard/billing", icon: CreditCard },
];
