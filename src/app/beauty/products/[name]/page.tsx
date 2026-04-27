"use client";

import { use } from "react";
import BeautyPage from "../../page";

export default function BeautyProductDetailPage({ params }: { params: Promise<{ name: string }> }) {
  const resolvedParams = use(params);
  const decodedName = decodeURIComponent(resolvedParams.name);
  return <BeautyPage defaultQuery={decodedName} />;
}
