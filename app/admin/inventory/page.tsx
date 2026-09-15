import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/src/lib/auth";
import Link from "next/link";
import { ArrowLeft, Package, AlertTriangle, TrendingDown } from "lucide-react";

export default async function AdminInventory() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <header className="border-b border-white/10 px-6 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-neutral-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-light tracking-tight">Инвентарь</h1>
              <p className="text-xs text-neutral-400">Управление остатками на складе</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-8">
          <Package className="w-4 h-4" />
          <span>Остатки по категориям</span>
        </div>

        {/* Placeholder */}
        <div className="rounded-lg border border-white/10 bg-neutral-950/50 p-12 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-neutral-600" />
          <h2 className="text-lg font-light">Инвентарный менеджер</h2>
          <p className="mt-2 text-sm text-neutral-400">
            Мониторинг уровней запасов с предупреждениями о низких остатках.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <span className="inline-flex items-center gap-1.5 rounded bg-amber-500/20 px-3 py-1 text-xs text-amber-400">
              <AlertTriangle className="w-3 h-3" /> 3 позиции на минимуме
            </span>
            <span className="inline-flex items-center gap-1.5 rounded bg-emerald-500/20 px-3 py-1 text-xs text-emerald-400">
              <TrendingDown className="w-3 h-3" /> Остатки критические: 0 шт.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
