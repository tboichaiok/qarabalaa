import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/src/lib/auth";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  Grid3X3,
  ArrowRight,
} from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/auth/signin");
  }

  const menuItems = [
    {
      title: "Продукты",
      description: "Управление товарами и вариантами",
      icon: Package,
      href: "/admin/products",
      badge: "8 позиций",
    },
    {
      title: "Заказы",
      description: "Просмотр и обработка заказов",
      icon: ShoppingBag,
      href: "/admin/orders",
      badge: "Новый",
    },
    {
      title: "Инвентарь",
      description: "Управление остатками на складе",
      icon: Grid3X3,
      href: "/admin/inventory",
    },
    {
      title: "Клиенты",
      description: "Список зарегистрированных пользователей",
      icon: Users,
      href: "/admin/customers",
    },
    {
      title: "Аналитика",
      description: "Статистика продаж и конверсий",
      icon: BarChart3,
      href: "/admin/analytics",
    },
    {
      title: "Настройки",
      description: "Конфигурация магазина и Telegram-бота",
      icon: Settings,
      href: "/admin/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      {/* Top bar */}
      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex flex-col gap-4 rounded-lg border border-white/10 bg-neutral-950/50 p-6 hover:border-white/20 hover:bg-neutral-900/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded bg-white/5 text-neutral-400 group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-neutral-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <h3 className="text-base font-medium tracking-tight text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-400">
                    {item.description}
                  </p>
                </div>
                {item.badge && (
                  <span className="self-start rounded bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-neutral-300">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <h2 className="mb-6 text-lg font-light tracking-tight">Быстрая статистика</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Всего товаров", value: "8", change: "+2" },
              { label: "Заказов сегодня", value: "3", change: "+1" },
              { label: "Выручка", value: "₸142,900", change: "+12%" },
              { label: "Пользователей", value: "2", change: "+0" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg bg-neutral-950/50 border border-white/5 p-6"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-light tabular-nums">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-emerald-400">{stat.change}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
