/*
  Warnings:

  - A unique constraint covering the columns `[attributeId,value]` on the table `AttributeValue` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Attribute_name_idx" ON "Attribute"("name");

-- CreateIndex
CREATE INDEX "AttributeValue_value_idx" ON "AttributeValue"("value");

-- CreateIndex
CREATE UNIQUE INDEX "AttributeValue_attributeId_value_key" ON "AttributeValue"("attributeId", "value");

-- CreateIndex
CREATE INDEX "VariantAttributeValue_variantId_idx" ON "VariantAttributeValue"("variantId");
