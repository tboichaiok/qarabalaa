/*
ProductDetailClient

Extracted from app/product/[slug]/page.tsx so that the ProductDetail function becomes a client component.
This fix addresses Next.js 16 App Router constraint: async client components are invalid.
The server component now fetches data and passes it to a client component that handles all interactions.
*/

"use client";

import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/src/components/product/ProductCard";
import { SizeGuideModal } from "@/src/components/product/SizeGuideModal";
import { useCart } from "@/src/context/CartContext";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Minus,
  Plus,
  X,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

interface ProductDetailClientProps {
  product: any;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addedMessage, setAddedMessage] = useState("");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const selectedVariantId = selectedVariant?.id;
  const selectedStock = selectedVariant?.stockQuantity ?? 0;
  const canAdd = Boolean(selectedVariantId && selectedStock > 0 && quantity > 0);

  if (!selectedVariant) {
    const firstAvailable = product.variants.find((variant: any) => variant.stockQuantity > 0);
    const firstVariant = product.variants[0];
    setSelectedVariant(firstAvailable || firstVariant);
  }

  const selectedColor = selectedVariant?.color || product.variants[0]?.color;
  const selectedColorHex =
    selectedVariant?.colorHex || product.variants[0]?.colorHex || "#111111";

  const uniqueColors = Array.from(
    new Map(
      product.variants.map((variant: any) => [
        variant.color,
        { name: variant.color, hex: variant.colorHex || "#111111" },
      ])
    ).values()
  );

  const availableSizes = product.variants
    .filter((variant: any) => variant.stockQuantity > 0)
    .map((variant: any) => variant.size);

  const handleVariantChange = (variant: any) => {
    setSelectedVariant(variant);
    setQuantity(1);
    setAddedMessage("");
  };

  const handleAddToCart = async () => {
    if (!canAdd || isAdding) return;

    setIsAdding(true);
    setAddedMessage("");

    try {
      addItem(
        {
          variantId: selectedVariant.id,
          productId: product.id,
          slug: product.slug,
          title: product.title,
          image: product.images[activeImageIndex] || product.images[0],
          color: selectedVariant.color,
          size: selectedVariant.size,
          price: product.price,
          maxStock: selectedVariant.stockQuantity,
        },
        quantity
      );
      setAddedMessage("Товар добавлен в корзину");
    } catch (error) {
      console.error("Failed to add item to cart", error);
      setAddedMessage("Не удалось добавить товар");
    } finally {
      setIsAdding(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection((current) => (current === section ? null : section));
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:px-16">
        <nav className="mb-8 flex items-center gap-2 text-xs text-neutral-400">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-neutral-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Назад к каталогу
          </Link>
          <span>•</span>
          <span>{product.category}</span>
          <span>•</span>
          <span className="text-neutral-900">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(380px,0.9fr)]">
          {/* Gallery */}
          <div className="min-h-[620px]">
            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
              <Image
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.title}
                fill
                className="object-cover object-center"
              />
              <span className="absolute bottom-4 left-4 bg-black/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur-xs">
                {String(activeImageIndex + 1).padStart(2, "0")} / {product.images.length}
              </span>
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImageIndex(
                        (activeImageIndex - 1 + product.images.length) % product.images.length
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-neutral-900 shadow-sm hover:bg-white transition-colors"
                    aria-label="Предыдущее изображение"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setActiveImageIndex((activeImageIndex + 1) % product.images.length)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-neutral-900 shadow-sm hover:bg-white transition-colors"
                    aria-label="Следующее изображение"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            <div className="mt-3 grid grid-cols-4 gap-3">
              {product.images.map((image: string, index: number) => (
                <button
                  key={`${image}-${index}`}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative aspect-[4/5] overflow-hidden transition-all duration-300 ${
                    activeImageIndex === index
                      ? "ring-2 ring-neutral-900 ring-offset-2 ring-offset-white"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} — ракурс ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="flex flex-col py-2">
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-medium">
                {product.category}
              </span>
              {product.isFeatured && (
                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-emerald-700">
                  <Sparkles className="w-3 h-3" />
                  Избранное
                </span>
              )}
            </div>

            <h1 className="mt-3 text-3xl font-light leading-tight tracking-[-0.035em] text-neutral-950 sm:text-4xl">
              {product.title}
            </h1>
            <p className="mt-4 text-base font-semibold tabular-kzt text-neutral-900">
              {new Intl.NumberFormat("ru-KZ").format(product.price)} ₸
            </p>

            <p className="mt-6 max-w-lg text-sm leading-7 text-neutral-600 font-light">
              {product.description}
            </p>

            <div className="mt-8 flex flex-col gap-6 border-t border-neutral-200 pt-6">
              {/* Color selection */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-900">
                    Цвет
                  </span>
                  <span className="text-xs text-neutral-400">{selectedColor}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-3">
                  {uniqueColors.map((color: any) => (
                    <button
                      key={color.name}
                      onClick={() => {
                        const variant = product.variants.find(
                          (candidate: any) =>
                            candidate.color === color.name &&
                            candidate.stockQuantity > 0
                        );
                        if (variant) handleVariantChange(variant);
                      }}
                      className={`group relative flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${
                        selectedColor === color.name ? "ring-2 ring-neutral-900 ring-offset-2 ring-offset-white" : ""
                      }`}
                      aria-label={`Цвет ${color.name}`}
                      title={color.name}
                    >
                      <span
                        className="h-6 w-6 rounded-full border border-black/10 shadow-sm transition-transform group-hover:scale-105"
                        style={{ backgroundColor: color.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Size selection */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-900">
                    Размер (EU)
                  </span>
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="inline-flex items-center gap-1 text-xs text-neutral-500 underline underline-offset-4 transition-colors hover:text-neutral-900"
                  >
                    Таблица размеров
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {["XS", "S", "M", "L", "XL", "XXL"].map((size) => {
                    const variant = product.variants.find(
                      (candidate: any) => candidate.size === size
                    );
                    const hasStock = Boolean(variant && variant.stockQuantity > 0);
                    return (
                      <button
                        key={size}
                        onClick={() => {
                          if (variant) handleVariantChange(variant);
                        }}
                        disabled={!hasStock}
                        className={`h-11 border text-xs transition-all duration-200 ${
                          selectedVariant?.size === size
                            ? "border-neutral-900 bg-neutral-900 text-white"
                            : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-900"
                        } ${
                          !hasStock ? "cursor-not-allowed bg-neutral-100 text-neutral-400" : ""
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-[11px] text-neutral-400">
                  {selectedStock > 0
                    ? `В наличии: ${selectedStock} шт.`
                    : "Этот размер распродан"}
                </p>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex items-center border border-neutral-200">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-neutral-500 hover:text-neutral-900 transition-colors"
                    aria-label="Уменьшить количество"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium tabular-nums">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(Math.max(selectedStock, 1), quantity + 1))}
                    disabled={!selectedStock}
                    className="p-3 text-neutral-500 hover:text-neutral-900 transition-colors disabled:opacity-30"
                    aria-label="Увеличить количество"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!canAdd || isAdding}
                  className={`group flex flex-1 items-center justify-center gap-2 px-6 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 ${
                    canAdd
                      ? "bg-neutral-900 text-white hover:bg-neutral-800 hover:gap-3"
                      : "cursor-not-allowed bg-neutral-200 text-neutral-400"
                  }`}
                >
                  {isAdding ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Добавление...
                    </>
                  ) : selectedStock === 0 ? (
                    <>
                      <X className="w-3.5 h-3.5" />
                      Распродано
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                      Добавить в корзину
                    </>
                  )}
                </button>
              </div>

              {addedMessage && (
                <div className="flex items-center gap-2 rounded bg-emerald-50 p-3 text-xs text-emerald-800">
                  <Check className="w-3.5 h-3.5" />
                  {addedMessage}
                </div>
              )}

              {/* Service details */}
              <div className="grid grid-cols-1 gap-3 border-t border-neutral-200 pt-6 text-xs text-neutral-500 sm:grid-cols-3">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-neutral-400" />
                  <span>
                    <strong className="block text-neutral-900">Безопасная оплата</strong>
                    Тестовый режим оплаты для демонстрации
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Truck className="mt-0.5 h-4 w-4 text-neutral-400" />
                  <span>
                    <strong className="block text-neutral-900">Доставка по Казахстану</strong>
                    Срок доставки — 2–5 рабочих дней
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <RotateCcw className="mt-0.5 h-4 w-4 text-neutral-400" />
                  <span>
                    <strong className="block text-neutral-900">Возврат 14 дней</strong>
                    При сохранении товарного вида
                  </span>
                </div>
              </div>
            </div>

            {/* Accordion */}
            <div className="mt-8 border-t border-neutral-200">
              {[
                ["Состав и уход", "Изделия изготавливаются из натуральных материалов премиальной категории. Стирайте отдельно при температуре 30°C, не отбеливайте, сушите естественным способом."],
                ["Доставка и возврат", "Доставка по Алматы и Астане — 1–2 рабочих дня, по всему Казахстану — 2–5 рабочих дней. Возможен возврат в течение 14 дней."],
              ].map(([title, body]) => {
                const isOpen = expandedSection === title;
                return (
                  <div key={title} className="border-b border-neutral-200">
                    <button
                      onClick={() => toggleSection(title)}
                      className="flex w-full items-center justify-between py-4 text-left text-xs uppercase tracking-[0.2em] font-semibold text-neutral-900"
                    >
                      {title}
                      <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <p className="pb-5 text-xs leading-6 text-neutral-500 font-light">{body}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Related Products */}
          <section className="mt-20">
            <div className="mb-8 flex items-end justify-between border-b border-neutral-200 pb-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-400 font-semibold">
                  С этим образом
                </p>
                <h2 className="mt-2 text-2xl font-light tracking-tight text-neutral-950">
                  Похожие позиции
                </h2>
              </div>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] font-semibold text-neutral-900 hover:text-neutral-500 transition-colors"
              >
                Все товары <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {product.id && (
                <>
                  <ProductCard
                    id="related-1"
                    title="Худи Heavyweight Fleece 480 GSM"
                    slug="heavyweight-fleece-hoodie"
                    price={48000}
                    category="Худи и Свитшоты"
                    images={["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop"]}
                    variants={[{ id: "1", color: "Chalk White", colorHex: "#F4F4F5", size: "M", stockQuantity: 8 }]}
                    totalStock={8}
                  />
                  <ProductCard
                    id="related-2"
                    title="Брюки прямого кроя с защипами"
                    slug="tailored-pleated-trousers"
                    price={54000}
                    category="Брюки"
                    images={["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop"]}
                    variants={[{ id: "2", color: "Obsidian Black", colorHex: "#09090B", size: "M", stockQuantity: 6 }]}
                    totalStock={6}
                  />
                </>
              )}
            </div>
          </section>
        </div>

        <SizeGuideModal
          isOpen={sizeGuideOpen}
          onClose={() => setSizeGuideOpen(false)}
          category={product.category}
        />
      </div>
    </>
  );
}