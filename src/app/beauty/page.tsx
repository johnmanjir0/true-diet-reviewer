"use client";

import { useState, useEffect } from "react";
import { Search, ShieldAlert, AlertTriangle, ShieldCheck, ThumbsUp, ThumbsDown, Activity, Sparkles, DollarSign, HeartPulse, ShoppingCart, MessageSquareText } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Breadcrumbs from "../../components/Breadcrumbs";
import ShareButtons from "../../components/ShareButtons";
import AnalysisHistory, { saveHistory } from "../../components/AnalysisHistory";
import SearchSuggest from "../../components/SearchSuggest";

interface ScoreDetail {
  value: number;
  explanation: string;
}

interface AnalysisResult {
  productName: string;
  scores: {
    stemaRisk: ScoreDetail;
    effectiveness: ScoreDetail;
    costPerformance: ScoreDetail;
    healthRisk: ScoreDetail;
    continuation: ScoreDetail;
  };
  riskLevel: "安全" | "要注意" | "危険";
  verdict: string;
  description: string;
  prosSummary: string[];
  consSummary: string[];
  warningPoints?: string[];
  subscriptionRisk?: { hasSubscription: boolean; detail: string; };
  yakukiho?: { hasViolation: boolean; violationWords: string[]; riskLevel: string; advice: string; };
  ingredients?: { name: string; evidence: string; note: string; }[];
  imageUrl?: string;
  adRatio?: number;
}

