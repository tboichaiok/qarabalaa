import { prisma } from "@/src/lib/prisma";

const TELEGRAM_BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN ||
  "8227293653:AAEKNZbML_-ALwOU1iSFjqwzkKlpIGnISb4";
const TELEGRAM_ADMIN_CHAT_ID =
  process.env.TELEGRAM_ADMIN_CHAT_ID || "1346451594";

export async function sendTelegramOrderNotification(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
      },
    });

    if (!order) {
      console.error(`[Telegram Notification] Order ${orderId} not found`);
      return { success: false, error: "Order not found" };
    }

    const formattedDate = new Intl.DateTimeFormat("ru-RU", {
      timeZone: "Asia/Almaty",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(order.paidAt || order.createdAt);

    const formattedTotal = new Intl.NumberFormat("ru-KZ").format(
      order.totalAmount
    );

    // Добавили явную типизацию для item и idx
    const itemsText = order.items
      .map((item: { title: string; color: string; size: string; quantity: number; price: number }, idx: number) => {
        const itemTotal = new Intl.NumberFormat("ru-KZ").format(
          item.price * item.quantity
        );
        return `${idx + 1}. *${item.title}*\n   ▫️ Цвет: _${item.color}_ | Размер: *${item.size}* (EU)\n   ▫️ Кол-во: ${item.quantity} шт. × ${new Intl.NumberFormat("ru-KZ").format(item.price)} ₸ = *${itemTotal} ₸*`;
      })
      .join("\n\n");

    const message = `⚡️ *НОВЫЙ ОПЛАЧЕННЫЙ ЗАКАЗ — QARA BALA*\n\n` +
      `📦 *Заказ:* \`#${order.orderNumber}\`\n` +
      `💰 *Сумма к оплате:* *${formattedTotal} ₸*\n` +
      `💳 *Статус:* ✅ *ОПЛАЧЕН*\n` +
      `🕒 *Время:* ${formattedDate} (Алматы)\n\n` +
      `👤 *Информация о клиенте:*\n` +
      `• *Имя:* ${order.customerName}\n` +
      `• *Телефон:* \`${order.customerPhone}\`\n` +
      `• *Email:* ${order.customerEmail}\n` +
      `📍 *Адрес доставки:*\n${order.shippingAddress}\n` +
      (order.shippingNotes ? `💬 *Комментарий:* _${order.shippingNotes}_\n` : "") +
      `\n🛍 *Состав заказа (${order.items.length} поз.):*\n\n${itemsText}\n\n` +
      `🔗 [Открыть панель управления](http://localhost:3000/admin/orders)`;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_ADMIN_CHAT_ID,
        text: message,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });

    const data = await response.json();
    if (!data.ok) {
      console.error("[Telegram Notification Error]", data);
      return { success: false, error: data.description };
    }

    console.log(`[Telegram Notification Sent] Order #${order.orderNumber} successfully sent to Admin.`);
    return { success: true };
  } catch (error) {
    console.error("[Telegram Notification Exception]", error);
    return { success: false, error: (error as Error).message };
  }
}