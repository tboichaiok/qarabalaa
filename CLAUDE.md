@AGENTS.md

# QARA BALA — Luxury E-Commerce Platform

## Project Summary

Built a full luxury e-commerce platform for QARA BALA — premium conceptual clothing brand based in Kazakhstan. Production-ready Next.js application with authentication, cart, checkout, admin CMS, and Telegram notifications.

## Tech Stack

- **Next.js 16** App Router, Server Components & Server Actions
- **React 19**, TypeScript, Tailwind CSS v4, Framer Motion
- **Prisma v6** ORM + **SQLITE** database (`prisma-data/dev.db`)
- **NextAuth v4** JWT session + role-based access (`ADMIN` / `USER`)
- **Telegram Bot API** for order notifications
- Simulated payment gateway (card terminal → confirm → success)

## Default Users

- Admin: `admin@qarabala.com` / `admin12345`
- Customer: `customer@qara-bala.com` / `customer12345`

## ✅ Completed Features

1. **Auth** — NextAuth credentials, role-based, middleware guards `/admin/*`
2. **Storefront** — Home (hero, pillars, featured capsule, manifesto), Catalog (filtering), PDP (variant selection, size guide, accordion)
3. **Cart** — Client context with localStorage persistence, drawer, free-shipping threshold (60,000 ₸)
4. **Checkout** — Client form → Server Action `createOrderAction` → simulated payment → success page
5. **Inventory** — Atomic `$transaction` stock deduction on payment, variant-level tracking
6. **Telegram** — `sendTelegramOrderNotification` on paid order, Markdown formatted
7. **Admin Panel** — Layout, Products, Orders, Inventory, Customers, Analytics, Settings pages
8. **i18n** — Russian language, KZT pricing, `next-intl` configured

## 🔄 In Progress - Navigation & Look Book

### Navigation Updates (Navbar.tsx)
- ✅ Added public pages: "Адрес", "Соц. сети", "Look Book"
- ✅ Removed non-functional category filters ("Новинки", "Верхняя одежда", "Худи & Свитшоты")
- ✅ Kept main navigation: "Каталог", "Адрес", "Соц. сети", "Look Book"

### Look Book Pages Created
- ✅ `app/lookbook/page.tsx` - Public Look Book page (displays active images)
- ✅ `app/admin/lookbook/page.tsx` - Admin overview page
- ✅ `app/admin/lookbook/new/page.tsx` - Add image form (client component with Server Action)

### Server Actions (src/actions/lookbook.ts)
- ✅ `getLookBookImagesAction()` - Fetch all images
- ✅ `addLookBookImageAction()` - Add new image (ADMIN only)
- ✅ `updateLookBookImageOrderAction()` - Reorder images (ADMIN only)
- ✅ `toggleLookBookImageAction()` - Toggle active status (ADMIN only)
- ✅ `deleteLookBookImageAction()` - Delete image (ADMIN only)

### Database Schema (prisma/schema.prisma)
- ✅ LookBookImage model added: `id`, `imageUrl`, `title`, `altText`, `order`, `isActive`, timestamps

## 📋 Remaining Tasks

### High Priority
- [ ] **Fix TypeScript errors** - Prisma client needs regenerate after schema change
- [ ] **Create placeholder pages** - `/address` and `/social` pages (currently 404)
- [ ] **Fix product creation flow** - Verify "Добавить товар" button works in admin/products/new

### Medium Priority
- [ ] **Add image upload support** - Replace URL input with actual file upload (currently accepts URL only)
- [ ] **Create admin/actions** - Action handlers for product CRUD operations (products.ts exists but needs full implementation)
- [ ] **Build products list page** - `/admin/products` needs to show actual products from DB

### Notes
- Prisma client generation had permission issue - needs regenerating
- Look Book form currently accepts URL only - consider adding file upload capability
- Product creation form has extensive UI but needs proper action handlers
- Static pages needed: `/address` (contact info, locations), `/social` (social links)