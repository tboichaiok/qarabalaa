"use server";

import { prisma } from "@/src/lib/prisma";
import { ProductVariant } from "@prisma/client";
import { sendTelegramOrderNotification } from "@/src/lib/telegram";

export interface CreateOrderItemInput {
  variantId: string;
  quantity: number;
}

export interface CreateOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingNotes?: string;
  userId?: string;
  items: CreateOrderItemInput[];
}

export async function createOrderAction(data: CreateOrderInput) {
  try {
    if (!data.items || data.items.length === 0) {
      return { success: false, error: "Корзина пуста" };
    }

    if (
      !data.customerName.trim() ||
      !data.customerEmail.trim() ||
      !data.customerPhone.trim() ||
      !data.shippingAddress.trim()
    ) {
      return { success: false, error: "Пожалуйста, заполните все обязательные поля" };
    }

    const variantIds = data.items.map((i) => i.variantId);
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: true },
    });

    if (variants.length !== data.items.length) {
      return { success: false, error: "Некоторые выбранные позиции больше не доступны" };
    }

    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of data.items) {
      // Явно указали тип v: ProductVariant, чтобы TypeScript не ругался
      const variant = variants.find((v: ProductVariant) => v.id === item.variantId);
      if (!variant) {
        return { success: false, error: "Товар не найден" };
      }

      if (variant.stockQuantity < item.quantity) {
        return {
          success: false,
          error: `Недостаточно остатка для "${variant.product.title}" (${variant.color}, ${variant.size}). Доступно: ${variant.stockQuantity} шт.`,
        };
      }

      const itemPrice = variant.product.price;
      totalAmount += itemPrice * item.quantity;

      orderItemsData.push({
        productVariantId: variant.id,
        title: variant.product.title,
        color: variant.color,
        size: variant.size,
        quantity: item.quantity,
        price: itemPrice,
      });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `QB-${new Date().getFullYear()}-${randomSuffix}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: data.userId || null,
        customerName: data.customerName.trim(),
        customerEmail: data.customerEmail.trim(),
        customerPhone: data.customerPhone.trim(),
        shippingAddress: data.shippingAddress.trim(),
        shippingNotes: data.shippingNotes?.trim() || null,
        totalAmount,
        status: "PENDING",
        paymentMethod: "SIMULATED_CARD",
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    return {
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
    };
  } catch (error) {
    console.error("[createOrderAction error]", error);
    return { success: false, error: "Ошибка при оформлении заказа. Попробуйте снова." };
  }
}

export async function getOrderByIdAction(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            productVariant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return { success: false, error: "Заказ не найден" };
    }

    return { success: true, order };
  } catch (error) {
    console.error("[getOrderByIdAction error]", error);
    return { success: false, error: "Не удалось загрузить данные заказа" };
  }
}

export async function confirmPaymentAction(orderId: string) {
  try {
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!existingOrder) {
      return { success: false, error: "Заказ не найден" };
    }

    if (existingOrder.status === "PAID") {
      return { success: true, message: "Заказ уже был успешно оплачен", orderNumber: existingOrder.orderNumber };
    }

    await prisma.$transaction(async (tx) => {
      for (const item of existingOrder.items) {
        await tx.productVariant.update({
          where: { id: item.productVariantId },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      await tx.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          paidAt: new Date(),
        },
      });
    });

    await sendTelegramOrderNotification(orderId);

    return {
      success: true,
      orderNumber: existingOrder.orderNumber,
    };
  } catch (error) {
    console.error("[confirmPaymentAction error]", error);
    return { success: false, error: "Ошибка при проведении оплаты" };
  }
}