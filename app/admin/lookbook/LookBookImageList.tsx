"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { LookBookImage } from "@prisma/client";
import { Eye, EyeOff, GripVertical, Image as ImageIcon, Trash2 } from "lucide-react";
import {
  deleteLookBookImageAction,
  toggleLookBookImageAction,
  updateLookBookImageOrderAction,
  type LookBookFormState,
} from "@/src/actions/lookbook";

const initialState: LookBookFormState = { success: false };

type LookBookImageListProps = {
  images: LookBookImage[];
};

type LookBookImageCardProps = {
  image: LookBookImage;
  index: number;
  total: number;
  orderIds: string;
  orderAction: ReturnType<typeof updateLookBookImageOrderAction> extends never
    ? never
    : (payload: FormData) => void;
  orderPending: boolean;
};

function ActionStatus({ state }: { state: LookBookFormState }) {
  if (!state.success && !state.error) return null;

  return (
    <p
      className={`text-xs ${
        state.success ? "text-emerald-400" : "text-red-400"
      }`}
      role="status"
    >
      {state.success ? state.message : state.error}
    </p>
  );
}

function LookBookImageCard({
  image,
  index,
  total,
  orderIds,
  orderAction,
  orderPending,
}: LookBookImageCardProps) {
  const router = useRouter();
  const [toggleState, toggleAction, togglePending] = useActionState(
    toggleLookBookImageAction,
    initialState
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteLookBookImageAction,
    initialState
  );

  useEffect(() => {
    if (toggleState.success || deleteState.success) {
      router.refresh();
    }
  }, [deleteState.success, router, toggleState.success]);

  const status = toggleState.success
    ? toggleState
    : deleteState.success
      ? deleteState
      : toggleState.error
        ? toggleState
        : deleteState;

  return (
    <article className="group relative overflow-hidden rounded-lg border border-white/10 bg-neutral-950/50">
      <div className="aspect-[3/4] overflow-hidden bg-neutral-800">
        <img
          src={image.imageUrl}
          alt={image.altText || image.title || "Look Book image"}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <span className="text-xs uppercase tracking-wider text-white">
          #{index + 1} {image.isActive ? "Активно" : "Скрыто"}
        </span>
      </div>

      <div className="space-y-3 p-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">
            {image.title || "Без названия"}
          </p>
          <p className="truncate text-xs text-neutral-400">{image.imageUrl}</p>
        </div>

        <ActionStatus state={status} />

        <div className="flex items-center justify-between gap-2">
          <form action={orderAction} className="flex items-center gap-1">
            <input type="hidden" name="ids" value={orderIds} />
            <input type="hidden" name="moveId" value={image.id} />
            <button
              type="submit"
              name="moveDirection"
              value="up"
              disabled={orderPending || index === 0}
              aria-label={`Переместить «${image.title || "изображение"}» выше`}
              className="rounded p-1.5 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <button
              type="submit"
              name="moveDirection"
              value="down"
              disabled={orderPending || index === total - 1}
              aria-label={`Переместить «${image.title || "изображение"}» ниже`}
              className="rounded p-1.5 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              <GripVertical className="h-4 w-4 rotate-180" />
            </button>
          </form>

          <div className="flex items-center gap-1">
            <form action={toggleAction}>
              <input type="hidden" name="id" value={image.id} />
              <button
                type="submit"
                disabled={togglePending}
                aria-label={image.isActive ? "Скрыть изображение" : "Показать изображение"}
                className="rounded p-1.5 text-neutral-400 transition-colors hover:bg-white/10 hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {image.isActive ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>
            </form>
            <form
              action={deleteAction}
              onSubmit={(event) => {
                if (!window.confirm("Удалить это изображение из Look Book?")) {
                  event.preventDefault();
                }
              }}
            >
              <input type="hidden" name="id" value={image.id} />
              <button
                type="submit"
                disabled={deletePending}
                aria-label={`Удалить «${image.title || "изображение"}»`}
                className="rounded p-1.5 text-neutral-400 transition-colors hover:bg-white/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function LookBookImageList({ images }: LookBookImageListProps) {
  const router = useRouter();
  const [orderState, orderAction, orderPending] = useActionState(
    updateLookBookImageOrderAction,
    initialState
  );

  useEffect(() => {
    if (orderState.success) {
      router.refresh();
    }
  }, [orderState.success, router]);

  if (images.length === 0) {
    return (
      <div className="rounded-lg border border-white/10 bg-neutral-950/50 p-12 text-center">
        <ImageIcon className="mx-auto mb-4 h-12 w-12 text-neutral-600" />
        <h2 className="text-lg font-light">Нет изображений</h2>
        <p className="mt-2 text-sm text-neutral-400">
          Добавьте первое изображение в Look Book.
        </p>
      </div>
    );
  }

  const orderedImages = [...images].sort((a, b) => a.order - b.order);
  const orderIds = orderedImages.map((image) => image.id).join(",");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-neutral-400">
          {orderedImages.length} {orderedImages.length === 1 ? "изображение" : "изображений"}
        </p>
        <ActionStatus state={orderState} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {orderedImages.map((image, index) => (
          <LookBookImageCard
            key={image.id}
            image={image}
            index={index}
            total={orderedImages.length}
            orderIds={orderIds}
            orderAction={orderAction}
            orderPending={orderPending}
          />
        ))}
      </div>
    </div>
  );
}
