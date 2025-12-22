import prisma from "@/lib/prisma";
import { pluralize } from "@/lib/utils/string";

export async function ProductAttributes({ productId }: { productId: string }) {
  // Fetch all attributes and values for this product's variants
  const variants = await prisma.variant.findMany({
    where: { productId },
    include: {
      variantAttributeValues: {
        include: {
          attributeValue: {
            include: { attribute: true },
          },
        },
      },
    },
  });

  // Collect unique attributes and their values
  const attrMap: Record<string, Set<string>> = {};
  variants.forEach((variant) => {
    variant.variantAttributeValues.forEach((vav) => {
      const attrName = vav.attributeValue.attribute.name;
      const attrValue = vav.attributeValue.value;
      if (!attrMap[attrName]) attrMap[attrName] = new Set();
      attrMap[attrName].add(attrValue);
    });
  });

  if (Object.keys(attrMap).length === 0) return null;

  return (
    <section className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Attributes</h2>
      <div className="space-y-2">
        {Object.entries(attrMap).map(([attr, values]) => {
          const isPlural = [...values].length > 1;

          const formattedAttr = isPlural ? pluralize(attr) : attr;

          return (
            <div key={attr}>
              <span className="font-medium">{formattedAttr}:</span>{" "}
              {[...values].join(", ")}
            </div>
          );
        })}
      </div>
    </section>
  );
}
