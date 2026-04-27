"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav style={{ 
      display: "flex", 
      alignItems: "center", 
      gap: "0.5rem", 
      fontSize: "0.85rem", 
      color: "#64748b",
      marginBottom: "1.5rem",
      flexWrap: "wrap"
    }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "#64748b" }}>
        <Home size={16} />
      </Link>
      
      {items.map((item, index) => (
        <div key={index} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <ChevronRight size={14} color="#cbd5e1" />
          {item.href ? (
            <Link href={item.href} style={{ textDecoration: "none", color: "#64748b", fontWeight: "600" }}>
              {item.label}
            </Link>
          ) : (
            <span style={{ fontWeight: "700", color: "#0f172a" }}>{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
