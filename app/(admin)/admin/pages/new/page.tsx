import { createPage } from "../actions";
import { redirect } from "next/navigation";
import BlockEditor from "../components/BlockEditor";
import PageContainer from "../../components/page-container";
import PageHeader from "../../components/page-header";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

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
    <PageContainer>
      <PageHeader>Create a new page</PageHeader>
      <form action={handleSubmit} className="space-y-4">
        <Input name="slug" placeholder="Slug" required className="input" />
        <Input name="title" placeholder="Title" required className="input" />
        <BlockEditor />
        <Button type="submit" className="btn">
          Create
        </Button>
      </form>
    </PageContainer>
  );
}
