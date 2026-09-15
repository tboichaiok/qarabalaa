import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Очистка базы данных...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log("👤 Создание пользователей...");
  const adminPassword = await bcrypt.hash("admin12345", 10);
  const userPassword = await bcrypt.hash("customer12345", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@qarabala.com",
      name: "Администратор QARA BALA",
      password: adminPassword,
      role: "ADMIN",
      phone: "+7 (777) 000-00-01",
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: "customer@qarabala.com",
      name: "Алишер Касымов",
      password: userPassword,
      role: "USER",
      phone: "+7 (701) 987-65-43",
    },
  });

  console.log("👗 Создание премиальных коллекций одежды QARA BALA...");

  const productsData = [
    {
      title: "Пальто из натуральной шерсти Oversize",
      slug: "oversize-wool-coat-obsidian",
      description:
        "Архитектурный крой с четко очерченной линией плеч. Выполнено из 100% итальянской шерсти плотностью 620 г/м². Глубокий черный цвет, скрытая пуговичная планка и шелковистая подкладка из купро. Идеальный силуэт для прохладного сезона.",
      price: 115000,
      category: "Верхняя одежда",
      isFeatured: true,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1550614000-4895a10e1bfd?q=80&w=1200&auto=format&fit=crop",
      ]),
      colors: [
        { name: "Obsidian Black", hex: "#09090B" },
        { name: "Slate Grey", hex: "#3F3F46" },
      ],
      sizes: ["S", "M", "L", "XL"],
    },
    {
      title: "Худи Heavyweight Fleece 480 GSM",
      slug: "heavyweight-fleece-hoodie",
      description:
        "Концептуальное худи из плотного органического хлопка премиальной категории. Двойной капюшон без шнурков для строгого минималистичного силуэта. Спущенная линия плеча и свободная посадка.",
      price: 48000,
      category: "Худи и Свитшоты",
      isFeatured: true,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1200&auto=format&fit=crop",
      ]),
      colors: [
        { name: "Chalk White", hex: "#F4F4F5" },
        { name: "Obsidian Black", hex: "#09090B" },
        { name: "Raw Oatmeal", hex: "#D4D4D8" },
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    {
      title: "Брюки прямого кроя с защипами",
      slug: "tailored-pleated-trousers",
      description:
        "Брюки свободного силуэта с глубокими защипами у пояса. Смесовая костюмная шерсть с добавлением вискозы обеспечивает безупречное ниспадание стрелки. Регулируемый внутренний хлястик.",
      price: 54000,
      category: "Брюки",
      isFeatured: true,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=1200&auto=format&fit=crop",
      ]),
      colors: [
        { name: "Obsidian Black", hex: "#09090B" },
        { name: "Deep Charcoal", hex: "#27272A" },
      ],
      sizes: ["S", "M", "L", "XL"],
    },
    {
      title: "Футболка Boxy Heavyweight Tee 280 GSM",
      slug: "boxy-heavyweight-tee",
      description:
        "Футболка квадратного силуэта из плотного гребенного хлопка пенье. Усиленный плотный воротник 3 см, сохраняющий геометрию после многократных стирок. Длина до линии бедер.",
      price: 26000,
      category: "Футболки",
      isFeatured: false,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1200&auto=format&fit=crop",
      ]),
      colors: [
        { name: "Pure White", hex: "#FFFFFF" },
        { name: "Obsidian Black", hex: "#09090B" },
        { name: "Washed Graphite", hex: "#52525B" },
      ],
      sizes: ["XS", "S", "M", "L", "XL"],
    },
    {
      title: "Кашемировый свитер фактурной вязки",
      slug: "textured-cashmere-knit",
      description:
        "Роскошный свитер крупной вязки из 70% монгольского кашемира и 30% тонкорунной мериносовой шерсти. Невероятно мягкая текстура, высокий комфортный воротник-стойка.",
      price: 78000,
      category: "Худи и Свитшоты",
      isFeatured: false,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1200&auto=format&fit=crop",
      ]),
      colors: [
        { name: "Alabaster Cream", hex: "#FDFBF7" },
        { name: "Camel", hex: "#A87954" },
        { name: "Obsidian Black", hex: "#09090B" },
      ],
      sizes: ["S", "M", "L", "XL"],
    },
    {
      title: "Кожаная сумка-тоут Minimalist Architecture",
      slug: "minimalist-leather-tote",
      description:
        "Сумка тоут строгой геометрической формы из цельного пласта гладкой телячьей кожи растительного дубления. Внутреннее отделение для ноутбука 15 дюймов и карман на магнитной застежке.",
      price: 89000,
      category: "Аксессуары",
      isFeatured: true,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1200&auto=format&fit=crop",
      ]),
      colors: [
        { name: "Obsidian Black", hex: "#09090B" },
        { name: "Espresso", hex: "#2C1B18" },
      ],
      sizes: ["ONE SIZE"],
    },
  ];

  for (const item of productsData) {
    const product = await prisma.product.create({
      data: {
        title: item.title,
        slug: item.slug,
        description: item.description,
        price: item.price,
        category: item.category,
        isFeatured: item.isFeatured,
        images: item.images,
      },
    });

    for (const color of item.colors) {
      for (const size of item.sizes) {
        // Generate realistic stock (5 to 15 items per variant, with occasional low stock)
        const stockQuantity = Math.floor(Math.random() * 12) + 3;
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            color: color.name,
            colorHex: color.hex,
            size: size,
            stockQuantity: stockQuantity,
          },
        });
      }
    }
  }

  console.log("✅ База данных успешно заполнена!");
  console.log(`🔑 Администратор: admin@qarabala.com / admin12345`);
  console.log(`👤 Покупатель: customer@qarabala.com / customer12345`);
}

main()
  .catch((e) => {
    console.error("❌ Ошибка при сидировании:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
