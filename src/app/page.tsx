"use client";

import { useState } from "react";
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
  subscriptionRisk?: {
    hasSubscription: boolean;
    notes: string;
  };
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productName: query }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "情報の取得に失敗しました。");
      }

      setResult(data);
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
        <p className="subtitle" style={{ marginBottom: "0.5rem" }}>AIによる多角的ステマ・口コミ判定ツール</p>
        <div style={{ textAlign: "left", fontSize: "0.9rem", color: "#64748b", marginBottom: "2rem" }}>
          ※ステマ（ステルスマーケティング）とは：企業から報酬をもらっているのに、一般客としての純粋な口コミを装って商品を宣伝するサクラ行為のことです。
        </div>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="ダイエット商品名を入力（例：〇〇サプリ）"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="search-button" disabled={loading || !query.trim()}>
            {loading ? <Search className="spinner" /> : <Search />}
            {loading ? "分析中..." : "解析する"}
          </button>
        </form>

        {error && (
          <div style={{ background: "#fef2f2", color: "#b91c1c", padding: "1rem", borderRadius: "12px", border: "1px solid #fecaca", marginTop: "1rem" }}>
            {error}
          </div>
        )}

        {result && (
          <div className="result-container">
            
            <div className="overall-header">
              <div className={`risk-badge ${getRiskClass(result.riskLevel)}`}>
                <RiskIcon level={result.riskLevel} />
                総合判定: {result.riskLevel}
              </div>
              
              {result.subscriptionRisk?.hasSubscription && (
                <div style={{ padding: "1rem", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "12px", color: "#92400e", width: "100%", maxWidth: "600px", fontSize: "0.95rem" }}>
                  <strong><AlertTriangle size={18} style={{ display: "inline", verticalAlign: "text-bottom", marginRight: "4px" }}/>【定期購入に関する注意】</strong><br/>
                  {result.subscriptionRisk.notes}
                </div>
              )}
            </div>

            <div className="scores-grid">
              <ScoreBar label="ステマ危険度" score={result.scores.stemaRisk} type="negative" icon={ShieldAlert} />
              <ScoreBar label="効果の信頼性" score={result.scores.effectiveness} type="positive" icon={Sparkles} />
              <ScoreBar label="コスパ満足度" score={result.scores.costPerformance} type="positive" icon={DollarSign} />
              <ScoreBar label="副作用・健康リスク" score={result.scores.healthRisk} type="negative" icon={HeartPulse} />
              <ScoreBar label="継続のしやすさ" score={result.scores.continuation} type="positive" icon={Activity} />
            </div>

            <div className="score-card score-negative" style={{ marginTop: '1.5rem', background: 'rgba(255,255,255,0.5)' }}>
              <div className="score-header">
                <span>検索上位のアフィリエイト広告率（推定）</span>
                <span>{result.adRatio}%</span>
              </div>
              <div className="progress-bg"><div className="progress-fill" style={{ width: `${result.adRatio}%` }}></div></div>
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

            {/* マネタイズセクション */}
            <div className="monetization-section">
              <div className="ad-placeholder">
                <span style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>スポンサーリンク</span>
                ※ここにGoogle AdSense等の広告が表示されます
              </div>

              {/* 商品カード */}
              <div className="product-card">
                <div className="product-card-image">
                  {result.imageUrl ? (
                    <img src={result.imageUrl} alt={result.productName} />
                  ) : (
                    <div className="no-image"><ShoppingCart size={40} opacity={0.5} /></div>
                  )}
                </div>
                <div className="product-card-content">
                  <h4>{result.productName}</h4>
                  <div className="affiliate-buttons-small">
                    <a 
                      href={`https://www.amazon.co.jp/s?k=${encodeURIComponent(result.productName)}&tag=YOUR_AMAZON_TAG_HERE`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="affiliate-btn affiliate-amazon"
                    >
                      Amazonで探す
                    </a>
                    <a 
                      href={`https://search.rakuten.co.jp/search/mall/${encodeURIComponent(result.productName)}/`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="affiliate-btn affiliate-rakuten"
                    >
                      楽天市場で探す
                    </a>
                  </div>
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
