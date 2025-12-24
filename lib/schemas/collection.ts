import z from "zod";

export const UpdateCollectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string().min(3),
  description: z.string({ error: "Missing description" }).min(10),
  productIds: z
    .string()
    .transform((v) => JSON.parse(v))
    .pipe(z.array(z.string())),
});
