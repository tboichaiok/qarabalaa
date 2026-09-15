import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/src/lib/auth";
import Link from "next/link";
import { ArrowLeft, Check, Clock, Truck, X, Package } from "lucide-react";

export default async function OrderDetailPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <header className="border-b border-white/10 px-6 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/orders" className="text-neutral-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-light tracking-tight">Детали заказа</h1>
              <p className="text-xs text-neutral-400">Просмотр и обработка заказа</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-white/10 bg-neutral-950/50 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Package className="h-6 w-6 text-neutral-400" />
            <h2 className="text-xl font-light">Заказ #QB-2026-0000</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: "Статус", value: "Оплачен", color: "text-emerald-400" },
              { label: "Клиент", value: "Алишер Касымов" },
              { label: "Email", value: "customer@qarabala.com" },
              { label: "Телефон", value: "+7 (701) 987-65-43" },
              { label: "Адрес доставки", value: "Алматы, ул. Бекетова д. 5" },
              { label: "Сумма", value: "₸142,900" },
              { label: "Дата", value: "10.09.2026" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between text-sm">
                <span className="text-neutral-400">{item.label}</span>
                <span className={item.color || "text-white"}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
