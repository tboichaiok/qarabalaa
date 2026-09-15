"use client";

import { useState } from "react";
import Link from "next/link";

export interface ProductCardProps {
  id: string;
  title: string;
  slug: string;
  price: number;
  category: string;
  images: string[];
  variants: Array<{
    id: string;
    color: string;
    colorHex: string | null;
    size: string;
    stockQuantity: number;
  }>;
  totalStock: number;
}

export function ProductCard({
  title,
  slug,
  price,
  category,
  images,
  variants,
  totalStock,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const primaryImage =
    images[0] ||
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop";
  const secondaryImage = images[1] || primaryImage;

  // Unique colors
  const uniqueColors = Array.from(
    new Set(variants.map((v) => v.color))
  ).map((colorName) => {
    const variant = variants.find((v) => v.color === colorName);
    return { name: colorName, hex: variant?.colorHex || "#111111" };
  });

  const isSoldOut = totalStock <= 0;

  return (
    <div
      className="group relative flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link
        href={`/product/${slug}`}
        className="relative aspect-3/4 w-full overflow-hidden bg-neutral-100"
      >
        <img
          src={isHovered && secondaryImage ? secondaryImage : primaryImage}
          alt={title}
          className="h-full w-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isSoldOut ? (
            <span className="bg-black/80 backdrop-blur-xs text-white text-[9px] uppercase tracking-[0.2em] font-semibold px-2.5 py-1">
              Распродано
            </span>
          ) : totalStock <= 5 ? (
            <span className="bg-neutral-900/80 backdrop-blur-xs text-amber-300 text-[9px] uppercase tracking-[0.2em] font-semibold px-2.5 py-1">
              Мало на складе
            </span>
          ) : null}
        </div>
      </Link>

      {/* Product Details */}
      <div className="mt-3.5 flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-medium">
            {category}
          </span>
          {/* Color preview dots */}
          <div className="flex items-center gap-1">
            {uniqueColors.map((col) => (
              <span
                key={col.name}
                title={col.name}
                className="w-2.5 h-2.5 rounded-full border border-neutral-300 inline-block"
                style={{ backgroundColor: col.hex }}
              />
            ))}
          </div>
        </div>

        <Link
          href={`/product/${slug}`}
          className="text-xs font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-1"
        >
          {title}
        </Link>

        <p className="text-xs font-semibold tabular-kzt text-neutral-900 pt-0.5">
          {new Intl.NumberFormat("ru-KZ").format(price)} ₸
        </p>
      </div>
    </div>
  );
}
