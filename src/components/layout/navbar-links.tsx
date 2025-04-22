
import { CalendarCheck, LayoutDashboard, ClipboardList, Send, BarChartHorizontal, UserCog, Package } from "lucide-react";

export const navLinks = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Pesquisas",
    href: "/surveys",
    icon: ClipboardList,
  },
  {
    title: "Agendamentos",
    href: "/scheduling",
    icon: CalendarCheck,
  },
  {
    title: "Entregas",
    href: "/delivery-management",
    icon: Package,
  },
  {
    title: "Análises",
    href: "/analytics",
    icon: BarChartHorizontal,
  },
  {
    title: "Perfil",
    href: "/recruiter-profile",
    icon: UserCog,
  },
];
