import { getPage, updatePage } from "../../actions";
import { notFound, redirect } from "next/navigation";
import BlockEditor from "../../components/BlockEditor";

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
    <main className="max-w-2xl mx-auto p-6">
      <form
        action={handleSubmit}
        className="bg-white rounded-lg shadow p-6 space-y-6 border"
      >
        <h2 className="text-2xl font-bold mb-2 text-neutral-900">Edit Page</h2>
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-neutral-700"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            defaultValue={page.title}
            required
            className="input w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Content
          </label>
          <BlockEditor value={initialBlocks} />
        </div>
        <input
          type="hidden"
          name="content"
          required
          defaultValue={JSON.stringify(initialBlocks)}
        />
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="submit"
            className="btn px-6 py-2 bg-blue-600 text-white rounded-md font-semibold shadow hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
      </form>
    </main>
  );
}
