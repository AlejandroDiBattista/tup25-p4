import { notFound } from "next/navigation";

import { PurchaseDetailClient } from "@/components/purchases/PurchaseDetailClient";

interface PurchaseDetailPageProps {
  params: { id: string };
}

export default function PurchaseDetailPage({
  params,
}: PurchaseDetailPageProps): JSX.Element {
  const purchaseId = Number(params.id);

  if (Number.isNaN(purchaseId) || purchaseId <= 0) {
    notFound();
  }

  return <PurchaseDetailClient purchaseId={purchaseId} />;
}

