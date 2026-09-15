import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/src/lib/auth";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, CheckCircle, Clock, Truck, XCircle } from "lucide-react";

export default async function AdminOrders() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/auth/signin");
  }

  const statusIcons: Record<string, React.ElementType> = {
    PENDING: Clock,
    PAID: CheckCircle,
    SHIPPED: Truck,
    CANCELLED: XCircle,
  };

  const statusColors: Record<string, string> = {
    PENDING: "text-amber-400",
    PAID: "text-emerald-400",
    SHIPPED: "text-blue-400",
    CANCELLED: "text-red-400",
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <header className="border-b border-white/10 px-6 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-neutral-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-light tracking-tight">Заказы</h1>
              <p className="text-xs text-neutral-400">Просмотр и обработка заказов клиентов</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-8">
          <ShoppingBag className="w-4 h-4" />
          <span>Все заказы</span>
        </div>

        {/* Placeholder */}
        <div className="rounded-lg border border-white/10 bg-neutral-950/50 p-12 text-center">
          <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-neutral-600" />
          <h2 className="text-lg font-light">Панель заказов</h2>
          <p className="mt-2 text-sm text-neutral-400">
            Список заказов с возможностью изменения статуса и отслеживания доставки.
          </p>
        </div>
      </main>
    </div>
  );
}
