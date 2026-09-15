import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/src/lib/auth";
import { getLookBookImagesAction } from "@/src/actions/lookbook";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import LookBookImageList from "./LookBookImageList";

export default async function AdminLookBook() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/auth/signin");
  }

  const result = await getLookBookImagesAction();
  const images = result.success ? (result.images || []) : [];

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <header className="border-b border-white/10 px-6 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <Link
                href="/admin"
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="Вернуться в панель администратора"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-light tracking-tight">Look Book</h1>
                <p className="text-xs text-neutral-400">Управление изображениями Look Book</p>
              </div>
            </div>
            <Link
              href="/admin/lookbook/new"
              className="inline-flex shrink-0 items-center gap-2 bg-white px-4 py-2.5 text-xs uppercase tracking-[0.25em] font-semibold text-black hover:bg-neutral-200 transition-colors"
            >
              <Plus className="w-4 h-4" /> Добавить изображение
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {!result.success ? (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-6 text-sm text-red-300">
            {result.error || "Не удалось загрузить изображения"}
          </div>
        ) : (
          <LookBookImageList images={images} />
        )}
      </main>
    </div>
  );
}
