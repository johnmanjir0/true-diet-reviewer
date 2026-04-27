"use client";

import Link from "next/link";
import { Sparkles, Heart, Zap, Stethoscope, ArrowRight, ShieldCheck, MessageSquare, ZapOff } from "lucide-react";
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
          background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
          borderBottom: "1px solid #f1f5f9"
        }}>
          <div className="container animate-fade-in">
            <div style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "0.5rem", 
              background: "rgba(14, 165, 233, 0.1)", 
              color: "var(--primary)",
              padding: "0.5rem 1rem",
              borderRadius: "99px",
              fontSize: "0.85rem",
              fontWeight: "700",
              marginBottom: "2rem"
            }}>
              <Sparkles size={16} /> AI口コミ解析ポータル
            </div>
            <h1 style={{ 
              fontSize: "3.2rem", 
              fontWeight: "900", 
              letterSpacing: "-0.02em", 
              lineHeight: "1.2",
              marginBottom: "1.5rem",
              background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              AIによる口コミ・ステマ解析<br />総合ポータル
            </h1>
            
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
               AIが口コミの本音と成分リスクを冷静に解析。納得の商品選びと、毎日の安心を強力にサポートします。
            </p>
          </div>
        </section>

        {/* ツール選択セクション */}
        <section className="container" style={{ marginTop: "4rem", marginBottom: "6rem" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            
            {/* --- ショッピング＆レビュー（ポジティブな選択） --- */}
            <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#475569", marginBottom: "1.8rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Sparkles size={20} color="var(--primary)" /> ショッピング・レビュー解析
            </h2>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
              gap: "2rem",
              marginBottom: "5rem"
            }}>
              {/* ダイエット解析 */}
              <Link href="/diet" style={{ textDecoration: "none" }}>
                <div className="glass-panel" style={{ 
                  height: "100%", 
                  padding: "2.5rem", 
                  transition: "all 0.3s",
                  cursor: "pointer",
                  border: "1px solid rgba(14, 165, 233, 0.2)",
                  background: "linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)",
                }} onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "var(--shadow-lg)"; }} onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}>
                  <div style={{ background: "#fef9c3", width: "50px", height: "50px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                    <Zap color="#ca8a04" size={28} style={{ margin: "auto" }} />
                  </div>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#0f172a", marginBottom: "0.8rem" }}>ダイエット解析</h3>
                  <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                    サプリのステマ度や実際の減量効果、解約トラブルの有無を徹底判定。購入前の必須チェック。
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
                  transition: "all 0.3s",
                  cursor: "pointer",
                  border: "1px solid rgba(236, 72, 153, 0.2)",
                  background: "linear-gradient(135deg, #ffffff 0%, #fff1f2 100%)",
                }} onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "var(--shadow-lg)"; }} onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}>
                  <div style={{ background: "#fce7f3", width: "50px", height: "50px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                    <Heart color="#db2777" size={28} style={{ margin: "auto" }} />
                  </div>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#0f172a", marginBottom: "0.8rem" }}>美容・コスメ解析</h3>
                  <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                    美容液やコスメの成分適合性や、SNSでの過剰評価をAIが冷静に分析。あなたの肌に最適か。
                  </p>
                  <div style={{ color: "#db2777", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    ツールを使う <ArrowRight size={18} />
                  </div>
                </div>
              </Link>
            </div>

            {/* --- リスク管理・安全（守りの診断） --- */}
            <div style={{ background: "#f8fafc", padding: "3rem", borderRadius: "32px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "2rem" }}>
                <div style={{ flex: "1", minWidth: "300px" }}>
                  <h2 style={{ fontSize: "1.8rem", fontWeight: "900", color: "#0f172a", marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: "0.7rem" }}>
                    <ShieldCheck size={28} color="#16a34a" /> 健康・安全を守る
                  </h2>
                  <p style={{ color: "#64748b", lineHeight: "1.8", marginBottom: "2rem" }}>
                    薬やサプリメントは、組み合わせによって思わぬ副作用を引き起こすことがあります。
                    AIが薬学データベースを元に、あなたの体へのリスクを客観的に判定します。
                  </p>
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <div style={{ fontSize: "0.85rem", background: "#fff", padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0", color: "#475569", fontWeight: "600" }}>✓ 飲み合わせ診断</div>
                    <div style={{ fontSize: "0.85rem", background: "#fff", padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0", color: "#475569", fontWeight: "600" }}>✓ 副作用リスク予測</div>
                  </div>
                </div>

                <div style={{ flex: "0 1 380px" }}>
                  <Link href="/health" style={{ textDecoration: "none" }}>
                    <div className="glass-panel" style={{ 
                      padding: "2rem", 
                      transition: "all 0.3s",
                      cursor: "pointer",
                      border: "2px solid #16a34a",
                      background: "white",
                      boxShadow: "0 20px 25px -5px rgba(22, 163, 74, 0.1)"
                    }} onMouseOver={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }} onMouseOut={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>
                      <div style={{ background: "#dcfce7", width: "50px", height: "50px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                        <Stethoscope color="#16a34a" size={28} style={{ margin: "auto" }} />
                      </div>
                      <span style={{ fontSize: "0.75rem", fontWeight: "900", background: "#ecfdf5", color: "#059669", padding: "0.2rem 0.6rem", borderRadius: "99px", marginBottom: "1rem", display: "inline-block" }}>SAFETY ANALYSIS</span>
                      <h3 style={{ fontSize: "1.4rem", fontWeight: "900", color: "#0f172a", marginBottom: "0.8rem" }}>健康・飲み合わせ判定</h3>
                      <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                        常用薬がある方や、複数のサプリを検討中の方へ。AIによる即時リスク判定。
                      </p>
                      <button style={{ width: "100%", background: "#16a34a", color: "white", border: "none", padding: "0.8rem", borderRadius: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                        安全性を確認する <ArrowRight size={18} />
                      </button>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 信頼性セクション */}
        <section style={{ padding: "5rem 1.5rem", background: "white", borderTop: "1px solid #f1f5f9" }}>
          <div className="container">
            <h2 style={{ fontSize: "2rem", fontWeight: "900", textAlign: "center", marginBottom: "3rem" }}>なぜ、AI解析なのか？</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem" }}>
              <div style={{ display: "flex", gap: "1rem" }}>
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
                    AIが「宣伝用のアカウント」や「不自然に肯定的なフレーズ」を言語解析し、ステマの可能性を可視化します。
                  </p>
                </div>
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
