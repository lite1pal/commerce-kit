import { notFound } from "next/navigation";
import { getCollectionById } from "../../actions";
import PageContainer from "../../../components/page-container";
import CollectionForm from "./collection-form";

type EditCollectionPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCollectionPage({
  params,
}: EditCollectionPageProps) {
  const id = (await params).id;

  const collection = await getCollectionById(id);
  if (!collection) notFound();

  return (
    <PageContainer>
      <CollectionForm collection={collection} />
    </PageContainer>
  );
}
