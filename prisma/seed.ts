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
  await prisma.variantAttributeValue.deleteMany();
  await prisma.attributeValue.deleteMany();
  await prisma.attribute.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();

  // Create attributes
  const colorAttr = await prisma.attribute.create({
    data: { name: "color" },
  });
  const sizeAttr = await prisma.attribute.create({
    data: { name: "size" },
  });

  // Create attribute values
  const red = await prisma.attributeValue.create({
    data: { value: "red", attributeId: colorAttr.id },
  });
  const blue = await prisma.attributeValue.create({
    data: { value: "blue", attributeId: colorAttr.id },
  });
  const small = await prisma.attributeValue.create({
    data: { value: "small", attributeId: sizeAttr.id },
  });
  const medium = await prisma.attributeValue.create({
    data: { value: "medium", attributeId: sizeAttr.id },
  });
  const large = await prisma.attributeValue.create({
    data: { value: "large", attributeId: sizeAttr.id },
  });

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
          { name: "small", priceCents: 1990, sku: "tee-s", stock: 10 },
          { name: "medium", priceCents: 1990, sku: "tee-m", stock: 15 },
          { name: "large", priceCents: 1990, sku: "tee-l", stock: 7 },
        ],
      },
    },
    include: { variants: true },
  });

  // Assign attribute values to variants
  await prisma.variantAttributeValue.createMany({
    data: [
      { variantId: product.variants[0].id, attributeValueId: small.id }, // Small
      { variantId: product.variants[1].id, attributeValueId: medium.id }, // Medium
      { variantId: product.variants[2].id, attributeValueId: large.id }, // Large
      // Optionally assign colors
      { variantId: product.variants[0].id, attributeValueId: red.id },
      { variantId: product.variants[1].id, attributeValueId: blue.id },
      { variantId: product.variants[2].id, attributeValueId: red.id },
    ],
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
          { name: "default", priceCents: 1290, sku: "mug-1", stock: 25 },
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
