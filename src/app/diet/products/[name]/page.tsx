"use client";

import { use } from "react";
import DietPage from "../../page";

export default function ProductDetailPage({ params }: { params: Promise<{ name: string }> }) {
  const resolvedParams = use(params);
  const decodedName = decodeURIComponent(resolvedParams.name);
  
  // DietPage component can take an optional initialQuery prop or we can just pass it via q param
  // For simplicity, we just reuse the DietPage logic which already reads q from URL.
  // But wait, if we are at /diet/products/name, the DietPage which reads searchParams won't find q.
  // Let's refactor DietPage to accept a default query.
  
  return <DietPage defaultQuery={decodedName} />;
}
