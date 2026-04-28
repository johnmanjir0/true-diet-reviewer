import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";
import { Trophy, AlertTriangle, ShieldCheck, TrendingUp } from "lucide-react";

const dangerRankings = [
  { rank: 1, name: "極端な痩身を謳う初回99円サプリ", risk: "危険", score: 92, reason: "定期縛り・誇大広告・解約困難の三重リスク" },
  { rank: 2, name: "芸能人・インフルエンサー絶賛系コスメ", risk: "危険", score: 88, reason: "ステマ投稿が多く、効果の科学的根拠が乏しい" },
  { rank: 3, name: "「〇週間で-◯kg保証」ダイエット食品", risk: "危険", score: 85, reason: "薬機法違反の疑いある表現が多用されている" },
  { rank: 4, name: "SNS限定販売の美容ドリンク", risk: "要注意", score: 74, reason: "成分の裏付けデータが不明確なことが多い" },
  { rank: 5, name: "夜寝るだけで痩せるサプリ", risk: "要注意", score: 71, reason: "過度な効果を謳う広告表現がパターン化している" },
];

const safeRankings = [
  { rank: 1, name: "機能性表示食品（届出済み）", score: 88, reason: "消費者庁への科学的根拠の届出が義務付けられている" },
  { rank: 2, name: "医薬品・第三類医薬品", score: 85, reason: "国の審査を経た成分・用量・効能が保証されている" },
  { rank: 3, name: "大手メーカーの特定保健用食品（トクホ）", score: 82, reason: "消費者庁の審査・許可を受けた健康機能の表示" },
  { rank: 4, name: "大学・研究機関との共同開発品", score: 78, reason: "第三者機関による臨床試験データが公開されている" },
  { rank: 5, name: "ドラッグストア主要ブランドのサプリ", score: 72, reason: "GMP認証工場での製造・成分の透明性が高い" },
];

const ingredientRankings = [
  { name: "コエンザイムQ10", evidence: "high", effect: "抗酸化・エネルギー産生", note: "心臓病患者への効果は実証済み。美容効果の根拠は限定的" },
  { name: "ヒアルロン酸（内服）", evidence: "medium", effect: "関節・保湿", note: "関節痛への効果は一定の根拠あり。美肌効果は経口摂取での実証が困難" },
  { name: "ビタミンC", evidence: "high", effect: "抗酸化・免疫・コラーゲン合成", note: "科学的根拠が非常に豊富。過剰摂取には注意" },
  { name: "プロバイオティクス（乳酸菌）", evidence: "medium", effect: "腸内環境改善", note: "株によって効果が異なる。整腸作用は根拠あり" },
  { name: "L-カルニチン", evidence: "low", effect: "脂肪燃焼（理論上）", note: "健常者への脂肪燃焼効果は限定的。アスリートへの効果は一定の根拠あり" },
];

const evidenceBadge = (e: string) => {
  const map: Record<string, { color: string; label: string }> = {
    high: { color: "#16a34a", label: "根拠 高" },
    medium: { color: "#d97706", label: "根拠 中" },
    low: { color: "#dc2626", label: "根拠 低" },
  };
  return map[e] || map.medium;
};

export default function RankingPage() {
  return (
    <>
      <Header />
      <main className="container">
        <div className="glass-panel" style={{ marginTop: "2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <Trophy size={40} color="#f59e0b" style={{ marginBottom: "1rem" }} />
            <h1 className="title">AI解析ランキング</h1>
            <p className="subtitle">AIが分析した、知っておくべき健康・美容商品の傾向まとめ</p>
          </div>

          {/* ステマ危険度ランキング */}
          <section style={{ marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: "900", color: "#0f172a", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <AlertTriangle color="#dc2626" size={24} /> ステマ・誇大広告リスクが高い商品カテゴリー
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.5rem" }}>※特定商品ではなくカテゴリー傾向の分析です</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {dangerRankings.map(item => (
                <div key={item.rank} style={{ display: "flex", alignItems: "center", gap: "1rem", background: item.rank <= 3 ? "#fff5f5" : "#fff", border: `1px solid ${item.rank <= 3 ? "#fecaca" : "#e2e8f0"}`, borderRadius: "16px", padding: "1rem 1.5rem" }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: "900", color: item.rank === 1 ? "#dc2626" : item.rank === 2 ? "#d97706" : "#64748b", minWidth: "2rem", textAlign: "center" }}>
                    {item.rank}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "800", color: "#0f172a", marginBottom: "0.2rem" }}>{item.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{item.reason}</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "1.2rem", fontWeight: "900", color: "#dc2626" }}>{item.score}</div>
                    <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>リスクスコア</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 信頼度が高いカテゴリー */}
          <section style={{ marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: "900", color: "#0f172a", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <ShieldCheck color="#16a34a" size={24} /> 信頼度・透明性が高い商品カテゴリー
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.5rem" }}>制度・認証・根拠に基づく信頼性の評価</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {safeRankings.map(item => (
                <div key={item.rank} style={{ display: "flex", alignItems: "center", gap: "1rem", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "16px", padding: "1rem 1.5rem" }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: "900", color: item.rank === 1 ? "#16a34a" : item.rank === 2 ? "#0ea5e9" : "#64748b", minWidth: "2rem", textAlign: "center" }}>
                    {item.rank}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "800", color: "#0f172a", marginBottom: "0.2rem" }}>{item.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{item.reason}</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "1.2rem", fontWeight: "900", color: "#16a34a" }}>{item.score}</div>
                    <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>信頼スコア</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 成分エビデンスランキング */}
          <section style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: "900", color: "#0f172a", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <TrendingUp color="#0ea5e9" size={24} /> よく使われる成分のエビデンス評価
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.5rem" }}>科学論文・臨床試験データに基づく成分の信頼性評価</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {ingredientRankings.map(item => {
                const badge = evidenceBadge(item.evidence);
                return (
                  <div key={item.name} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "1rem 1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem" }}>
                          <span style={{ fontWeight: "800", color: "#0f172a" }}>{item.name}</span>
                          <span style={{ fontSize: "0.7rem", fontWeight: "800", background: badge.color, color: "#fff", padding: "0.1rem 0.5rem", borderRadius: "99px" }}>{badge.label}</span>
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#0ea5e9", fontWeight: "700", marginBottom: "0.2rem" }}>期待効果: {item.effect}</div>
                        <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{item.note}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <div style={{ textAlign: "center", padding: "2rem", background: "#f8fafc", borderRadius: "20px" }}>
            <p style={{ fontWeight: "700", color: "#0f172a", marginBottom: "1rem" }}>気になる商品を今すぐAIで解析してみましょう</p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/diet" style={{ background: "var(--primary)", color: "#fff", padding: "0.7rem 1.5rem", borderRadius: "12px", textDecoration: "none", fontWeight: "700", fontSize: "0.9rem" }}>ダイエット解析</Link>
              <Link href="/beauty" style={{ background: "#db2777", color: "#fff", padding: "0.7rem 1.5rem", borderRadius: "12px", textDecoration: "none", fontWeight: "700", fontSize: "0.9rem" }}>美容解析</Link>
              <Link href="/health" style={{ background: "#16a34a", color: "#fff", padding: "0.7rem 1.5rem", borderRadius: "12px", textDecoration: "none", fontWeight: "700", fontSize: "0.9rem" }}>飲み合わせ判定</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
