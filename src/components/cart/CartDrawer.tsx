"use client";

import { useCart } from "@/src/context/CartContext";
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    setIsDrawerOpen,
    removeItem,
    updateQuantity,
    totalAmount,
    totalCount,
    freeShippingThreshold,
    freeShippingRemaining,
  } = useCart();
  const router = useRouter();

  if (!isDrawerOpen) return null;

  const progressPercent = Math.min(
    100,
    ((freeShippingThreshold - freeShippingRemaining) / freeShippingThreshold) * 100
  );

  const handleCheckout = () => {
    setIsDrawerOpen(false);
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Slideover Panel */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-[0.25em] font-medium text-neutral-900">
              Корзина
            </span>
            <span className="text-xs text-neutral-400">({totalCount})</span>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-1 text-neutral-400 hover:text-neutral-900 transition-colors"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-neutral-50 px-6 py-3 border-b border-neutral-100 text-xs">
          <div className="flex justify-between text-[11px] text-neutral-600 mb-1.5">
            {freeShippingRemaining === 0 ? (
              <span className="text-emerald-700 font-medium">
                Бесплатная доставка активирована!
              </span>
            ) : (
              <span>
                До бесплатной доставки:{" "}
                <strong className="text-neutral-900">
                  {new Intl.NumberFormat("ru-KZ").format(freeShippingRemaining)} ₸
                </strong>
              </span>
            )}
            <span>от {new Intl.NumberFormat("ru-KZ").format(freeShippingThreshold)} ₸</span>
          </div>
          <div className="h-1 w-full bg-neutral-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                freeShippingRemaining === 0 ? "bg-emerald-600" : "bg-neutral-900"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-neutral-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-neutral-900">Ваша корзина пуста</p>
              <p className="mt-1 text-xs text-neutral-500 max-w-xs">
                Откройте для себя новые поступления и выберите премиальные вещи QARA BALA
              </p>
              <Link
                href="/catalog"
                onClick={() => setIsDrawerOpen(false)}
                className="mt-6 inline-flex items-center justify-center px-6 py-2.5 bg-neutral-900 text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-neutral-800 transition-colors"
              >
                В каталог
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.variantId} className="flex gap-4 py-4 group">
                <Link
                  href={`/product/${item.slug}`}
                  onClick={() => setIsDrawerOpen(false)}
                  className="relative w-20 h-26 bg-neutral-100 shrink-0 overflow-hidden"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={() => setIsDrawerOpen(false)}
                        className="text-xs font-medium text-neutral-900 hover:underline line-clamp-1"
                      >
                        {item.title}
                      </Link>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="text-neutral-400 hover:text-red-600 transition-colors p-0.5"
                        title="Удалить"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-[11px] text-neutral-500">
                      <span>{item.color}</span>
                      <span>•</span>
                      <span className="font-medium text-neutral-800">
                        Размер: {item.size}
                      </span>
                    </div>

                    <p className="mt-1.5 text-xs font-semibold tabular-kzt text-neutral-900">
                      {new Intl.NumberFormat("ru-KZ").format(item.price)} ₸
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-neutral-200">
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="p-1 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
                        aria-label="Уменьшить"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-medium text-neutral-900 tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        className="p-1 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-colors disabled:opacity-30"
                        aria-label="Увеличить"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    {item.quantity >= item.maxStock && (
                      <span className="text-[10px] text-amber-600">Макс. остаток</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {items.length > 0 && (
          <div className="border-t border-neutral-100 px-6 py-5 bg-neutral-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                Итого к оплате
              </span>
              <span className="text-base font-bold tabular-kzt text-neutral-900">
                {new Intl.NumberFormat("ru-KZ").format(totalAmount)} ₸
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 bg-neutral-950 py-3.5 text-xs uppercase tracking-[0.25em] font-semibold text-white hover:bg-neutral-800 transition-colors"
            >
              <span>Оформить заказ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <p className="mt-3 text-center text-[10px] text-neutral-400">
              Безопасная оплата • Доставка по всему Казахстану
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
