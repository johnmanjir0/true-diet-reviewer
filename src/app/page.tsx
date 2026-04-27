import Link from "next/link";
import { Sparkles, Heart, Zap, Stethoscope, ArrowRight, ShieldCheck, MessageSquare } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PortalHome() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      
      <main style={{ flex: 1 }}>
        {/* ヒーローセクション */}
        <section style={{ 
          padding: "5rem 1.5rem", 
          textAlign: "center", 
          background: "linear-gradient(180deg, #fff 0%, var(--background) 100%)" 
        }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "0.5rem", 
              background: "rgba(14, 165, 233, 0.1)", 
              color: "var(--primary)", 
              padding: "0.5rem 1.2rem", 
              borderRadius: "99px", 
              fontSize: "0.9rem", 
              fontWeight: "700",
              marginBottom: "1.5rem"
            }}>
              <Sparkles size={16} /> AI口コミ解析ポータル
            </div>
            <h1 style={{ 
              fontSize: "3.5rem", 
              fontWeight: "900", 
              letterSpacing: "-0.04em", 
              lineHeight: "1.1",
              marginBottom: "1.5rem",
              background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              ネットの情報の「真実」を<br />AIがリアルタイムに可視化
            </h1>
            
            {/* 統計セクション（信頼感の演出） */}
            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              gap: "2rem", 
              marginBottom: "3rem", 
              flexWrap: "wrap" 
            }}>
              <div style={statStyle}>
                <span style={statNumStyle}>24/7</span>
                <span style={statLabelStyle}>AI常時監視</span>
              </div>
              <div style={statStyle}>
                <span style={statNumStyle}>10万+</span>
                <span style={statLabelStyle}>学習データ量</span>
              </div>
              <div style={statStyle}>
                <span style={statNumStyle}>100%</span>
                <span style={statLabelStyle}>第三者解析</span>
              </div>
            </div>

            <p style={{ fontSize: "1.2rem", color: "#64748b", maxWidth: "600px", margin: "0 auto 2.5rem", lineHeight: "1.6" }}>
              ステマ、誇大広告、定期縛り。ダイエット・美容・健康のあらゆる不安を、最新のAIが中立的な視点で解析します。
            </p>
          </div>
        </section>

        <section className="container" style={{ marginTop: "-3rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
            
            {/* ダイエット解析 */}
            <Link href="/diet" style={{ textDecoration: "none" }}>
              <div className="glass-panel" style={{ 
                height: "100%", 
                padding: "2.5rem", 
                transition: "transform 0.3s, box-shadow 0.3s",
                cursor: "pointer",
                border: "1px solid rgba(234, 179, 8, 0.2)",
              }} onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-10px)"; }} onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ background: "#fef9c3", width: "50px", height: "50px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                  <Zap color="#ca8a04" size={28} style={{ margin: "auto" }} />
                </div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#0f172a", marginBottom: "0.8rem" }}>ダイエット解析</h3>
                <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                  サプリのステマ度や実際の減量効果、解約トラブルの有無を徹底判定。
                </p>
                <div style={{ color: "var(--primary)", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  ツールを使う <ArrowRight size={18} />
                </div>
              </div>
            </Link>

            {/* 美容・コスメ解析 */}
            <Link href="/beauty" style={{ textDecoration: "none" }}>
              <div className="glass-panel" style={{ 
                height: "100%", 
                padding: "2.5rem", 
                transition: "transform 0.3s, box-shadow 0.3s",
                cursor: "pointer",
                border: "1px solid rgba(236, 72, 153, 0.2)",
              }} onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-10px)"; }} onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ background: "#fce7f3", width: "50px", height: "50px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                  <Heart color="#db2777" size={28} style={{ margin: "auto" }} />
                </div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#0f172a", marginBottom: "0.8rem" }}>美容・コスメ解析</h3>
                <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                  美容液やコスメの成分適合性や、SNSでの過剰評価をAIが冷静に分析。
                </p>
                <div style={{ color: "var(--primary)", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  ツールを使う <ArrowRight size={18} />
                </div>
              </div>
            </Link>

            {/* 健康・飲み合わせ判定 */}
            <Link href="/health" style={{ textDecoration: "none" }}>
              <div className="glass-panel" style={{ 
                height: "100%", 
                padding: "2.5rem", 
                transition: "transform 0.3s, box-shadow 0.3s",
                cursor: "pointer",
                border: "1px solid rgba(34, 197, 94, 0.2)",
              }} onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-10px)"; }} onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ background: "#dcfce7", width: "50px", height: "50px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                  <Stethoscope color="#16a34a" size={28} style={{ margin: "auto" }} />
                </div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#0f172a", marginBottom: "0.8rem" }}>健康・飲み合わせ</h3>
                <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                  薬とサプリの飲み合わせリスクや、副作用のリアルな声をAIが抽出。
                </p>
                <div style={{ color: "var(--primary)", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  ツールを使う <ArrowRight size={18} />
                </div>
              </div>
            </Link>

          </div>
        </section>

        {/* 信頼性セクション */}
        <section style={{ padding: "5rem 1.5rem", background: "white", marginTop: "4rem" }}>
          <div className="container">
            <h2 style={{ fontSize: "2rem", fontWeight: "900", textAlign: "center", marginBottom: "3rem" }}>なぜ、AI解析なのか？</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>
              <div>
                <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
                  <ShieldCheck size={40} color="var(--primary)" style={{ flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "0.5rem" }}>中立的な解析アルゴリズム</h4>
                    <p style={{ color: "#64748b", lineHeight: "1.8" }}>
                      特定のメーカーや広告代理店からの報酬を受け取らず、WEB上の膨大なリアル口コミをAIが客観的に処理します。
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <MessageSquare size={40} color="var(--primary)" style={{ flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "0.5rem" }}>ステマ特有の言語パターンを検出</h4>
                    <p style={{ color: "#64748b", lineHeight: "1.8" }}>
                      AIが「宣伝用のアカウント」や「不自然に肯定的なフレーズ」を言語解析。ステマの可能性を数値で可視化します。
                    </p>
                  </div>
                </div>
              </div>
              <div style={{ 
                background: "linear-gradient(135deg, var(--primary) 0%, #3b82f6 100%)", 
                borderRadius: "32px", 
                padding: "2.5rem", 
                color: "white" 
              }}>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "900", marginBottom: "1.5rem" }}>納得のいく選択を、AIと共に。</h3>
                <p style={{ fontSize: "1.1rem", lineHeight: "1.8", opacity: "0.9" }}>
                  私たちは、消費者が正しい情報に基づいて自分にぴったりの商品を選べる世界を目指しています。
                  広告の言葉ではなく、実際に使用した人々の「本音」にフォーカスした解析をお届けします。
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

const statStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "rgba(255, 255, 255, 0.5)",
  padding: "1rem 1.5rem",
  borderRadius: "16px",
  minWidth: "120px",
  border: "1px solid rgba(226, 232, 240, 0.8)",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02)"
} as const;

const statNumStyle = {
  fontSize: "1.5rem",
  fontWeight: "900",
  color: "#0f172a",
  lineHeight: "1"
} as const;

const statLabelStyle = {
  fontSize: "0.75rem",
  fontWeight: "700",
  color: "#94a3b8",
  marginTop: "0.4rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em"
} as const;
