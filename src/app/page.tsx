"use client";

import { useState, useEffect } from "react";
import { Search, ShieldAlert, AlertTriangle, ShieldCheck, ThumbsUp, ThumbsDown, Activity, Sparkles, DollarSign, HeartPulse, ShoppingCart, MessageSquareText } from "lucide-react";

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
  const [copyStatus, setCopyStatus] = useState("リンクをコピー");

  // タブのタイトルを動的に変更
  useEffect(() => {
    if (result) {
      document.title = `「${result.productName}」の解析結果｜TrueDiet Reviewer`;
    } else {
      document.title = "🔍 ステマ判定｜TrueDiet Reviewer（AI口コミ解析）";
    }
  }, [result]);

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
    if (level === "安全") return <ShieldCheck size={28} />;
    if (level === "危険") return <ShieldAlert size={28} />;
    return <AlertTriangle size={28} />;
  };

  const ScoreCard = ({ label, detail, type, icon: Icon }: { label: string, detail: ScoreDetail, type: 'positive' | 'negative', icon: any }) => (
    <div className={`score-card-rich score-${type}`}>
      <div className="score-top">
        <div className="score-label">
          <Icon size={20} />
          <span>{label}</span>
        </div>
        <div className="score-num">
          {detail.value}<span className="score-total">/100</span>
        </div>
      </div>
      <div className="score-bar-bg">
        <div className="score-bar-fill" style={{ width: `${detail.value}%` }}></div>
      </div>
      <p className="score-desc">{detail.explanation}</p>
    </div>
  );

  return (
    <main className="container">
      <div className="glass-panel" style={{ marginTop: "2rem" }}>
        <h1 className="title">TrueDiet Reviewer</h1>
        <p className="subtitle" style={{ marginBottom: "1rem" }}>AIによるダイエット商品のステマ・口コミ判定</p>

        <div style={{ background: "rgba(14,165,233,0.06)", border: "1px solid rgba(14,165,233,0.2)", borderRadius: "16px", padding: "1.5rem", marginBottom: "1.5rem", lineHeight: "1.8", color: "#334155", fontSize: "0.95rem" }}>
          <p style={{ marginBottom: "0.8rem" }}>
            「このダイエットサプリ、本当に効くの？」「口コミが良すぎて逆に怪しい…」
            そんな疑問をお持ちの方のために作られた、<strong>AIが口コミをリアルタイム解析して本音を暴くツール</strong>です。
          </p>
          <p style={{ marginBottom: "0.8rem" }}>
            商品名を入力するだけで、WEB上の口コミ・レビューをAIが自動収集し、
            <strong>「ステマ危険度」「効果の信頼性」「短評」「健康維持リスク」「定期縛りの有無」</strong>など
            多角的な視点で徹底分析します。高額なダイエット商品の購入前に、ぜひ一度ご活用ください。
          </p>
          <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
            ※ステマ（ステルスマーケティング）とは：企業から報酬をもらいながら、一般客を装って商品を絶賛する「サクラ口コミ」のことです。
          </p>
        </div>

        <form className="search-form" onSubmit={handleSearch}>
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
        </form>

        {/* カテゴリー別：最近解析された商品（AdSense対策兼ねた大量リンク集） */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={{ fontSize: "0.9rem", fontWeight: "bold", color: "#475569", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Activity size={18} color="var(--primary)" /> カテゴリー別：最近解析された商品
          </p>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            {[
              { label: "🔥 脂肪燃焼・代謝", items: ["ナイシトールZ", "防風通聖散", "シボヘール", "内脂サポート", "大人のカロリミット", "ビスラットゴールド"] },
              { label: "🍞 糖質・脂質カット", items: ["カロリミット", "メタバリアEX", "賢者の食卓", "トリプルカッター", "糖質ぱっくん", "ベジバリア"] },
              { label: "🌿 菌活・酵素・腸内", items: ["キラリ麹の炭クレンズ", "ラクビ", "ビセラ", "コンブチャクレンズ", "ベルタ酵素", "万田酵素"] },
              { label: "🥗 置き換え・食品", items: ["マイプロテイン", "ザバス", "コスミックエンザイム", "優光泉", "スリモア", "鍛神"] },
            ].map((cat) => (
              <div key={cat.label}>
                <h4 style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "0.6rem", borderLeft: "3px solid var(--primary)", paddingLeft: "0.5rem" }}>{cat.label}</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {cat.items.map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setQuery(p);
                        const ev = { preventDefault: () => {} } as React.FormEvent;
                        handleSearch(ev);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      style={{
                        padding: "0.3rem 0.7rem",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        background: "#fff",
                        fontSize: "0.75rem",
                        color: "#475569",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.background = "#f0f9ff"; }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#fff"; }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {result && (
          <div className="result-container animate-fade-in">
            {/* 総合リスクバナー */}
            <div className={`risk-banner-rich ${getRiskClass(result.riskLevel)}`}>
              <div className="risk-left">
                <RiskIcon level={result.riskLevel} />
                <div className="risk-text-box">
                  <span className="risk-mini-label">総合ステマ危険度 判定</span>
                  <div className="risk-main-title">{result.riskLevel}</div>
                </div>
              </div>
              <div className="risk-right">
                <div className="risk-percent">{result.scores.stemaRisk.value}%</div>
                <div className="risk-percent-label">RISK SCORE</div>
              </div>
            </div>

            {/* AIの結論カード */}
            <div className="verdict-card-rich">
              <div className="verdict-header">
                <Sparkles size={22} className="sparkle-icon" />
                <h2>AIのズバリ判定</h2>
              </div>
              <div className="verdict-main">「{result.verdict}」</div>
              <p className="verdict-sub">{result.description}</p>
            </div>

            {/* 数値スコアグリッド（解説付き） */}
            <h3 className="section-title-sub"><Activity size={18} /> 解析パラメータ詳細</h3>
            
            {/* 数値の意味についての解説 */}
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1rem", marginBottom: "1.2rem", fontSize: "0.85rem", color: "#64748b" }}>
              <p style={{ fontWeight: "bold", marginBottom: "0.4rem", color: "#475569" }}>📊 数値の読み方（100点満点）</p>
              <ul style={{ listStyle: "none", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem 1rem" }}>
                <li>• <strong>ステマリスク</strong>: 高いほど宣伝色が強く要注意</li>
                <li>• <strong>効果の信頼性</strong>: 高いほど体験者の高評価が多い</li>
                <li>• <strong>コスパ満足度</strong>: 高いほど価格への納得感が強い</li>
                <li>• <strong>継続のしやすさ</strong>: 高いほど味や手軽さで好評</li>
                <li>• <strong>健康維持リスク</strong>: 高いほど副作用等の懸念あり</li>
              </ul>
            </div>
            <div className="score-grid-rich">
              <ScoreCard label="ステマ・宣伝リスク" detail={result.scores.stemaRisk} type="negative" icon={ShieldAlert} />
              <ScoreCard label="効果の実感・信頼性" detail={result.scores.effectiveness} type="positive" icon={ThumbsUp} />
              <ScoreCard label="コスパ・納得感" detail={result.scores.costPerformance} type="positive" icon={DollarSign} />
              <ScoreCard label="継続のしやすさ" detail={result.scores.continuation} type="positive" icon={HeartPulse} />
              <ScoreCard label="健康維持リスク" detail={result.scores.healthRisk} type="negative" icon={Activity} />
            </div>

            {/* メリット・デメリット（5項目ずつ） */}
            <div className="details-grid-rich">
              <div className="details-column">
                <h3 className="pros-title"><ThumbsUp size={20} /> リアルなメリット</h3>
                <ul className="details-list">
                  {result.prosSummary.map((item, i) => <li key={i}><span className="plus">+</span>{item}</li>)}
                </ul>
              </div>
              <div className="details-column">
                <h3 className="cons-title"><ThumbsDown size={20} /> リアルなデメリット</h3>
                <ul className="details-list">
                  {result.consSummary.map((item, i) => <li key={i}><span className="minus">-</span>{item}</li>)}
                </ul>
              </div>
            </div>

            {/* 注意点セクション */}
            {result.warningPoints && result.warningPoints.length > 0 && (
              <div className="warning-card-rich">
                <h3><AlertTriangle size={20} /> 購入前の具体的注意点</h3>
                <ul className="warning-list-rich">
                  {result.warningPoints.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
            )}

            {/* 定期購入・薬機法・成分（統合セクション） */}
            <div className="info-grid-rich">
              {/* 定期縛り */}
              {result.subscriptionRisk && (
                <div className={`info-box ${result.subscriptionRisk.hasSubscription ? 'sub-danger' : 'sub-safe'}`}>
                  <h4><ShoppingCart size={18} /> 定期購入のリスク</h4>
                  <p>{result.subscriptionRisk.detail}</p>
                </div>
              )}
              {/* 薬機法 */}
              {result.yakukiho && (
                <div className="info-box yakukiho-box">
                  <h4><ShieldAlert size={18} /> 薬機法違反の疑い</h4>
                  <div className="violation-tags">
                    {result.yakukiho.violationWords.map((w, idx) => <span key={idx} className="tag">{w}</span>)}
                    {result.yakukiho.violationWords.length === 0 && <span className="tag-safe">問題なし</span>}
                  </div>
                  <p className="advice">{result.yakukiho.advice}</p>
                </div>
              )}
            </div>

            {/* 成分チェック */}
            {result.ingredients && result.ingredients.length > 0 && (
              <div className="ingredients-card-rich">
                <h3><Sparkles size={18} /> 主要成分の科学的根拠</h3>
                {result.ingredients.map((ing, i) => (
                  <div key={i} className="ingredient-item">
                    <span className={`evidence-badge e-${ing.evidence}`}>
                      {ing.evidence === "high" ? "根拠：強" : ing.evidence === "medium" ? "根拠：中" : "根拠：弱"}
                    </span>
                    <div className="ing-info">
                      <strong>{ing.name}</strong>
                      <p>{ing.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SNSシェア */}
            <div className="share-section-rich">
              <p>この判定結果をSNSで共有する</p>
              <div className="share-btns">
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`【AI判定】「${result.productName}」のステマ危険度は…『${result.scores.stemaRisk.value}%』でした！🔍\n\n判定：${result.verdict}\n${result.description}\n\n#TrueDietReviewer #ダイエット #ステマ判定\n`)}&url=${encodeURIComponent(`https://true-diet-reviewer.vercel.app/?q=${result.productName}`)}`} target="_blank" className="btn-x">𝕏 ポスト</a>
                <a href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(`https://true-diet-reviewer.vercel.app/?q=${result.productName}`)}`} target="_blank" className="btn-line">LINE</a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://true-diet-reviewer.vercel.app/?q=${result.productName}`)}`} target="_blank" className="btn-fb">Facebook</a>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`【AI判定】「${result.productName}」の解析結果｜TrueDiet Reviewer\nhttps://true-diet-reviewer.vercel.app/?q=${encodeURIComponent(result.productName)}`);
                    setCopyStatus("Instagram用にコピー完了！");
                    setTimeout(() => setCopyStatus("Instagram"), 2000);
                  }}
                  className="btn-insta"
                >
                  {copyStatus === "リンクをコピー" ? "Instagram" : copyStatus}
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`「${result.productName}」のAI判定結果｜TrueDiet Reviewer\nhttps://true-diet-reviewer.vercel.app/?q=${encodeURIComponent(result.productName)}`);
                    setCopyStatus("コピー完了！");
                    setTimeout(() => setCopyStatus("リンクをコピー"), 2000);
                  }}
                  className="btn-copy"
                >
                  {copyStatus}
                </button>
              </div>
            </div>

            {/* マネタイズ */}
            <div className="monetization-rich">
              <div className="ad-banner">スポンサーリンク</div>
              <h3 className="section-title-sub">📦 解析した商品はこちら</h3>
              {result.imageUrl && (
                <div className="product-card-rich">
                  <img src={result.imageUrl} alt={result.productName} />
                  <div className="product-info">
                    <strong>{result.productName}</strong>
                    <p>画像はWEB検索結果から引用</p>
                  </div>
                </div>
              )}
              <div className="shop-links-rich">
                <a href={`https://hb.afl.rakuten.co.jp/ichiba/52f1f988.9bcb825b.52f1f989.d0a8b332/?pc=${encodeURIComponent(`https://search.rakuten.co.jp/search/mall/${result.productName}/`)}&link_type=text`} target="_blank" className="rakuten"><ShoppingCart size={18} /> 楽天市場で購入・比較</a>
                <a href={`https://www.amazon.co.jp/s?k=${encodeURIComponent(result.productName)}&tag=s19801111-22`} target="_blank" className="amazon"><ShoppingCart size={18} /> Amazonで価格をチェック</a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 豆知識コラム（AdSense審査対策の独自記事セクション） */}
      <div style={{ marginTop: "4rem", padding: "3rem 2rem", background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)", borderRadius: "32px", border: "1px solid #e2e8f0" }}>
        <h3 style={{ fontSize: "1.4rem", fontWeight: "900", color: "#0f172a", marginBottom: "2rem", textAlign: "center" }}>
          📖 AIが教える、失敗しないダイエットサプリの選び方
        </h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <div style={{ background: "#fff", padding: "1.5rem", borderRadius: "20px", border: "1px solid #f1f5f9", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
            <h4 style={{ color: "var(--primary)", fontWeight: "800", marginBottom: "0.8rem", fontSize: "1.1rem" }}>1. 「魔法の言葉」に惑わされない</h4>
            <p style={{ fontSize: "0.9rem", color: "#475569", lineHeight: "1.8" }}>
              「寝ている間に」「運動なしで劇的変化」といった極端な表現には注意が必要です。サプリメントはあくまで食事や運動をサポートする「食品」であり、医薬品のような即効性はありません。AIの解析では、こうした過度な表現（ステマの可能性）を厳しくチェックしています。
            </p>
          </div>
          <div style={{ background: "#fff", padding: "1.5rem", borderRadius: "20px", border: "1px solid #f1f5f9", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
            <h4 style={{ color: "var(--primary)", fontWeight: "800", marginBottom: "0.8rem", fontSize: "1.1rem" }}>2. 成分の「裏付け」を確認する</h4>
            <p style={{ fontSize: "0.9rem", color: "#475569", lineHeight: "1.8" }}>
              配合されている成分が、実際にどのような研究データに基づいているかを確認しましょう。当ツールの「成分根拠チェック」では、配合成分が科学的な信頼性（機能性表示食品の届出など）に基づいているかを可視化しています。
            </p>
          </div>
          <div style={{ background: "#fff", padding: "1.5rem", borderRadius: "20px", border: "1px solid #f1f5f9", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
            <h4 style={{ color: "var(--primary)", fontWeight: "800", marginBottom: "0.8rem", fontSize: "1.1rem" }}>3. 「解約ルール」は購入前に必ず見る</h4>
            <p style={{ fontSize: "0.9rem", color: "#475569", lineHeight: "1.8" }}>
              初回価格が異常に安い商品は、数ヶ月間の継続が必須（定期縛り）となっているケースが多々あります。購入手続きを完了する前に、必ず「特定商取引法に基づく表記」を確認しましょう。当AIは口コミから解約トラブルの兆候も逃さず抽出します。
            </p>
          </div>
          <div style={{ background: "#fff", padding: "1.5rem", borderRadius: "20px", border: "1px solid #f1f5f9", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h4 style={{ color: "var(--primary)", fontWeight: "800", marginBottom: "0.8rem", fontSize: "1.1rem" }}>4. 購入前の「セカンドオピニオン」に</h4>
            <p style={{ fontSize: "0.9rem", color: "#475569", lineHeight: "1.8" }}>
              気になる商品を見つけたら、まず当サイトのAIに商品名を入力してみてください。WEB上の膨大なリアルボイスを10秒で集約。広告の裏側にある「本当の評判」を知ることで、納得のいくダイエット生活をサポートします。
            </p>
          </div>
        </div>
      </div>

      {/* 当サイトについて（紹介セクション） */}
      <div style={{ marginTop: "3rem", padding: "2.5rem 2rem", background: "#fff", borderRadius: "32px", border: "1px solid #e2e8f0", boxShadow: "var(--shadow-sm)" }}>
        <h3 style={{ fontSize: "1.4rem", fontWeight: "900", color: "#0f172a", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Sparkles size={24} color="var(--primary)" /> TrueDiet Reviewer とは
        </h3>
        <p style={{ color: "#334155", fontSize: "1rem", lineHeight: "2", marginBottom: "1.5rem" }}>
          「これを飲むだけで-10kg」「SNSで話題沸騰！」<br />
          ダイエット商品の広告やインフルエンサーの投稿を見て、期待と疑いの両方を感じたことはありませんか？
        </p>
        <p style={{ color: "#334155", fontSize: "1rem", lineHeight: "2", marginBottom: "1.5rem" }}>
          現在のネット上には、企業から報酬を得て書かれた「ステマ（ステルスマーケティング）」や、過大な表現を含む広告が溢れています。
        </p>
        <p style={{ color: "#334155", fontSize: "1rem", lineHeight: "2", marginBottom: "1.5rem" }}>
          TrueDiet Reviewerは、そんな情報の迷路に迷い込んだ方のために、最新のAI技術を用いて<strong>「ネット上のリアルな本音」を客観的に可視化するツール</strong>です。
        </p>
        <p style={{ color: "#334155", fontSize: "1rem", lineHeight: "2" }}>
          特定の企業に忖度せず、WEB上の膨大な口コミを独自にAIが精査。リスクやコスパ、科学的根拠を公正に採点し、あなたが<strong>「本当に納得できる買い物」</strong>をするためのパートナーとなります。
        </p>
      </div>
      <footer className="footer-rich">
        <div className="footer-links">
          <a href="/privacy">プライバシーポリシー</a>
          <a href="/terms">利用規約</a>
        </div>
        <p className="menseki">【免責事項】当サイトの分析はAIによる自動集計であり、正確性や効果を保証するものではありません。購入判断は自己責任でお願いいたします。</p>
        <p className="copyright">© 2026 TrueDiet Reviewer</p>
      </footer>
    </main>
  );
}
