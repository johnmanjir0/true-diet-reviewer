"use client";

import { use } from "react";
import HealthPage from "../../page";

export default function HealthProductDetailPage({ params }: { params: Promise<{ name: string }> }) {
  const resolvedParams = use(params);
  const decodedName = decodeURIComponent(resolvedParams.name);
  return <HealthPage defaultQuery={decodedName} />;
}
