import { notFound } from "next/navigation";

import { PurchaseDetailClient } from "@/components/purchases/PurchaseDetailClient";

interface PurchaseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PurchaseDetailPage({
  params,
}: PurchaseDetailPageProps): Promise<JSX.Element> {
  const { id } = await params;
  const purchaseId = Number(id);

  if (Number.isNaN(purchaseId) || purchaseId <= 0) {
    notFound();
  }

  return <PurchaseDetailClient purchaseId={purchaseId} />;
}