export default function BeautyPage({ defaultQuery = "" }: { defaultQuery?: string }) {
  const searchParams = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search)
    : null;
  const initialQuery = defaultQuery || searchParams?.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState("リンクをコピー");

  useEffect(() => {
    if (initialQuery) {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      setTimeout(() => handleSearch(fakeEvent), 300);
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/analyze/beauty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: query }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      saveHistory({ tool: "beauty", name: query.trim(), riskLevel: data.riskLevel });
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

  const ScoreCard = ({ label, detail, type, icon: Icon }: { label: string, detail: ScoreDetail, type: 'positive' | 'negative', icon: any }) => (
    <div className={`score-card-rich score-${type}`}>
      <div className="score-top">
        <div className="score-label"><Icon size={20} /><span>{label}</span></div>
        <div className="score-num">{detail.value}<span className="score-total">/100</span></div>
      </div>
      <div className="score-bar-bg"><div className="score-bar-fill" style={{ width: `${detail.value}%` }}></div></div>
      <p className="score-desc">{detail.explanation}</p>
    </div>
  );

  return (
    <>
      <Header />
      <main className="container">
        <Breadcrumbs items={[
          { label: "美容解析", href: defaultQuery ? "/beauty" : undefined },
          ...(defaultQuery ? [{ label: defaultQuery }] : [])
        ]} />
        <div className="glass-panel" style={{ marginTop: "1rem", borderTop: "4px solid #ec4899" }}>
          <h1 className="title">Beauty Reviewer</h1>
          <p className="subtitle">AIによる美容・コスメ商品のステマ・成分判定</p>

          <div style={{ background: "rgba(236, 72, 153, 0.05)", border: "1px solid rgba(236, 72, 153, 0.1)", borderRadius: "16px", padding: "1.5rem", marginBottom: "1.5rem", lineHeight: "1.8", color: "#334155", fontSize: "0.95rem" }}>
            <p>
              「SNSでバズってるけど、私の肌に合う？」「PR広告ばかりで本音がわからない…」<br />
              美容液やコスメ、美容サプリの<strong>「本当の価値」をAIが成分とリアルな口コミから解析</strong>します。
            </p>
          </div>

          <AnalysisHistory tool="beauty" onSelect={(name) => { setQuery(name); }} />

          <form className="search-form" onSubmit={handleSearch}>
            <SearchSuggest
              tool="beauty"
              value={query}
              onChange={setQuery}
              placeholder="商品名を入力（例：導入美容液、ビタミンCサプリ）"
              onSubmit={(name) => {
                setQuery(name);
                const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
                handleSearch(fakeEvent);
              }}
            />
            <button type="submit" disabled={loading} className="search-button" style={{ background: "#db2777" }}>
              {loading ? "解析中..." : "解析する"}
            </button>
          </form>

          {/* 人気のカテゴリー */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
             {["まつげ美容液", "導入液", "ビタミンC美容液", "レチノール", "ナイトクリーム"].map(tag => (
               <a key={tag} href={`/beauty/products/${encodeURIComponent(tag)}`} style={{ padding: "0.4rem 0.8rem", borderRadius: "99px", border: "1px solid #fce7f3", background: "#fff", fontSize: "0.8rem", cursor: "pointer", textDecoration: "none", color: "#475569" }}>{tag}</a>
             ))}
          </div>

          {error && (
            <div style={{ background: "#fff0f6", border: "2px solid #f472b6", borderRadius: "20px", padding: "2rem", marginBottom: "2rem", textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>🔍</div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#9d174d", marginBottom: "0.5rem" }}>解析できませんでした</h3>
              <p style={{ color: "#7c3aed", fontSize: "0.9rem", lineHeight: "1.7", marginBottom: "1rem" }}>{error}</p>
              <div style={{ background: "#fff", borderRadius: "12px", padding: "1rem", fontSize: "0.85rem", color: "#475569", textAlign: "left" }}>
                <p style={{ fontWeight: "700", marginBottom: "0.5rem" }}>💡 こんな場合は解析できないことがあります：</p>
                <ul style={{ paddingLeft: "1.2rem", lineHeight: "2" }}>
                  <li>商品名のスペルが間違っている</li>
                  <li>口コミ情報がほとんどない新発売商品</li>
                  <li>海外ブランドの英語表記など</li>
                </ul>
                <p style={{ marginTop: "0.8rem" }}>別の商品名や、正式名称・日本語名でお試しください。</p>
              </div>
            </div>
          )}

          {result && (
            <div className="result-container animate-fade-in">
              <div className={`risk-banner-rich ${getRiskClass(result.riskLevel)}`}>
                <div className="risk-left">
                  <ShieldCheck size={28} />
                  <div className="risk-text-box">
                    <span className="risk-mini-label">美容ステマリスク 判定</span>
                    <div className="risk-main-title">{result.riskLevel}</div>
                  </div>
                </div>
                <div className="risk-right">
                  <div className="risk-percent">{result.scores.stemaRisk.value}%</div>
                  <div className="risk-percent-label">RISK SCORE</div>
                </div>
              </div>

              <div className="verdict-card-rich">
                <div className="verdict-header"><Sparkles size={22} color="#db2777" /><h2>AIの美容診断</h2></div>
                <div className="verdict-main">「{result.verdict}」</div>
                <p className="verdict-sub">{result.description}</p>
              </div>

              <div className="score-grid-rich">
                <ScoreCard label="ステマリスク" detail={result.scores.stemaRisk} type="negative" icon={ShieldAlert} />
                <ScoreCard label="成分の実感度" detail={result.scores.effectiveness} type="positive" icon={ThumbsUp} />
                <ScoreCard label="コスパ・配合量" detail={result.scores.costPerformance} type="positive" icon={DollarSign} />
                <ScoreCard label="肌への優しさ" detail={result.scores.healthRisk} type="positive" icon={Activity} />
                <ScoreCard label="使い心地・香り" detail={result.scores.continuation} type="positive" icon={HeartPulse} />
              </div>

              <div className="details-grid-rich">
                <div className="details-column">
                  <h3 className="pros-title"><ThumbsUp size={20} /> 絶賛されている点</h3>
                  <ul className="details-list">{result.prosSummary.map((item, i) => <li key={i}><span className="plus">+</span>{item}</li>)}</ul>
                </div>
                <div className="details-column">
                  <h3 className="cons-title"><ThumbsDown size={20} /> 不満・懸念点</h3>
                  <ul className="details-list">{result.consSummary.map((item, i) => <li key={i}><span className="minus">-</span>{item}</li>)}</ul>
                </div>
              </div>

              {result.ingredients && (
                <div className="ingredients-card-rich">
                  <h3><Sparkles size={18} /> 美容成分の専門的知見</h3>
                  {result.ingredients.map((ing, i) => (
                    <div key={i} className="ingredient-item">
                      <span className={`evidence-badge e-${ing.evidence}`}>根拠:{ing.evidence}</span>
                      <div className="ing-info"><strong>{ing.name}</strong><p>{ing.note}</p></div>
                    </div>
                  ))}
                </div>
              )}
              <ShareButtons productName={result.productName} riskLevel={result.riskLevel} verdict={result.verdict} tool="beauty" />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
