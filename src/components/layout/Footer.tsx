"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#09090B] text-white border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand & Manifesto */}
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="inline-block text-2xl font-light tracking-[0.35em] text-white mb-4"
            >
              QARA BALA
            </Link>
            <p className="max-w-sm text-xs leading-6 text-neutral-400 font-light">
              Концептуальный бренд одежды, вдохновленный архитектурным
              минимализмом, натуральными тканями высшего порядка и строгой
              монохромной эстетикой.
            </p>
            <div className="mt-6 text-[11px] tracking-[0.2em] uppercase text-neutral-500">
              Алматы • Астана • Доставка по СНГ
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium mb-4">
                Коллекции
              </h3>
              <ul className="space-y-2.5 text-xs text-neutral-400">
                <li>
                  <Link href="/catalog?category=Верхняя одежда" className="hover:text-white transition-colors">
                    Верхняя одежда
                  </Link>
                </li>
                <li>
                  <Link href="/catalog?category=Худи и Свитшоты" className="hover:text-white transition-colors">
                    Худи и свитшоты
                  </Link>
                </li>
                <li>
                  <Link href="/catalog?category=Брюки" className="hover:text-white transition-colors">
                    Брюки и деним
                  </Link>
                </li>
                <li>
                  <Link href="/catalog?category=Футболки" className="hover:text-white transition-colors">
                    Базовые футболки
                  </Link>
                </li>
                <li>
                  <Link href="/catalog?category=Аксессуары" className="hover:text-white transition-colors">
                    Аксессуары
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium mb-4">
                Клиентам
              </h3>
              <ul className="space-y-2.5 text-xs text-neutral-400">
                <li>
                  <Link href="/catalog" className="hover:text-white transition-colors">
                    Таблица размеров
                  </Link>
                </li>
                <li>
                  <span className="hover:text-white transition-colors cursor-pointer">
                    Доставка и оплата
                  </span>
                </li>
                <li>
                  <span className="hover:text-white transition-colors cursor-pointer">
                    Условия возврата
                  </span>
                </li>
                <li>
                  <span className="hover:text-white transition-colors cursor-pointer">
                    Уход за вещами
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium mb-4">
                Служба заботы
              </h3>
              <ul className="space-y-2.5 text-xs text-neutral-400">
                <li>
                  <a
                    href="https://t.me/kizyko"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors text-emerald-400"
                  >
                    Telegram: @kizyko
                  </a>
                </li>
                <li>
                  <span className="hover:text-white transition-colors">
                    info@qarabala.com
                  </span>
                </li>
                <li>
                  <span className="text-neutral-500">10:00 — 21:00 (KZT)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-3">
            <h3 className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium mb-4">
              Закрытые релизы
            </h3>
            <p className="text-xs text-neutral-400 mb-4 font-light">
              Получайте ранний доступ к лимитированным капсулам и закрытым распродажам.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-white/5 p-3 border border-white/10">
                <Check className="w-4 h-4" />
                <span>Спасибо! Вы добавлены в VIP-лист.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ваш email"
                  className="w-full bg-white/5 border border-white/15 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-white transition-colors"
                  aria-label="Подписаться"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px]">
          <p>© 2026 QARA BALA. Все права защищены.</p>

          <div className="flex items-center gap-6">
            <Link
              href="/auth/signin"
              className="hover:text-neutral-300 transition-colors uppercase tracking-[0.15em] text-[10px]"
            >
              Панель администратора
            </Link>
            <span>•</span>
            <span className="text-neutral-600">Оплата: VISA / MASTERCARD / KASPI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
