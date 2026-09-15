import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/src/lib/auth";
import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";

export default async function AdminSettings() {
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
              <h1 className="text-2xl font-light tracking-tight">Настройки</h1>
              <p className="text-xs text-neutral-400">Конфигурация магазина и Telegram-бота</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-white/10 bg-neutral-950/50 p-12 text-center">
          <Settings className="mx-auto mb-4 h-12 w-12 text-neutral-600" />
          <h2 className="text-lg font-light">Настройки магазина</h2>
          <p className="mt-2 text-sm text-neutral-400">
            Управление Telegram-ботом, ценами, доставкой и другими параметрами.
          </p>
        </div>
      </main>
    </div>
  );
}
