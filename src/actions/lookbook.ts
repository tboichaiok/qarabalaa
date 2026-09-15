"use server";

import { prisma } from "@/src/lib/prisma";
import { LookBookImage } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";

export type LookBookFormState = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function getLookBookImagesAction() {
  try {
    const images = await prisma.lookBookImage.findMany({
      orderBy: { order: "asc" },
    });
    return { success: true, images };
  } catch (error) {
    console.error("[getLookBookImagesAction error]", error);
    return { success: false, error: "Не удалось загрузить Look Book" };
  }
}

export async function addLookBookImageAction(
  _previousState: LookBookFormState,
  formData: FormData
): Promise<LookBookFormState> {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return { success: false, error: "Доступ запрещён" };
  }

  try {
    const title = String(formData.get("title") ?? "").trim();
    const altText = String(formData.get("altText") ?? "").trim();
    const imageUrl = String(formData.get("imageUrl") ?? "").trim();

    if (!imageUrl) {
      return { success: false, error: "Укажите URL изображения" };
    }

    const maxOrder = await prisma.lookBookImage.count();
    const order = maxOrder;

    await prisma.lookBookImage.create({
      data: {
        title: title || undefined,
        altText: altText || undefined,
        imageUrl,
        order,
        isActive: true,
      },
    });

    revalidatePath("/lookbook");
    revalidatePath("/admin/lookbook");

    return { success: true, message: "Изображение добавлено" };
  } catch (error) {
    console.error("[addLookBookImageAction error]", error);
    return { success: false, error: "Не удалось добавить изображение" };
  }
}

export async function updateLookBookImageOrderAction(
  _previousState: LookBookFormState,
  formData: FormData
): Promise<LookBookFormState> {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return { success: false, error: "Доступ запрещён" };
  }

  try {
    const ids = String(formData.get("ids") ?? "").split(",").filter(Boolean);
    for (let i = 0; i < ids.length; i++) {
      await prisma.lookBookImage.update({
        where: { id: ids[i] },
        data: { order: i },
      });
    }

    revalidatePath("/lookbook");
    revalidatePath("/admin/lookbook");

    return { success: true, message: "Порядок обновлён" };
  } catch (error) {
    console.error("[updateLookBookImageOrderAction error]", error);
    return { success: false, error: "Не удалось обновить порядок" };
  }
}

export async function toggleLookBookImageAction(
  _previousState: LookBookFormState,
  formData: FormData
): Promise<LookBookFormState> {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return { success: false, error: "Доступ запрещён" };
  }

  try {
    const id = String(formData.get("id") ?? "");
    const current = await prisma.lookBookImage.findUnique({ where: { id } });
    if (current) {
      await prisma.lookBookImage.update({
        where: { id },
        data: { isActive: !current.isActive },
      });
    }

    revalidatePath("/lookbook");
    revalidatePath("/admin/lookbook");

    return { success: true, message: "Статус обновлён" };
  } catch (error) {
    console.error("[toggleLookBookImageAction error]", error);
    return { success: false, error: "Не удалось обновить статус" };
  }
}

export async function deleteLookBookImageAction(
  _previousState: LookBookFormState,
  formData: FormData
): Promise<LookBookFormState> {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return { success: false, error: "Доступ запрещён" };
  }

  try {
    const id = String(formData.get("id") ?? "");
    await prisma.lookBookImage.delete({ where: { id } });

    revalidatePath("/lookbook");
    revalidatePath("/admin/lookbook");

    return { success: true, message: "Изображение удалено" };
  } catch (error) {
    console.error("[deleteLookBookImageAction error]", error);
    return { success: false, error: "Не удалось удалить изображение" };
  }
}
