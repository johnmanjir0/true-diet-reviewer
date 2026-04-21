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
  riskLevel: "安全" | "要注意" | "危険";
  verdict: string;
  description: string;
  prosSummary: string[];
  consSummary: string[];
  subscriptionRisk?: { hasSubscription: boolean; detail: string; };
  yakukiho?: { hasViolation: boolean; violationWords: string[]; riskLevel: string; advice: string; };
  ingredients?: { name: string; evidence: string; note: string; }[];
  imageUrl?: string;
}

export default function Home() {
  const searchParams = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search)
    : null;
  const initialQuery = searchParams?.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
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

    setLoading(true);
    setResult(null);
    setError(null);
    setRakutenItems([]);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: query }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      
      // 楽天検索
      const rakutenRes = await fetch(`/api/rakuten?keyword=${encodeURIComponent(query)}`);
      const rakutenData = await rakutenRes.json();
      if (rakutenData.Items) {
         setRakutenItems(rakutenData.Items);
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
        <p className="subtitle" style={{ marginBottom: "1rem" }}>AIによるダイエット商品のステマ・口コミ判定</p>

        {/* サイト説明文（SEO兼ねた紹介文） */}
        <div style={{ background: "rgba(14,165,233,0.06)", border: "1px solid rgba(14,165,233,0.2)", borderRadius: "16px", padding: "1.5rem", marginBottom: "2rem", lineHeight: "1.8", color: "#334155", fontSize: "0.95rem" }}>
          <p style={{ marginBottom: "0.8rem" }}>
            この商品は本当に信じていいの？WEB上の口コミをAIがリアルタイム解析し、本音を暴きます。
          </p>
          <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
            ※ステマ危険度、成分の根拠、薬機法違反、定期縛りなどを徹底分析します。
          </p>
        </div>

        <form className="search-form" onSubmit={handleSearch} style={{ flexDirection: "column", gap: "0.8rem" }}>
          <div style={{ display: "flex", width: "100%", gap: "0.5rem" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Search className="search-icon" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="商品名を入力（例：ナイシトール）"
                className="search-input"
              />
            </div>
            <button type="submit" disabled={loading} className="search-button">
              {loading ? "解析中..." : "解析する"}
            </button>
          </div>
        </form>

        {error && <div className="error-message">{error}</div>}

        {result && (
          <div className="result-container animate-fade-in">
            <div className={`risk-banner ${getRiskClass(result.riskLevel)}`}>
              <div className="risk-content">
                <RiskIcon level={result.riskLevel} />
                <div>
                  <span className="risk-label">総合ステマ危険度</span>
                  <div className="risk-title">{result.riskLevel}</div>
                </div>
              </div>
              <div className="risk-score">{result.scores.stemaRisk}%</div>
            </div>

            <div className="verdict-card">
              <h2 className="section-title"><Sparkles size={20} /> AIの結論</h2>
              <p className="verdict-text">{result.verdict}</p>
              <div className="verdict-description">{result.description}</div>
            </div>

            <div className="score-grid">
              <ScoreBar label="効果の信頼性" score={result.scores.effectiveness} type="positive" icon={Activity} />
              <ScoreBar label="健康維持リスク" score={result.scores.healthRisk} type="negative" icon={ShieldAlert} />
              <ScoreBar label="コスパ満足度" score={result.scores.costPerformance} type="positive" icon={DollarSign} />
              <ScoreBar label="継続のしやすさ" score={result.scores.continuation} type="positive" icon={HeartPulse} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="summary-card pros">
                <h3><ThumbsUp size={18} /> メリット</h3>
                <ul>{result.prosSummary.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>
              <div className="summary-card cons">
                <h3><ThumbsDown size={18} /> デメリット</h3>
                <ul>{result.consSummary.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </div>
            </div>

            {/* 定期購入リスク */}
            {result.subscriptionRisk && (
              <div style={{ marginTop: "1rem", padding: "1.2rem", borderRadius: "12px", background: result.subscriptionRisk.hasSubscription ? "#fff7ed" : "#f0fdf4", border: "1px solid" + (result.subscriptionRisk.hasSubscription ? "#fdba74" : "#bbf7d0") }}>
                <h3 style={{ fontSize: "1rem", fontWeight: "bold", color: "#1e293b", marginBottom: "0.5rem" }}>
                  {result.subscriptionRisk.hasSubscription ? "⚠️ 定期購入の注意点" : "✅ 定期縛りなし"}
                </h3>
                <p style={{ fontSize: "0.9rem", color: "#475569" }}>{result.subscriptionRisk.detail}</p>
              </div>
            )}

            {/* 薬機法チェック */}
            {result.yakukiho && (
              <div style={{ marginTop: "1.5rem", padding: "1.2rem", borderRadius: "16px", background: "#fef2f2", border: "1px solid #fee2e2" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: "bold", color: "#991b1b", marginBottom: "0.8rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  🚨 薬機法違反の疑いチェック
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.8rem" }}>
                  {result.yakukiho.violationWords.map((word, idx) => (
                    <span key={idx} style={{ padding: "0.2rem 0.6rem", background: "#fecaca", color: "#991b1b", borderRadius: "4px", fontSize: "0.85rem", fontWeight: "bold" }}>{word}</span>
                  ))}
                  {result.yakukiho.violationWords.length === 0 && <span style={{ color: "#059669" }}>問題のある表現は見つかりませんでした</span>}
                </div>
                <p style={{ fontSize: "0.85rem", color: "#7f1d1d", lineHeight: "1.6" }}>{result.yakukiho.advice}</p>
              </div>
            )}

            {/* 成分の科学的根拠チェック */}
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

            <div style={{ marginTop: "2rem", padding: "1.5rem", background: "rgba(248,250,252,0.8)", borderRadius: "16px", border: "1px solid var(--border)", textAlign: "center" }}>
              <p style={{ marginBottom: "1rem", fontWeight: "bold", color: "#475569" }}>📣 判定結果をシェアして周りに教えよう！</p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`「${result.productName}」のAIステマ判定結果：${result.riskLevel}！\nステマ危険度: ${result.scores.stemaRisk}/100\n効果の信頼性: ${result.scores.effectiveness}/100\nhttps://true-diet-reviewer.vercel.app #ダイエット #ステマ判定 #サプリ`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-btn twitter"
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.8rem 1.8rem", borderRadius: "999px", background: "#000", color: "#fff", fontWeight: "bold", textDecoration: "none", fontSize: "0.95rem" }}
                >
                  𝕏 でシェア
                </a>
                <a
                  href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent("https://true-diet-reviewer.vercel.app")}&text=${encodeURIComponent(`「${result.productName}」のステマ判定結果を調べました！`)}` }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-btn line"
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.8rem 1.8rem", borderRadius: "999px", background: "#06C755", color: "#fff", fontWeight: "bold", textDecoration: "none", fontSize: "0.95rem" }}
                >
                  LINE でシェア
                </a>
              </div>
            </div>

            <div className="monetization-section">
              <div className="ad-placeholder">
                <span style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>スポンサーリンク</span>
                ※ここにGoogle AdSense等の広告が表示されます
              </div>

              <h2 style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#1e293b", margin: "1.5rem 0 1rem", paddingBottom: "0.5rem", borderBottom: "2px solid #e2e8f0" }}>📦 商品の紹介</h2>

              <div style={{ marginTop: "1.5rem" }}>
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
                <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#1e293b", marginBottom: "1rem" }}>🛒 この商品を購入・検討する</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <a
                    href={`https://hb.afl.rakuten.co.jp/ichiba/52f1f988.9bcb825b.52f1f989.d0a8b332/?pc=${encodeURIComponent(`https://search.rakuten.co.jp/search/mall/${result.productName}/`)}&link_type=text`}
                    target="_blank"
                    rel="nofollow sponsored noopener"
                    className="affiliate-btn affiliate-rakuten"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", width: "100%", padding: "1rem", borderRadius: "12px", background: "#bf0000", color: "#fff", fontWeight: "bold", textDecoration: "none" }}
                  >
                    <ShoppingCart size={18} /> 楽天市場で価格・口コミを見る
                  </a>
                  <a
                    href={`https://www.amazon.co.jp/s?k=${encodeURIComponent(result.productName)}&tag=s19801111-22`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="affiliate-btn affiliate-amazon"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", width: "100%", padding: "1rem", borderRadius: "12px", background: "#ff9900", color: "#fff", fontWeight: "bold", textDecoration: "none" }}
                  >
                    <ShoppingCart size={18} /> Amazonで価格を確認する
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <footer style={{ marginTop: "3rem", textAlign: "left", fontSize: "0.85rem", color: "#94a3b8", padding: "1rem", borderTop: "1px solid #e2e8f0" }}>
        <p style={{ marginBottom: "0.5rem" }}>
          <a href="/privacy" style={{ color: "#64748b", textDecoration: "none", marginRight: "1rem" }}>プライバシーポリシー</a>
          <a href="/terms" style={{ color: "#64748b", textDecoration: "none" }}>利用規約</a>
        </p>
        <p><strong>【免責事項】</strong></p>
        <p>当サイトの分析結果は、WEB上に存在する口コミやレビュー情報をAIが自動集約・抽出したものです。事実の正確性や商品の効果を保証するものではありません。</p>
        <p>商品の購入やご利用等に関する最終的なご判断は、ご自身で行っていただきますようお願いいたします。当サイトの利用により生じたいかなる損害についても責任は負いません。</p>
        <p style={{ marginTop: "1rem", textAlign: "center" }}>© 2026 TrueDiet Reviewer</p>
      </footer>
    </main>
  );
}
