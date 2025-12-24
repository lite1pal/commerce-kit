import { getPage, updatePage } from "../../actions";
import { notFound, redirect } from "next/navigation";
import BlockEditor from "../../components/BlockEditor";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import PageContainer from "../../../components/page-container";
import PageHeader from "../../../components/page-header";
import { Field, FieldGroup, FieldLabel } from "../../../components/ui/field";

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
    <PageContainer>
      <PageHeader>Edit Page</PageHeader>
      <form action={handleSubmit}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input
              id="title"
              name="title"
              defaultValue={page.title}
              required
              className="input w-full"
            />
          </Field>
          <Field>
            <FieldLabel>Content</FieldLabel>
            <BlockEditor value={initialBlocks} />
          </Field>
        </FieldGroup>
        <input
          type="hidden"
          name="content"
          required
          defaultValue={JSON.stringify(initialBlocks)}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="submit"
            className="btn px-6 py-2 bg-blue-600 text-white rounded-md font-semibold shadow hover:bg-blue-700 transition"
          >
            Save
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
