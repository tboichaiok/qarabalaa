"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import { addLookBookImageAction } from "@/src/actions/lookbook";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

const initialState = { success: false, message: "", error: "" };

export default function NewLookBookImagePage() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(addLookBookImageAction, initialState);

  useEffect(() => {
    if (state.success) {
      router.push("/admin/lookbook");
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <header className="border-b border-white/10 px-6 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/lookbook" className="text-neutral-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-light tracking-tight">Новое изображение</h1>
              <p className="text-xs text-neutral-400">Добавление изображения в Look Book</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-white/10 bg-neutral-950/50 p-8">
          <Plus className="mx-auto mb-4 h-12 w-12 text-neutral-600" />
          <h2 className="text-lg font-light text-center">Форма добавления изображения</h2>
          <p className="mt-2 text-sm text-neutral-400 text-center">
            Заполните данные об изображении для Look Book.
          </p>

          {state.success && (
            <div className="mb-6 rounded bg-emerald-500/20 border border-emerald-500/50 px-4 py-3 text-sm text-emerald-400">
              {state.message || "Изображение успешно добавлено"}
            </div>
          )}
          {state.error && (
            <div className="mb-6 rounded bg-red-500/20 border border-red-500/50 px-4 py-3 text-sm text-red-400">
              {state.error}
            </div>
          )}

          <form action={formAction} className="mt-8 space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-neutral-400 mb-2 font-medium">
                Заголовок
              </label>
              <input
                type="text"
                name="title"
                placeholder="Название образа (необязательно)"
                className="w-full bg-neutral-800 border border-white/10 rounded p-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-neutral-400 mb-2 font-medium">
                Alt-текст
              </label>
              <input
                type="text"
                name="altText"
                placeholder="Описание для доступности (необязательно)"
                className="w-full bg-neutral-800 border border-white/10 rounded p-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-neutral-400 mb-2 font-medium">
                URL изображения <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="imageUrl"
                placeholder="https://example.com/image.jpg"
                required
                className="w-full bg-neutral-800 border border-white/10 rounded p-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={pending}
                className="flex-1 bg-white py-3 text-xs uppercase tracking-[0.25em] font-semibold text-black hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pending ? "Создание..." : "Добавить изображение"}
              </button>
              <Link
                href="/admin/lookbook"
                className="inline-flex items-center justify-center px-6 py-3 bg-neutral-800 text-neutral-400 text-xs uppercase tracking-[0.25em] font-medium hover:text-white transition-colors"
              >
                Отмена
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}