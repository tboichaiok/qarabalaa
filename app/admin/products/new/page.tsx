"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import { createProductAction } from "@/src/actions/products";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

const initialState = { success: false, message: "", error: "" };

export default function NewProductPage() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createProductAction, initialState);

  useEffect(() => {
    if (state.success) {
      router.push("/admin/products");
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <header className="border-b border-white/10 px-6 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/products" className="text-neutral-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-light tracking-tight">Новый товар</h1>
              <p className="text-xs text-neutral-400">Добавление позиции в каталог</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-white/10 bg-neutral-950/50 p-8">
          <Plus className="mx-auto mb-4 h-12 w-12 text-neutral-600" />
          <h2 className="text-lg font-light text-center">Форма создания товара</h2>
          <p className="mt-2 text-sm text-neutral-400 text-center">
            Заполните данные о продукте, цветах, размерах и начальных остатках.
          </p>

          {state.success && (
            <div className="mb-6 rounded bg-emerald-500/20 border border-emerald-500/50 px-4 py-3 text-sm text-emerald-400">
              {state.message || "Товар успешно добавлен"}
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
                Название
              </label>
              <input
                type="text"
                name="title"
                placeholder="Название товара"
                required
                className="w-full bg-neutral-800 border border-white/10 rounded p-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-neutral-400 mb-2 font-medium">
                Slug
              </label>
              <input
                type="text"
                name="slug"
                placeholder="slug-for-url"
                className="w-full bg-neutral-800 border border-white/10 rounded p-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-neutral-400 mb-2 font-medium">
                Описание
              </label>
              <textarea
                name="description"
                placeholder="Описание продукта..."
                rows={3}
                required
                className="w-full bg-neutral-800 border border-white/10 rounded p-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-neutral-400 mb-2 font-medium">
                Цена (₸)
              </label>
              <input
                type="number"
                name="price"
                placeholder="45000"
                required
                min="1"
                className="w-full bg-neutral-800 border border-white/10 rounded p-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-neutral-400 mb-2 font-medium">
                Категория
              </label>
              <input
                type="text"
                name="category"
                placeholder="Верхняя одежда"
                required
                className="w-full bg-neutral-800 border border-white/10 rounded p-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-neutral-400 mb-2 font-medium">
                Цвета (через запятую)
              </label>
              <input
                type="text"
                name="colors"
                placeholder="Черный, Белый, Серый"
                defaultValue="Черный"
                className="w-full bg-neutral-800 border border-white/10 rounded p-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-neutral-400 mb-2 font-medium">
                Hex-коды цветов (через запятую)
              </label>
              <input
                type="text"
                name="colorHexes"
                placeholder="#09090B, #FFFFFF, #888888"
                defaultValue="#09090B"
                className="w-full bg-neutral-800 border border-white/10 rounded p-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-neutral-400 mb-2 font-medium">
                Размеры (через запятую)
              </label>
              <input
                type="text"
                name="sizes"
                placeholder="S, M, L"
                defaultValue="M"
                className="w-full bg-neutral-800 border border-white/10 rounded p-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-neutral-400 mb-2 font-medium">
                Начальный остаток
              </label>
              <input
                type="number"
                name="stockQuantity"
                placeholder="10"
                defaultValue="0"
                min="0"
                className="w-full bg-neutral-800 border border-white/10 rounded p-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-neutral-400 mb-2 font-medium">
                Изображения (URL через запятую)
              </label>
              <input
                type="text"
                name="images"
                placeholder="https://..."
                defaultValue="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop"
                className="w-full bg-neutral-800 border border-white/10 rounded p-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-2 text-sm text-neutral-400 cursor-pointer">
                <input type="checkbox" name="isFeatured" className="rounded accent-black" />
                В избранном
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={pending}
                className="flex-1 bg-white py-3 text-xs uppercase tracking-[0.25em] font-semibold text-black hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pending ? "Создание..." : "Создать товар"}
              </button>
              <Link
                href="/admin/products"
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
