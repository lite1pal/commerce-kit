import { getPage, updatePage } from "../../actions";
import { notFound, redirect } from "next/navigation";
import BlockEditor from "../../components/block-editor";

type PageEditProps = {
  params: Promise<{ id: string }>;
};

export default async function PageEdit({ params }: PageEditProps) {
  const id = (await params).id;
  const page = await getPage(id);

  if (!page) notFound();

  async function handleSubmit(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    await updatePage(id, { title, content: JSON.parse(content) });
    redirect("/admin/pages");
  }

  let initialBlocks: any[] = [];
  try {
    initialBlocks =
      typeof page.content === "string"
        ? JSON.parse(page.content)
        : page.content;
  } catch {
    initialBlocks = [];
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">Edit Page</h2>
      <input
        name="title"
        defaultValue={page.title}
        required
        className="input"
      />
      <BlockEditor value={initialBlocks} />
      <input
        type="hidden"
        name="content"
        required
        defaultValue={JSON.stringify(initialBlocks)}
      />
      <button type="submit" className="btn">
        Save
      </button>
    </form>
  );
}
