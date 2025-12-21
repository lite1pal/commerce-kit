import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  // wipe (safe for local dev)
  await prisma.productCollection.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();

  const apparel = await prisma.collection.create({
    data: {
      name: "Apparel",
      slug: "apparel",
      description: "Clothing and wearable items",
    },
  });

  const home = await prisma.collection.create({
    data: {
      name: "Home",
      slug: "home",
      description: "Home and lifestyle items",
    },
  });

  const product = await prisma.product.create({
    data: {
      name: "Commerce Kit Starter Tee",
      slug: "starter-tee",
      description: "A simple demo product to validate the full flow.",
      active: true,
      images: {
        create: [
          {
            url: "https://picsum.photos/seed/tee/800/800",
            alt: "Starter Tee",
          },
        ],
      },
      variants: {
        create: [
          { name: "Small", priceCents: 1990, sku: "TEE-S", stock: 10 },
          { name: "Medium", priceCents: 1990, sku: "TEE-M", stock: 15 },
          { name: "Large", priceCents: 1990, sku: "TEE-L", stock: 7 },
        ],
      },
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "Commerce Kit Mug",
      slug: "mug",
      description: "Another demo product.",
      active: true,
      images: {
        create: [{ url: "https://picsum.photos/seed/mug/800/800", alt: "Mug" }],
      },
      variants: {
        create: [
          { name: "Default", priceCents: 1290, sku: "MUG-1", stock: 25 },
        ],
      },
    },
  });

  await prisma.productCollection.create({
    data: { productId: product.id, collectionId: apparel.id },
  });

  await prisma.productCollection.create({
    data: { productId: product2.id, collectionId: home.id },
  });

  console.log("Seeded:", {
    collections: [apparel.slug, home.slug],
    products: [product.slug, product2.slug],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
