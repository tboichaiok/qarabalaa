import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/src/lib/auth";
import Link from "next/link";
import { ArrowLeft, Plus, Package } from "lucide-react";

export default async function AdminProducts() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <header className="border-b border-white/10 px-6 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-light tracking-tight">Товары</h1>
                <p className="text-xs text-neutral-400">Управление ассортиментом QARA BALA</p>
              </div>
            </div>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 bg-white px-4 py-2.5 text-xs uppercase tracking-[0.25em] font-semibold text-black hover:bg-neutral-200 transition-colors"
            >
              <Plus className="w-4 h-4" /> Добавить товар
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-8">
          <Package className="w-4 h-4" />
          <span>Каталог: 8 позиций</span>
        </div>

        {/* Placeholder - products list would fetch from Prisma */}
        <div className="rounded-lg border border-white/10 bg-neutral-950/50 p-12 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-neutral-600" />
          <h2 className="text-lg font-light">Менеджер товаров</h2>
          <p className="mt-2 text-sm text-neutral-400">
            Создание и редактирование карточек товаров с управлением вариантами и остатками.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            {["Верхняя одежда", "Худи и Свитшоты", "Брюки", "Футболки", "Аксессуары"].map(
              (cat) => (
                <span
                  key={cat}
                  className="rounded bg-white/10 px-3 py-1 text-xs text-neutral-300"
                >
                  {cat}
                </span>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
