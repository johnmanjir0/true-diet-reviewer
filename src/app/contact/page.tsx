import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="container">
        <div className="glass-panel" style={{ marginTop: "2rem" }}>
          <h1 className="title">お問い合わせ</h1>
          <p className="subtitle">ご意見、不具合報告、お仕事のご依頼はこちら</p>

          <div style={{ marginTop: "3rem", textAlign: "center", padding: "3rem", background: "#f8fafc", borderRadius: "24px" }}>
            <div style={{ background: "#fff", width: "60px", height: "60px", borderRadius: "50%", display: "flex", alignItems: "center", justifyCenter: "center", margin: "0 auto 1.5rem", boxShadow: "var(--shadow-sm)" }}>
              <Mail color="var(--primary)" size={32} style={{ margin: "auto" }} />
            </div>
            <p style={{ color: "#475569", fontSize: "1.1rem", marginBottom: "1.5rem" }}>
              解析のリクエストや、掲載情報の修正依頼なども承っております。<br />
              以下のメールアドレスまでご連絡ください。
            </p>
            <a href="mailto:info@true-diet-reviewer.vercel.app" style={{ 
              fontSize: "1.5rem", 
              fontWeight: "900", 
              color: "var(--primary)", 
              textDecoration: "none",
              borderBottom: "2px solid var(--primary)"
            }}>
              info@truereview-ai.com
            </a>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "2rem" }}>
              ※通常、3営業日以内にご返信いたします。
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
