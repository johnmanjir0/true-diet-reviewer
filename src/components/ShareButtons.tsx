"use client";
import { Share2, Copy, Check } from "lucide-react";
import { useState } from "react";

const LINE_ICON = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" fill="currentColor">
    <path d="M24 4C13 4 4 11.6 4 21c0 5.8 3.4 10.9 8.7 14.1-.4 1.4-1.4 5.1-1.6 5.9-.2.9.4 1 .9.7.4-.2 5.7-3.8 8-5.3 1.3.2 2.6.3 4 .3 11 0 20-7.6 20-17S35 4 24 4z"/>
  </svg>
);

export default function ShareButtons({
  productName,
  riskLevel,
  verdict,
  tool,
}: {
  productName: string;
  riskLevel: string;
  verdict: string;
  tool: "diet" | "beauty" | "health";
}) {
  const [copied, setCopied] = useState(false);

  const toolLabel = tool === "diet" ? "ダイエット解析" : tool === "beauty" ? "美容解析" : "飲み合わせ判定";
  const emoji = riskLevel === "危険" ? "🚨" : riskLevel === "要注意" ? "⚠️" : "✅";
  const url = `https://truereview-ai.vercel.app/${tool}?q=${encodeURIComponent(productName)}`;

  const xText = `${emoji}【AI${toolLabel}】「${productName}」\n判定：${riskLevel}\n${verdict}\n\n詳細はこちら👇\n${url}\n#TrueReviewAI #ステマ判定`;
  const lineText = `${emoji} 「${productName}」のAI解析結果\n判定：${riskLevel}\n${verdict}\n${url}`;

  const shareX = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(xText)}`, "_blank");
  };

  const shareLine = () => {
    window.open(`https://line.me/R/share?text=${encodeURIComponent(lineText)}`, "_blank");
  };

  const copyUrl = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ marginTop: "2rem", padding: "1.5rem", background: "#f8fafc", borderRadius: "20px", border: "1px solid #e2e8f0" }}>
      <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "#64748b", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <Share2 size={16} /> この解析結果をシェアする
      </p>
      <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
        <button
          onClick={shareX}
          style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            background: "#0f172a", color: "#fff",
            border: "none", borderRadius: "12px",
            padding: "0.6rem 1.2rem", fontSize: "0.9rem", fontWeight: "700",
            cursor: "pointer", transition: "opacity 0.2s"
          }}
          onMouseOver={e => (e.currentTarget.style.opacity = "0.8")}
          onMouseOut={e => (e.currentTarget.style.opacity = "1")}
        >
          <span style={{ fontWeight: "900", fontSize: "1rem" }}>𝕏</span> Xでシェア
        </button>

        <button
          onClick={shareLine}
          style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            background: "#06C755", color: "#fff",
            border: "none", borderRadius: "12px",
            padding: "0.6rem 1.2rem", fontSize: "0.9rem", fontWeight: "700",
            cursor: "pointer", transition: "opacity 0.2s"
          }}
          onMouseOver={e => (e.currentTarget.style.opacity = "0.8")}
          onMouseOut={e => (e.currentTarget.style.opacity = "1")}
        >
          <LINE_ICON /> LINEで送る
        </button>

        <button
          onClick={copyUrl}
          style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            background: copied ? "#16a34a" : "#fff", color: copied ? "#fff" : "#475569",
            border: "1px solid #e2e8f0", borderRadius: "12px",
            padding: "0.6rem 1.2rem", fontSize: "0.9rem", fontWeight: "700",
            cursor: "pointer", transition: "all 0.2s"
          }}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "コピー完了！" : "URLをコピー"}
        </button>
      </div>
    </div>
  );
}
