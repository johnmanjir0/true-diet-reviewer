"use client";

import { useState, useEffect } from "react";
import { Search, ShieldAlert, AlertTriangle, ShieldCheck, ThumbsUp, ThumbsDown, Activity, Sparkles, DollarSign, HeartPulse, ShoppingCart, MessageSquareText, Stethoscope } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Breadcrumbs from "../../components/Breadcrumbs";

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

export default function HealthPage({ defaultQuery = "" }: { defaultQuery?: string }) {
  const searchParams = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search)
    : null;
  const initialQuery = defaultQuery || searchParams?.get('q') || '';

  const [query1, setQuery1] = useState("");
  const [query2, setQuery2] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = result 
      ? `「${result.productName}」の判定結果｜TrueReview 健康解析` 
      : "🏥 健康・飲み合わせ判定｜TrueReview AI";
  }, [result]);

  useEffect(() => {
    if (initialQuery) {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      setTimeout(() => handleSearch(fakeEvent), 300);
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query1.trim()) return;
    const combined = query2.trim() ? `${query1.trim()} と ${query2.trim()}` : query1.trim();

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/analyze/health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: combined }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
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
          { label: "健康・飲み合わせ判定", href: defaultQuery ? "/health" : undefined },
          ...(defaultQuery ? [{ label: defaultQuery }] : [])
        ]} />
        <div className="glass-panel" style={{ marginTop: "1rem", borderTop: "4px solid #16a34a" }}>
          <h1 className="title">Health Reviewer</h1>
          <p className="subtitle">AIによる薬・サプリメントの飲み合わせ＆リスク判定</p>

          <div style={{ background: "rgba(22, 163, 74, 0.05)", border: "1px solid rgba(22, 163, 74, 0.1)", borderRadius: "16px", padding: "1.5rem", marginBottom: "1.5rem", lineHeight: "1.8", color: "#334155", fontSize: "0.95rem" }}>
            <p>
              「この薬とサプリ、一緒に飲んでも大丈夫？」「持病があるけどこの成分は平気？」<br />
              <strong>AIが医薬品情報のデータベースとウェブ上のリアルな副作用報告</strong>を元に、客観的なリスクを判定します。
            </p>
          </div>

          <form className="search-form" onSubmit={handleSearch} style={{ flexDirection: "column", gap: "0.8rem" }}>
            <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
                <Stethoscope className="search-icon" size={20} />
                <input
                  type="text"
                  value={query1}
                  onChange={(e) => setQuery1(e.target.value)}
                  placeholder="薬・サプリ① （例：ロキソニン）"
                  className="search-input"
                />
              </div>
              <div style={{ fontWeight: "900", fontSize: "1.5rem", color: "#16a34a", flexShrink: 0 }}>＋</div>
              <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
                <Stethoscope className="search-icon" size={20} />
                <input
                  type="text"
                  value={query2}
                  onChange={(e) => setQuery2(e.target.value)}
                  placeholder="薬・サプリ② （例：血圧の薬）"
                  className="search-input"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="search-button" style={{ background: "#16a34a", alignSelf: "flex-end" }}>
              {loading ? "判定中..." : "飲み合わせを判定する"}
            </button>
          </form>

          {error && <div className="error-message">{error}</div>}

          {result && (
            <div className="result-container animate-fade-in">
              <div className={`risk-banner-rich ${getRiskClass(result.riskLevel)}`}>
                <div className="risk-left">
                  <ShieldCheck size={28} />
                  <div className="risk-text-box">
                    <span className="risk-mini-label">健康・相互作用リスク 判定</span>
                    <div className="risk-main-title">{result.riskLevel}</div>
                  </div>
                </div>
                <div className="risk-right">
                  <div className="risk-percent">{result.scores.healthRisk.value}%</div>
                  <div className="risk-percent-label">RISK SCORE</div>
                </div>
              </div>

              <div className="verdict-card-rich">
                <div className="verdict-header"><Sparkles size={22} color="#16a34a" /><h2>AIの安全診断</h2></div>
                <div className="verdict-main">「{result.verdict}」</div>
                <p className="verdict-sub">{result.description}</p>
              </div>

              <div className="score-grid-rich">
                <ScoreCard label="相互作用リスク" detail={result.scores.healthRisk} type="negative" icon={ShieldAlert} />
                <ScoreCard label="エビデンス強度" detail={result.scores.effectiveness} type="positive" icon={ThumbsUp} />
                <ScoreCard label="コスパ・代替性" detail={result.scores.costPerformance} type="positive" icon={DollarSign} />
                <ScoreCard label="副作用報告度" detail={result.scores.healthRisk} type="negative" icon={Activity} />
                <ScoreCard label="信頼性・透明性" detail={result.scores.continuation} type="positive" icon={HeartPulse} />
              </div>

              {result.warningPoints && result.warningPoints.length > 0 && (
                <div className="warning-card-rich">
                  <h3 style={{ color: "#166534" }}><AlertTriangle size={20} /> 重大な注意事項</h3>
                  <ul className="warning-list-rich">{result.warningPoints.map((p, i) => <li key={i}>{p}</li>)}</ul>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
