import { notFound } from "next/navigation";
import { getRepos } from "@/server/repositories";
import { ProductForm } from "@/components/studio/ProductForm";
import { PageHeader } from "@/components/studio/PageHeader";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit shop item" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getRepos().products.get(id);
  if (!product) notFound();

  return (
    <div>
      <PageHeader title={product.title} intro="Changes are saved to the shop right away." />
      <ProductForm product={product} />
    </div>
  );
}
