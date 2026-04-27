import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ 
      marginTop: "6rem", 
      padding: "4rem 1.5rem", 
      background: "white", 
      borderTop: "1px solid #e2e8f0" 
    }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "3rem", marginBottom: "4rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.2rem" }}>
              <div style={{ background: "var(--primary)", padding: "0.3rem", borderRadius: "8px", display: "flex" }}>
                <Sparkles color="#fff" size={16} />
              </div>
              <span style={{ fontSize: "1.2rem", fontWeight: "900", color: "#0f172a" }}>TrueReview AI</span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: "1.8" }}>
              AI技術を用いてネット上の膨大なデータを解析し、中立な視点での商品レビューを提供する日本最大級の解析ポータルメディアです。
            </p>
          </div>
          
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: "800", marginBottom: "1.2rem", color: "#0f172a" }}>メインツール</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <Link href="/diet" style={footerLinkStyle}>ダイエット解析</Link>
              <Link href="/beauty" style={footerLinkStyle}>美容・コスメ解析</Link>
              <Link href="/health" style={footerLinkStyle}>健康・飲み合わせ判定</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: "800", marginBottom: "1.2rem", color: "#0f172a" }}>サポート</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <Link href="/about" style={footerLinkStyle}>解析AIについて</Link>
              <Link href="/contact" style={footerLinkStyle}>お問い合わせ</Link>
              <Link href="/privacy" style={footerLinkStyle}>プライバシーポリシー</Link>
              <Link href="/terms" style={footerLinkStyle}>利用規約</Link>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "2rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.75rem", color: "#94a3b8", lineHeight: "2", maxWidth: "800px", margin: "0 auto 1.5rem" }}>
            【免責事項】当サイトの分析結果はAIアルゴリズムによる自動生成であり、情報の完全性、正確性、有用性を保証するものではありません。
            特にお薬やサプリメントの服用に関しては、必ず医師・薬剤師等の専門家にご相談ください。当サイトの利用により生じた一切の損害について責任を負いかねます。
          </p>
          <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "#cbd5e1" }}>© 2026 TrueReview AI Portal Produced by Team Antigravity</p>
        </div>
      </div>
    </footer>
  );
}

const footerLinkStyle = {
  fontSize: "0.85rem",
  color: "#64748b",
  textDecoration: "none",
  fontWeight: "600",
  transition: "color 0.2s"
} as const;
