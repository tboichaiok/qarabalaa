"use server";

import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";

export interface GetProductsFilter {
  category?: string;
  size?: string;
  color?: string;
  sortBy?: "newest" | "price-asc" | "price-desc";
  featuredOnly?: boolean;
}

export async function getProductsAction(filter?: GetProductsFilter) {
  try {
    const whereClause: any = {};

    if (filter?.category && filter.category !== "Все") {
      whereClause.category = filter.category;
    }

    if (filter?.featuredOnly) {
      whereClause.isFeatured = true;
    }

    if (filter?.size || filter?.color) {
      whereClause.variants = {
        some: {
          ...(filter.size && filter.size !== "Все" ? { size: filter.size } : {}),
          ...(filter.color && filter.color !== "Все" ? { color: filter.color } : {}),
        },
      };
    }

    let orderBy: any = { createdAt: "desc" };
    if (filter?.sortBy === "price-asc") {
      orderBy = { price: "asc" };
    } else if (filter?.sortBy === "price-desc") {
      orderBy = { price: "desc" };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        variants: true,
      },
      orderBy,
    });

    const parsedProducts = products.map((p) => ({
      ...p,
      images: JSON.parse(p.images || "[]") as string[],
      totalStock: p.variants.reduce((acc: number, v: { stockQuantity: number }) => acc + v.stockQuantity, 0),
    }));

    return { success: true, products: parsedProducts };
  } catch (error) {
    console.error("[getProductsAction error]", error);
    return { success: false, error: "Не удалось загрузить товары" };
  }
}

export async function getProductBySlugAction(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        variants: true,
      },
    });

    if (!product) {
      return { success: false, error: "Товар не найден" };
    }

    return {
      success: true,
      product: {
        ...product,
        images: JSON.parse(product.images || "[]") as string[],
        totalStock: product.variants.reduce((acc: number, v: any) => acc + v.stockQuantity, 0),
      },
    };
  } catch (error) {
    console.error("[getProductBySlugAction error]", error);
    return { success: false, error: "Ошибка при загрузке товара" };
  }
}

export async function getCategoriesAction() {
  try {
    const categories = await prisma.product.findMany({
      select: { category: true },
      distinct: ["category"],
    });

    return {
      success: true,
      categories: ["Все", ...categories.map((c: any) => c.category)],
    };
  } catch (error) {
    console.error("[getCategoriesAction error]", error);
    return { success: false, error: "Не удалось загрузить категории" };
  }
}

export type CreateProductFormState = {
  success: boolean;
  message?: string;
  error?: string;
  productId?: string;
  slug?: string;
};

const parseList = (value: FormDataEntryValue | null, fallback: string) =>
  String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean) || [fallback];

export async function createProductAction(
  _previousState: CreateProductFormState,
  formData: FormData
): Promise<CreateProductFormState> {
  try {
    const title = String(formData.get("title") ?? "").trim();
    const slugInput = String(formData.get("slug") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const priceValue = Number(formData.get("price"));
    const category = String(formData.get("category") ?? "").trim();
    const colors = parseList(formData.get("colors"), "Черный");
    const colorHexes = parseList(formData.get("colorHexes"), "#09090B");
    const sizes = parseList(formData.get("sizes"), "M");
    const stockQuantity = Math.max(0, Math.floor(Number(formData.get("stockQuantity") ?? 0)));
    const isFeatured = formData.get("isFeatured") === "on";
    const defaultImage =
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop";
    const images = parseList(formData.get("images"), defaultImage);

    const errors: Record<string, string> = {};
    if (!title) errors.title = "Укажите название товара";
    if (!description) errors.description = "Укажите описание товара";
    if (!category) errors.category = "Укажите категорию";
    if (!Number.isFinite(priceValue) || priceValue <= 0 || !Number.isInteger(priceValue)) {
      errors.price = "Укажите корректную цену";
    }
    if (colors.length === 0) errors.colors = "Укажите хотя бы один цвет";
    if (sizes.length === 0) errors.sizes = "Укажите хотя бы один размер";
    if (Object.keys(errors).length > 0) {
      return { success: false, error: "Проверьте заполнение формы", message: Object.values(errors)[0] };
    }

    const slug = slugInput || `product-${Date.now()}`;
    const variants = sizes.map((size) => {
      const colorIndex = Math.min(colors.length - 1, sizes.indexOf(size));
      return {
        color: colors[colorIndex],
        colorHex: colorHexes[colorIndex] || colorHexes[0] || "#111111",
        size,
        stockQuantity,
      };
    });

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        price: priceValue,
        category,
        isFeatured,
        images: JSON.stringify(images),
        variants: {
          create: variants,
        },
      },
    });

    revalidatePath("/catalog");
    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Товар успешно добавлен",
      productId: product.id,
      slug: product.slug,
    };
  } catch (error) {
    console.error("[createProductAction error]", error);
    return {
      success: false,
      error: "Не удалось добавить товар. Проверьте данные и попробуйте снова.",
    };
  }
}
