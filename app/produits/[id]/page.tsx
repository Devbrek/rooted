export default async function ProductPage({ params }: PageProps<"/produits/[id]">) {
  const { id } = await params;

  return <div>Fiche produit — {id}</div>;
}
