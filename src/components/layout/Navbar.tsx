"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/src/context/CartContext";
import { ShoppingBag, Menu, X, User, Search } from "lucide-react";
import { useSession } from "next-auth/react";

export function Navbar() {
  const pathname = usePathname();
  const { totalCount, setIsDrawerOpen } = useCart();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isDarkBanner = pathname === "/";
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const navLinks = [
    { name: "Каталог", href: "/catalog" },
    { name: "Адрес", href: "/address" },
    { name: "Соц. сети", href: "/social" },
    { name: "Look Book", href: "/lookbook" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/catalog?q=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 border-b ${
          isDarkBanner
            ? "bg-black/90 text-white border-white/10 backdrop-blur-md"
            : "bg-white/95 text-neutral-900 border-neutral-200/80 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 text-current hover:opacity-70 transition-opacity"
              aria-label="Открыть меню"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Left Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[11px] uppercase tracking-[0.25em] font-medium text-current hover:opacity-60 transition-opacity"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Center Brand Logo */}
          <div className="flex-1 text-center lg:flex-none">
            <Link
              href="/"
              className="inline-block text-xl sm:text-2xl font-light tracking-[0.35em] text-current luxury-title hover:opacity-80 transition-opacity"
            >
              QARA BALA
            </Link>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-1.5 text-current hover:opacity-70 transition-opacity"
              aria-label="Поиск"
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>

            {/* User / Admin Portal */}
            <Link
              href={isAdmin ? "/admin" : session ? "/admin" : "/auth/signin"}
              className="hidden sm:flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] font-medium text-current hover:opacity-70 transition-opacity"
              title={isAdmin ? "Панель администратора" : "Личный кабинет"}
            >
              <User className="w-4 h-4" />
              {isAdmin && (
                <span className="text-[9px] bg-white text-black px-1.5 py-0.5 font-bold uppercase rounded-xs">
                  CMS
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative flex items-center gap-2 p-1.5 text-current hover:opacity-70 transition-opacity"
              aria-label="Открыть корзину"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="text-xs font-semibold tabular-kzt">
                [{totalCount}]
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white text-black p-6 shadow-2xl relative">
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute right-4 top-4 text-neutral-400 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 mb-2">
              Поиск по коллекции
            </p>
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Пальто, худи, брюки..."
                  className="w-full border-b border-black py-3 pr-10 text-base font-light focus:outline-none placeholder:text-neutral-400"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-black"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-neutral-500">
              <span className="text-neutral-400">Популярное:</span>
              <button
                onClick={() => {
                  setSearchQuery("шерсть");
                  window.location.href = "/catalog?q=шерсть";
                }}
                className="hover:underline"
              >
                Шерсть
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  setSearchQuery("худи");
                  window.location.href = "/catalog?q=худи";
                }}
                className="hover:underline"
              >
                Худи
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  setSearchQuery("брюки");
                  window.location.href = "/catalog?q=брюки";
                }}
                className="hover:underline"
              >
                Брюки
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 flex h-full w-full max-w-xs flex-col bg-neutral-950 text-white p-6 justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-8">
                <span className="text-sm font-light tracking-[0.3em]">
                  QARA BALA
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col space-y-6">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm uppercase tracking-[0.25em] text-neutral-200 hover:text-white"
                >
                  Главная
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm uppercase tracking-[0.25em] text-neutral-200 hover:text-white"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="border-t border-white/10 pt-6 space-y-4">
              <Link
                href={session ? "/admin" : "/auth/signin"}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-400 hover:text-white"
              >
                <User className="w-4 h-4" />
                <span>
                  {isAdmin
                    ? "Панель администратора"
                    : session
                    ? "Личный кабинет"
                    : "Войти в систему"}
                </span>
              </Link>
              <p className="text-[10px] text-neutral-500 tracking-widest">
                ALMATY • ASTANA • WORLDWIDE
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
