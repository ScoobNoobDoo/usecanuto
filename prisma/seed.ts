import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "canuto2026",
    12
  );

  await prisma.admin.upsert({
    where: { email: "admin@usecanuto.com" },
    update: {},
    create: {
      email: "admin@usecanuto.com",
      password,
      name: "Canuto",
    },
  });

  const categories = [
    { name: "Vestidos", slug: "vestidos", order: 1 },
    { name: "Blusas", slug: "blusas", order: 2 },
    { name: "Calças", slug: "calcas", order: 3 },
    { name: "Saias", slug: "saias", order: 4 },
    { name: "Acessórios", slug: "acessorios", order: 5 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const vestidos = await prisma.category.findUnique({ where: { slug: "vestidos" } });
  const blusas = await prisma.category.findUnique({ where: { slug: "blusas" } });

  const sampleProducts = [
    {
      title: "Vestido Midi GGT Decote Metal",
      slug: "vestido-midi-ggt-decote-metal",
      description:
        "Vestido midi em tecido GGT com decote metalizado. Caimento fluido e elegante, perfeito para ocasiões especiais ou o dia a dia com sofisticação. Composição: 100% poliéster. Lavagem à mão.",
      price: 459.9,
      salePrice: 389.9,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92e1?w=800&q=80",
      ]),
      sizes: JSON.stringify(["PP", "P", "M", "G", "GG"]),
      colors: JSON.stringify(["Navy", "Preto", "Terracota"]),
      categoryId: vestidos?.id,
      featured: true,
    },
    {
      title: "Blusa Ombro a Ombro Estampa Blush",
      slug: "blusa-ombro-a-ombro-estampa-blush",
      description:
        "Blusa ombro a ombro com estampa exclusiva em tons blush. Tecido leve e confortável, ideal para compor looks casuais e elegantes. Modelagem solta com acabamento impecável.",
      price: 289.9,
      salePrice: null,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&q=80",
      ]),
      sizes: JSON.stringify(["P", "M", "G"]),
      colors: JSON.stringify(["Blush", "Off White"]),
      categoryId: blusas?.id,
      featured: true,
    },
    {
      title: "Calça Wide Leg Alfaiataria",
      slug: "calca-wide-leg-alfaiataria",
      description:
        "Calça wide leg em alfaiataria premium. Cintura alta com caimento impecável. Peça versátil que transita do escritório ao happy hour com elegância natural.",
      price: 379.9,
      salePrice: 319.9,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
      ]),
      sizes: JSON.stringify(["36", "38", "40", "42", "44"]),
      colors: JSON.stringify(["Bege", "Preto", "Caramelo"]),
      categoryId: null,
      featured: true,
    },
    {
      title: "Saia Midi Plissada",
      slug: "saia-midi-plissada",
      description:
        "Saia midi plissada com movimento e leveza. Tecido fluido que acompanha cada passo. Combina perfeitamente com blusas e camisas para looks sofisticados.",
      price: 329.9,
      salePrice: null,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80",
      ]),
      sizes: JSON.stringify(["P", "M", "G"]),
      colors: JSON.stringify(["Verde Musgo", "Preto"]),
      categoryId: null,
      featured: false,
    },
    {
      title: "Macaquinho GGT Estampa Onça",
      slug: "macaquinho-ggt-estampa-onca",
      description:
        "Macaquinho em GGT com estampa onça exclusiva. Decote V e cintura marcada. Peça statement para quem ama ousar com estilo e personalidade.",
      price: 419.9,
      salePrice: 349.9,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80",
      ]),
      sizes: JSON.stringify(["P", "M", "G"]),
      colors: JSON.stringify(["Onça"]),
      categoryId: vestidos?.id,
      featured: true,
    },
    {
      title: "Tricô Assimétrico Ombro Só",
      slug: "trico-assimetrico-ombro-so",
      description:
        "Tricô assimétrico com design ombro só. Malha macia e aconchegante para os dias mais frescos. Multicolor com fios premium de alta qualidade.",
      price: 499.9,
      salePrice: null,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80",
      ]),
      sizes: JSON.stringify(["U"]),
      colors: JSON.stringify(["Multicolor"]),
      categoryId: blusas?.id,
      featured: true,
    },
  ];

  for (const product of sampleProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  console.log("Seed concluído!");
  console.log("Admin: admin@usecanuto.com / canuto2026");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());