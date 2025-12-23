import { notFound } from "next/navigation";
import { getAttributeById } from "../../actions";
import AttributeForm from "./attribute-form";

type AttributeEditProps = {
  params: Promise<{ id: string }>;
};

export default async function AttributeEdit({ params }: AttributeEditProps) {
  const id = (await params).id;
  const attribute = await getAttributeById(id);

  if (!attribute) notFound();

  return (
    <main className="p-6 max-w-3xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Edit Attribute</h1>
        <p className="text-sm text-gray-500">ID: {attribute.id}</p>
      </header>

      <AttributeForm attribute={attribute} />
    </main>
  );
}
