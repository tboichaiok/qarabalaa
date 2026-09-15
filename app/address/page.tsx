import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Адрес — QARA BALA",
  description: "Наши магазины и контактная информация",
};

export default function AddressPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">Контакты</p>
        <h1 className="mt-3 text-4xl font-light tracking-tight text-neutral-950 sm:text-5xl">
          Наши адреса
        </h1>

        <div className="mt-12 space-y-12">
          {/* Almaty */}
          <section>
            <h2 className="text-lg font-medium tracking-tight text-neutral-950">
              Алматы
            </h2>
            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              <article className="rounded-lg border border-neutral-200 p-6">
                <h3 className="font-medium text-neutral-950">Флагманский магазин</h3>
                <address className="mt-3 not-italic text-sm text-neutral-600 leading-7">
                  ул. Аль-Фараби, 123/1 (ТРЦ "Мега Алматы")<br />
                  Ежедневно 10:00–22:00
                </address>
              </article>
              <article className="rounded-lg border border-neutral-200 p-6">
                <h3 className="font-medium text-neutral-950">Бутик в Esentai Mall</h3>
                <address className="mt-3 not-italic text-sm text-neutral-600 leading-7">
                  пр. Аль-Фараби, 77/7 (Esentai Mall, 1 этаж)<br />
                  Ежедневно 10:00–21:00
                </address>
              </article>
            </div>
          </section>

          {/* Astana */}
          <section>
            <h2 className="text-lg font-medium tracking-tight text-neutral-950">
              Астана
            </h2>
            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              <article className="rounded-lg border border-neutral-200 p-6">
                <h3 className="font-medium text-neutral-950">Бутик в Khan Shatyr</h3>
                <address className="mt-3 not-italic text-sm text-neutral-600 leading-7">
                  просп. Туран, 37 (ТРЦ "Хан Шатыр", 2 этаж)<br />
                  Ежедневно 10:00–22:00
                </address>
              </article>
              <article className="rounded-lg border border-neutral-200 p-6">
                <h3 className="font-medium text-neutral-950">Магазин в Mega Silk Way</h3>
                <address className="mt-3 not-italic text-sm text-neutral-600 leading-7">
                  ул. Сарыарка, 8 (ТРЦ "Mega Silk Way")<br />
                  Ежедневно 10:00–21:00
                </address>
              </article>
            </div>
          </section>

          {/* Online */}
          <section className="border-t border-neutral-200 pt-8">
            <h2 className="text-lg font-medium tracking-tight text-neutral-950">
              Онлайн
            </h2>
            <div className="mt-6 rounded-lg border border-neutral-200 p-6 bg-neutral-50">
              <h3 className="font-medium text-neutral-950">Интернет-магазин</h3>
              <p className="mt-3 text-sm text-neutral-600">
                Доставка по Казахстану: Алматы, Астана — 1–2 дня, регионы — 3–5 дней.
                Бесплатная доставка от 60 000 ₸.
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-neutral-600">
                <a href="mailto:hello@qarabala.kz" className="hover:underline">
                  hello@qarabala.kz
                </a>
                <a href="tel:+77271234567" className="hover:underline">
                  +7 (727) 123-45-67
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}