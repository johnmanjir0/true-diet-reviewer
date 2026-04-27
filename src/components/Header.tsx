"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header style={{ 
      background: "rgba(255, 255, 255, 0.8)", 
      backdropFilter: "blur(12px)", 
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(226, 232, 240, 0.5)", 
      padding: "0.8rem 1.5rem", 
      position: "sticky", 
      top: 0, 
      zIndex: 1000,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
    }}>
      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <div style={{ background: "linear-gradient(135deg, var(--primary) 0%, #3b82f6 100%)", padding: "0.4rem", borderRadius: "10px", display: "flex" }}>
          <Sparkles color="#fff" size={20} />
        </div>
        <span style={{ fontSize: "1.4rem", fontWeight: "900", color: "#0f172a", letterSpacing: "-0.02em" }}>TrueReview <span style={{ color: "var(--primary)" }}>AI</span></span>
      </Link>
      
      <nav style={{ display: "flex", gap: "1.2rem", alignItems: "center" }}>
        <Link href="/diet" className="nav-link">ダイエット</Link>
        <Link href="/beauty" className="nav-link">美容</Link>
        <Link href="/health" className="nav-link">健康・飲み合わせ</Link>
      </nav>

      <style jsx>{`
        .nav-link {
          text-decoration: none;
          color: #475569;
          font-weight: 700;
          font-size: 0.9rem;
          transition: all 0.2s;
          padding: 0.5rem 0.8rem;
          border-radius: 8px;
        }
        .nav-link:hover {
          color: var(--primary);
          background: rgba(14, 165, 233, 0.08);
        }
        @media (max-width: 640px) {
          .nav-link { font-size: 0.8rem; padding: 0.4rem 0.5rem; }
        }
      `}</style>
    </header>
  );
}
