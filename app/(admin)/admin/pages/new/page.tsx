import { createPage } from "../actions";
import { redirect } from "next/navigation";
import BlockEditor from "../components/BlockEditor";

export default function NewPageForm() {
  async function handleSubmit(formData: FormData) {
    "use server";
    const slug = formData.get("slug") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    await createPage({ slug, title, content: JSON.parse(content) });
    redirect("/admin/pages");
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">Create New Page</h2>
      <input name="slug" placeholder="Slug" required className="input" />
      <input name="title" placeholder="Title" required className="input" />
      <BlockEditor />
      <button type="submit" className="btn">
        Create
      </button>
    </form>
  );
}
