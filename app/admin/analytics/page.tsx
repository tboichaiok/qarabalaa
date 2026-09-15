import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/src/lib/auth";
import Link from "next/link";
import { ArrowLeft, BarChart3 } from "lucide-react";

export default async function AdminAnalytics() {
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
              <h1 className="text-2xl font-light tracking-tight">Аналитика</h1>
              <p className="text-xs text-neutral-400">Статистика продаж и конверсий</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-white/10 bg-neutral-950/50 p-12 text-center">
          <BarChart3 className="mx-auto mb-4 h-12 w-12 text-neutral-600" />
          <h2 className="text-lg font-light">Аналитическая панель</h2>
          <p className="mt-2 text-sm text-neutral-400">
            Дашборд с ключевыми метриками продаж и аналитическими данными.
          </p>
        </div>
      </main>
    </div>
  );
}
