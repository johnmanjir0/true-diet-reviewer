"use client";

import { useState, useEffect } from "react";
import { Search, ShieldAlert, AlertTriangle, ShieldCheck, ThumbsUp, ThumbsDown, Activity, Sparkles, DollarSign, HeartPulse, ShoppingCart } from "lucide-react";

interface Scores {
  stemaRisk: number;
  effectiveness: number;
  costPerformance: number;
  healthRisk: number;
  continuation: number;
}

interface AnalysisResult {
  productName: string;
  scores: Scores;
  riskLevel: "安全" | "注意" | "危険";
  prosSummary: string[];
  consSummary: string[];
  warningPoints: string[];
  adRatio: number;
  imageUrl?: string;
  subscriptionRisk?: { hasSubscription: boolean; notes: string; };
  yakukiho?: { hasViolation: boolean; violationWords: string[]; riskLevel: string; };
  ingredients?: { name: string; evidence: string; note: string; }[];
}

export default function Home() {
  const searchParams = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search)
    : null;
  const initialQuery = searchParams?.get('q') || '';

  const [mode, setMode] = useState<"single" | "compare">("single");
  const [query, setQuery] = useState(initialQuery);
  const [compareQuery, setCompareQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [compareResult, setCompareResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rakutenItems, setRakutenItems] = useState<any[]>([]);

  // URLパラメータ ?q=商品名 があれば自動解析
  useEffect(() => {
    if (initialQuery) {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      setTimeout(() => handleSearch(fakeEvent), 300);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (mode === "compare" && !compareQuery.trim()) return;

    setLoading(true);
    setResult(null);
    setCompareResult(null);
    setError(null);
    setRakutenItems([]);

    try {
      if (mode === "compare") {
        // 2商品を並行解析
        const [res1, res2] = await Promise.all([
          fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productName: query }) }),
          fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productName: compareQuery }) }),
        ]);
        const [data1, data2] = await Promise.all([res1.json(), res2.json()]);
        if (!res1.ok) throw new Error(data1.error || "商品Aの取得に失敗しました。");
        if (!res2.ok) throw new Error(data2.error || "商品Bの取得に失敗しました。");
        setResult(data1);
        setCompareResult(data2);
      } else {
        // 単品解析
        const [analysisResponse, rakutenResponse] = await Promise.all([
          fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productName: query }),
          }),
          fetch(`/api/rakuten?keyword=${encodeURIComponent(query)}`),
        ]);
        const data = await analysisResponse.json();
        if (!analysisResponse.ok) throw new Error(data.error || "情報の取得に失敗しました。");
        setResult(data);
        const rakutenData = await rakutenResponse.json();
        if (rakutenData.items) setRakutenItems(rakutenData.items);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskClass = (level: string) => {
    if (level === "安全") return "safe";
    if (level === "危険") return "danger";
    return "warning";
  };

  const RiskIcon = ({ level }: { level: string }) => {
    if (level === "安全") return <ShieldCheck size={24} />;
    if (level === "危険") return <ShieldAlert size={24} />;
    return <AlertTriangle size={24} />;
  };

  const ScoreBar = ({ label, score, type, icon: Icon }: { label: string, score: number, type: 'positive' | 'negative', icon: any }) => (
    <div className={`score-card score-${type}`}>
      <div className="score-header">
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Icon size={18} /> {label}</span>
        <span className="score-value">{score}<span style={{ fontSize: '1rem', color: '#94a3b8' }}>/100</span></span>
      </div>
      <div className="progress-bg">
        <div className="progress-fill" style={{ width: `${score}%` }}></div>
      </div>
    </div>
  );

  return (
    <main className="container">
      <div className="glass-panel" style={{ marginTop: "2rem" }}>
        <h1 className="title">TrueDiet Reviewer</h1>
        <p className="subtitle" style={{ marginBottom: "1rem" }}>AIによる多角的ステマ・口コミ判定ツール</p>

        {/* サイト説明文（SEO兼ねた紹介文） */}
        <div style={{ background: "rgba(14,165,233,0.06)", border: "1px solid rgba(14,165,233,0.2)", borderRadius: "16px", padding: "1.5rem", marginBottom: "1.5rem", lineHeight: "1.8", color: "#334155", fontSize: "0.95rem" }}>
          <p style={{ marginBottom: "0.8rem" }}>
            「このダイエットサプリ、本当に効くの？」「口コミが良すぎて逆に怪しい…」
            そんな疑問をお持ちの方のために作られた、<strong>AIが口コミをリアルタイム解析して本音を暴くツール</strong>です。
          </p>
          <p style={{ marginBottom: "0.8rem" }}>
            商品名を入力するだけで、WEB上の口コミ・レビューをAIが自動収集し、
            <strong>「ステマ危険度」「効果の信頼性」「コスパ」「健康リスク」「定期縛りの有無」</strong>など
            6つの視点で徹底分析します。高額なダイエット商品の購入前に、ぜひ一度ご活用ください。
          </p>
          <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
            ※ステマ（ステルスマーケティング）とは：企業から報酬をもらいながら、一般客を装って商品を絶賛する「サクラ口コミ」のことです。
          </p>
        </div>

        {/* モード切替タブ */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.2rem" }}>
          <button
            type="button"
            onClick={() => setMode("single")}
            style={{ flex: 1, padding: "0.7rem", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "0.95rem", background: mode === "single" ? "var(--primary)" : "#e2e8f0", color: mode === "single" ? "#fff" : "#475569", transition: "all 0.2s" }}
          >
            🔍 単品調査
          </button>
          <button
            type="button"
            onClick={() => setMode("compare")}
            style={{ flex: 1, padding: "0.7rem", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "0.95rem", background: mode === "compare" ? "var(--primary)" : "#e2e8f0", color: mode === "compare" ? "#fff" : "#475569", transition: "all 0.2s" }}
          >
            ⚖️ 商品比較
          </button>
        </div>

        <form className="search-form" onSubmit={handleSearch} style={{ flexDirection: "column", gap: "0.8rem" }}>
          <div style={{ display: "flex", gap: "0.8rem", width: "100%", flexWrap: "wrap" }}>
            <input
              type="text"
              className="search-input"
              placeholder={mode === "compare" ? "商品A（例：ナイシトール）" : "ダイエット商品名を入力（例：〇〇サプリ）"}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
              style={{ flex: 1, minWidth: "200px" }}
            />
            {mode === "compare" && (
              <input
                type="text"
                className="search-input"
                placeholder="商品B（例：メタバリア）"
                value={compareQuery}
                onChange={(e) => setCompareQuery(e.target.value)}
                disabled={loading}
                style={{ flex: 1, minWidth: "200px" }}
              />
            )}
          </div>
          <button type="submit" className="search-button" disabled={loading || !query.trim() || (mode === "compare" && !compareQuery.trim())}>
            {loading ? <Search className="spinner" /> : <Search />}
            {loading ? "分析中..." : mode === "compare" ? "2商品を比較解析する" : "解析する"}
          </button>
        </form>

        {error && (
          <div style={{ background: "#fef2f2", color: "#b91c1c", padding: "1rem", borderRadius: "12px", border: "1px solid #fecaca", marginTop: "1rem" }}>
            {error}
          </div>
        )}

        {/* ① 比較結果テーブル */}
        {result && compareResult && mode === "compare" && (
          <div className="result-container" style={{ marginTop: "2rem" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#1e293b", marginBottom: "1.5rem", textAlign: "center" }}>⚖️ 商品比較結果</h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
                <thead>
                  <tr style={{ background: "#f1f5f9" }}>
                    <th style={{ padding: "0.8rem 1rem", textAlign: "left", borderBottom: "2px solid #e2e8f0", color: "#475569" }}>項目</th>
                    <th style={{ padding: "0.8rem 1rem", textAlign: "center", borderBottom: "2px solid #e2e8f0", color: "#0ea5e9", fontWeight: "bold" }}>🅐 {result.productName}</th>
                    <th style={{ padding: "0.8rem 1rem", textAlign: "center", borderBottom: "2px solid #e2e8f0", color: "#8b5cf6", fontWeight: "bold" }}>🅑 {compareResult.productName}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "総合判定", aVal: result.riskLevel, bVal: compareResult.riskLevel, isRisk: true },
                    { label: "ステマ危険度", aVal: result.scores.stemaRisk, bVal: compareResult.scores.stemaRisk, unit: "/100", lowerIsBetter: true },
                    { label: "効果の信頼性", aVal: result.scores.effectiveness, bVal: compareResult.scores.effectiveness, unit: "/100" },
                    { label: "コスパ満足度", aVal: result.scores.costPerformance, bVal: compareResult.scores.costPerformance, unit: "/100" },
                    { label: "副作用・健康リスク", aVal: result.scores.healthRisk, bVal: compareResult.scores.healthRisk, unit: "/100", lowerIsBetter: true },
                    { label: "継続のしやすさ", aVal: result.scores.continuation, bVal: compareResult.scores.continuation, unit: "/100" },
                    { label: "広告率（推定）", aVal: result.adRatio, bVal: compareResult.adRatio, unit: "%", lowerIsBetter: true },
                    { label: "定期購入", aVal: result.subscriptionRisk?.hasSubscription ? "⚠️ あり" : "✅ 不明/なし", bVal: compareResult.subscriptionRisk?.hasSubscription ? "⚠️ あり" : "✅ 不明/なし" },
                  ].map((row, idx) => {
                    const aNum = typeof row.aVal === "number" ? row.aVal : null;
                    const bNum = typeof row.bVal === "number" ? row.bVal : null;
                    const aWins = aNum !== null && bNum !== null && (row.lowerIsBetter ? aNum < bNum : aNum > bNum);
                    const bWins = aNum !== null && bNum !== null && (row.lowerIsBetter ? bNum < aNum : bNum > aNum);
                    return (
                      <tr key={idx} style={{ borderBottom: "1px solid #e2e8f0", background: idx % 2 === 0 ? "#fff" : "#f8fafc" }}>
                        <td style={{ padding: "0.7rem 1rem", fontWeight: "bold", color: "#475569" }}>{row.label}</td>
                        <td style={{ padding: "0.7rem 1rem", textAlign: "center", fontWeight: aWins ? "bold" : "normal", color: aWins ? "#0ea5e9" : "#334155", background: aWins ? "rgba(14,165,233,0.08)" : "transparent" }}>
                          {row.aVal}{row.unit || ""}  {aWins && "👑"}
                        </td>
                        <td style={{ padding: "0.7rem 1rem", textAlign: "center", fontWeight: bWins ? "bold" : "normal", color: bWins ? "#8b5cf6" : "#334155", background: bWins ? "rgba(139,92,246,0.08)" : "transparent" }}>
                          {row.bVal}{row.unit || ""}  {bWins && "👑"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* AI総評 */}
            <div style={{ marginTop: "1.5rem", padding: "1.2rem", background: "rgba(14,165,233,0.06)", border: "1px solid rgba(14,165,233,0.2)", borderRadius: "12px" }}>
              <p style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>🤖 AI総評</p>
              <p style={{ fontSize: "0.95rem", color: "#334155", lineHeight: "1.7" }}>
                {(() => {
                  const aScore = result.scores.effectiveness + result.scores.costPerformance + result.scores.continuation - result.scores.stemaRisk - result.scores.healthRisk;
                  const bScore = compareResult.scores.effectiveness + compareResult.scores.costPerformance + compareResult.scores.continuation - compareResult.scores.stemaRisk - compareResult.scores.healthRisk;
                  const winner = aScore > bScore ? result.productName : compareResult.productName;
                  const loser = aScore > bScore ? compareResult.productName : result.productName;
                  return `総合スコアの比較では「${winner}」の方が信頼性・コスパ・継続しやすさなどで優れており、購入候補としてはこちらがおすすめです。「${loser}」はステマや健康リスクの面で相対的に注意が必要です。最終的なご判断は、ご自身でご確認ください。`;
                })()}
              </p>
            </div>
          </div>
        )}

        {result && (
          <div className="result-container">
            
            <div className="overall-header">
              <div className={`risk-badge ${getRiskClass(result.riskLevel)}`}>
                <RiskIcon level={result.riskLevel} />
                総合判定: {result.riskLevel}
              </div>
              <div style={{ fontSize: "1rem", color: "#475569", textAlign: "left", maxWidth: "700px", lineHeight: "1.7" }}>
                {result.riskLevel === "安全" && "口コミの傾向からステマや健康リスクの可能性は低く、比較的信頼できる商品です。ただし効果には個人差がありますので、最終的なご判断はご自身でお願いいたします。"}
                {result.riskLevel === "注意" && "一部の口コミにステマの傾向や定期縛り・副作用への不安が見られます。購入前にサイトの規約や解約条件をよく確認することをおすすめします。"}
                {result.riskLevel === "危険" && "ステマの疑いが強い口コミや、健康被害・解約トラブルの報告が多数見られます。購入には十分な注意と慎重な判断が必要です。"}
              </div>
            </div>

            {/* 定期購入情報は常に表示 */}
            <div style={{ padding: "1rem", background: result.subscriptionRisk?.hasSubscription ? "#fffbeb" : "#f0fdf4", border: `1px solid ${result.subscriptionRisk?.hasSubscription ? "#fde68a" : "#bbf7d0"}`, borderRadius: "12px", color: result.subscriptionRisk?.hasSubscription ? "#92400e" : "#166534", marginBottom: "2rem", fontSize: "0.95rem" }}>
              <strong>
                {result.subscriptionRisk?.hasSubscription
                  ? <><AlertTriangle size={18} style={{ display: "inline", verticalAlign: "text-bottom", marginRight: "4px" }}/>【定期購入あり・注意】</>
                  : <><ShieldCheck size={18} style={{ display: "inline", verticalAlign: "text-bottom", marginRight: "4px" }}/>【定期購入】</>
                }
              </strong><br/>
              {result.subscriptionRisk?.notes || "定期購入に関する情報は見つかりませんでした。"}
            </div>

            {/* 色の凡例 */}
            <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1rem", fontSize: "0.85rem", color: "#64748b" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ display: "inline-block", width: "24px", height: "10px", borderRadius: "5px", background: "linear-gradient(90deg, #34d399, #10b981)" }}></span>
                緑＝高いほど良い
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ display: "inline-block", width: "24px", height: "10px", borderRadius: "5px", background: "linear-gradient(90deg, #fbbf24, #ef4444)" }}></span>
                赤＝高いほど危険・注意
              </span>
            </div>

            {/* スコア 左右2列レイアウト */}
            <div className="scores-two-col">
              {/* 左列：良い指標 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <ScoreBar label="効果の信頼性" score={result.scores.effectiveness} type="positive" icon={Sparkles} />
                <ScoreBar label="コスパ満足度" score={result.scores.costPerformance} type="positive" icon={DollarSign} />
                <ScoreBar label="継続のしやすさ" score={result.scores.continuation} type="positive" icon={Activity} />
              </div>
              {/* 右列：リスク指標 */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <ScoreBar label="ステマ危険度" score={result.scores.stemaRisk} type="negative" icon={ShieldAlert} />
                <ScoreBar label="アフィリエイト広告率" score={result.adRatio} type="negative" icon={DollarSign} />
                <ScoreBar label="副作用・健康リスク" score={result.scores.healthRisk} type="negative" icon={HeartPulse} />
              </div>
            </div>

            <div className="details-grid">
              {/* メリット */}
              <div className="detail-column">
                <h3 className="pros-title"><ThumbsUp size={24} /> リアルな良い声・メリット</h3>
                <ul className="real-voice-list">
                  {result.prosSummary && result.prosSummary.length > 0 ? (
                    result.prosSummary.map((pro, idx) => (
                      <li key={idx}><span style={{ color: '#10b981' }}>+</span> <span>{pro}</span></li>
                    ))
                  ) : (
                    <li>見つかりませんでした</li>
                  )}
                </ul>
              </div>

              {/* デメリット */}
              <div className="detail-column">
                <h3 className="cons-title"><ThumbsDown size={24} /> リアルな不満点・デメリット</h3>
                <ul className="real-voice-list">
                  {result.consSummary && result.consSummary.length > 0 ? (
                    result.consSummary.map((con, idx) => (
                      <li key={idx}><span style={{ color: '#ef4444' }}>-</span> <span>{con}</span></li>
                    ))
                  ) : (
                    <li>見つかりませんでした</li>
                  )}
                </ul>
              </div>
            </div>

            {/* 注意点 */}
            {result.warningPoints && result.warningPoints.length > 0 && (
              <div className="warning-section">
                <h3><AlertTriangle size={24} /> 購入前の注意点</h3>
                <ul className="warning-list">
                  {result.warningPoints.map((point, idx) => (
                    <li key={idx}>
                      <ShieldAlert size={18} style={{ minWidth: "18px", marginTop: "2px" }} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ③ 薬機法違反チェック */}
            {result.yakukiho && (
              <div style={{
                marginTop: "1.5rem",
                padding: "1.2rem 1.5rem",
                borderRadius: "12px",
                background: result.yakukiho.hasViolation ? "#fff1f2" : "#f0fdf4",
                border: `1px solid ${result.yakukiho.hasViolation ? "#fecdd3" : "#bbf7d0"}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem", fontWeight: "bold", fontSize: "1rem", color: result.yakukiho.hasViolation ? "#be123c" : "#166534" }}>
                  {result.yakukiho.hasViolation ? <ShieldAlert size={20} /> : <ShieldCheck size={20} />}
                  【薬機法チェック】{result.yakukiho.hasViolation ? `違反の疑いあり（リスク: ${result.yakukiho.riskLevel}）` : "問題のある表現は見つかりませんでした"}
                </div>
                {result.yakukiho.hasViolation && result.yakukiho.violationWords.length > 0 && (
                  <div style={{ fontSize: "0.9rem", color: "#9f1239" }}>
                    <p style={{ marginBottom: "0.4rem" }}>疑いのある表現：</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {result.yakukiho.violationWords.map((word: string, idx: number) => (
                        <span key={idx} style={{ background: "#fecdd3", padding: "0.2rem 0.8rem", borderRadius: "999px", fontSize: "0.85rem" }}>「{word}」</span>
                      ))}
                    </div>
                  </div>
                )}
                <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.6rem" }}>※薬機法（医薬品医療機器等法）により、食品・サプリメントが「痩せる」「脂肪が燃える」などの断定的な効能を謳うことは原則禁止されています。</p>
              </div>
            )}

            {/* ② 成分の科学的根拠チェック */}
            {result.ingredients && result.ingredients.length > 0 && (
              <div style={{ marginTop: "1.5rem", padding: "1.2rem 1.5rem", borderRadius: "12px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: "bold", color: "#1e293b", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  🔬 主要成分の科学的根拠チェック
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  {result.ingredients.map((ing: any, idx: number) => (
                    <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "0.8rem" }}>
                      <span style={{
                        flexShrink: 0,
                        padding: "0.2rem 0.7rem",
                        borderRadius: "999px",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        background: ing.evidence === "high" ? "#dcfce7" : ing.evidence === "medium" ? "#fef9c3" : "#fee2e2",
                        color: ing.evidence === "high" ? "#166534" : ing.evidence === "medium" ? "#854d0e" : "#991b1b",
                      }}>
                        {ing.evidence === "high" ? "🟢 根拠あり" : ing.evidence === "medium" ? "🟡 限定的" : "🔴 根拠薄い"}
                      </span>
                      <div>
                        <span style={{ fontWeight: "bold", fontSize: "0.95rem", color: "#1e293b" }}>{ing.name}</span>
                        <p style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "0.2rem" }}>{ing.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SNSシェアセクション */}
            <div style={{ marginTop: "2rem", padding: "1.5rem", background: "rgba(248,250,252,0.8)", borderRadius: "16px", border: "1px solid var(--border)", textAlign: "center" }}>
              <p style={{ marginBottom: "1rem", fontWeight: "bold", color: "#475569" }}>📣 判定結果をシェアして周りに教えよう！</p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`「${result.productName}」のAIステマ判定結果：${result.riskLevel}！\nステマ危険度: ${result.scores.stemaRisk}/100\n効果の信頼性: ${result.scores.effectiveness}/100\nhttps://true-diet-reviewer.vercel.app #ダイエット #ステマ判定 #サプリ`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.8rem 1.8rem", borderRadius: "999px", background: "#000", color: "#fff", fontWeight: "bold", textDecoration: "none", fontSize: "0.95rem" }}
                >
                  𝕏 でシェア
                </a>
                <a
                  href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent("https://true-diet-reviewer.vercel.app")}&text=${encodeURIComponent(`「${result.productName}」のステマ判定結果を調べました！`)}` }
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.8rem 1.8rem", borderRadius: "999px", background: "#06C755", color: "#fff", fontWeight: "bold", textDecoration: "none", fontSize: "0.95rem" }}
                >
                  LINE でシェア
                </a>
              </div>
            </div>

            {/* マネタイズセクション */}
            <div className="monetization-section">
              <div className="ad-placeholder">
                <span style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>スポンサーリンク</span>
                ※ここにGoogle AdSense等の広告が表示されます
              </div>

              {/* 商品の紹介セクション */}
              <h2 style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#1e293b", margin: "1.5rem 0 1rem", paddingBottom: "0.5rem", borderBottom: "2px solid #e2e8f0" }}>📦 商品の紹介</h2>

              {/* 楽天市場 アフィリエイト検索ボタン */}
              <div style={{ marginTop: "1.5rem" }}>
                {/* 商品画像カード */}
                {result.imageUrl && (
                  <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "1.2rem", marginBottom: "0.5rem" }}>
                    <img
                      src={result.imageUrl}
                      alt={result.productName}
                      style={{ width: "100px", height: "100px", objectFit: "contain", borderRadius: "8px", flexShrink: 0, background: "#f8fafc" }}
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    <div>
                      <p style={{ fontWeight: "bold", fontSize: "1rem", color: "#1e293b", marginBottom: "0.3rem" }}>{result.productName}</p>
                      <p style={{ fontSize: "0.85rem", color: "#64748b" }}>※画像はWEB検索から自動取得しています</p>
                    </div>
                  </div>
                )}
                <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#1e293b", marginBottom: "1rem" }}>🛒 この商品を購入・比較する</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <a
                    href={`https://hb.afl.rakuten.co.jp/ichiba/52f1f988.9bcb825b.52f1f989.d0a8b332/?pc=${encodeURIComponent(`https://search.rakuten.co.jp/search/mall/${result.productName}/`)}&link_type=text`}
                    target="_blank"
                    rel="nofollow sponsored noopener"
                    className="affiliate-btn affiliate-rakuten"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", width: "100%" }}
                  >
                    <ShoppingCart size={18} /> 楽天市場で価格・口コミを見る
                  </a>
                  <a
                    href={`https://www.amazon.co.jp/s?k=${encodeURIComponent(result.productName)}&tag=s19801111-22`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="affiliate-btn affiliate-amazon"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", width: "100%" }}
                  >
                    <ShoppingCart size={18} /> Amazonで価格を確認する
                  </a>
                </div>
              </div>

            </div>

          </div>
        )}
      </div>
      <footer style={{ marginTop: "3rem", textAlign: "left", fontSize: "0.85rem", color: "#94a3b8", padding: "1rem" }}>
        <p><strong>【免責事項】</strong></p>
        <p>当サイトの分析結果は、WEB上に存在する口コミやレビュー情報をAIが自動集約・抽出したものです。事実の正確性や商品の効果を保証するものではありません。</p>
        <p>商品の購入やご利用等に関する最終的なご判断は、ご自身で行っていただきますようお願いいたします。当サイトの利用により生じたいかなる損害についても責任は負いません。</p>
      </footer>
    </main>
  );
}
