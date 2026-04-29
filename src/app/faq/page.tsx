"use client";
import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const faqs = [
  {
    category: "🔍 ダイエット解析について",
    items: [
      {
        q: "どんな商品を解析できますか？",
        a: "日本国内で流通しているダイエットサプリ・食品・飲料など、一般的に知られている商品名であれば解析可能です。新発売直後や超マイナーな商品は、ウェブ上の口コミ情報が少ないため解析できない場合があります。"
      },
      {
        q: "「ステマ危険度」とはどういう意味ですか？",
        a: "ステルスマーケティング（ステマ）の可能性を示すスコアです。企業から報酬を受けながら一般客を装ったサクラ口コミの特徴（過度な絶賛・似通った文体・特定期間の集中投稿など）をAIが検出し、0〜100で数値化しています。"
      },
      {
        q: "解析結果は100%正確ですか？",
        a: "AIがウェブ上の公開情報を基に分析した参考情報です。必ずしも100%の精度を保証するものではありません。最終的な購入判断はご自身で行ってください。また、口コミ情報は日々更新されるため、解析のたびに結果が異なる場合があります。"
      },
      {
        q: "特定の商品でエラーが出ます。なぜですか？",
        a: "①商品名のスペルミス、②発売直後で口コミがほとんどない、③一般に流通していないマイナー商品、などの場合に解析が困難になります。正式な商品名や、別の表記でお試しください。"
      },
    ]
  },
  {
    category: "💄 美容・コスメ解析について",
    items: [
      {
        q: "スキンケア以外のコスメも解析できますか？",
        a: "はい、ファンデーション・リップ・アイシャドウなどのメイクアップ商品も解析対象です。ただし、解析精度は口コミの多さに依存するため、人気ブランドの方が精度が高い傾向があります。"
      },
      {
        q: "成分の安全性はどう評価していますか？",
        a: "一般的な化粧品成分の研究データ・アレルギー報告・規制情報をもとに、AIが安全性を評価します。ただし個人差があるため、肌が敏感な方は皮膚科医への相談も併用することをおすすめします。"
      },
      {
        q: "「SNSで過剰評価」とはどういう意味ですか？",
        a: "InstagramやTikTokなどのSNSで話題になっているが、実際の効果に関する科学的根拠や一般ユーザーのリアルな評価と大きく乖離がある状態を指します。インフルエンサーによるステマ投稿が多い場合にスコアが上昇します。"
      },
    ]
  },
  {
    category: "🏥 健康・飲み合わせ判定について",
    items: [
      {
        q: "医師の代わりになりますか？",
        a: "なりません。本ツールはあくまで参考情報の提供が目的です。実際の服薬管理は、必ず医師または薬剤師にご相談ください。特に持病がある方、複数の処方薬を服用中の方は、必ず専門家への確認が必要です。"
      },
      {
        q: "市販薬と処方薬の組み合わせも調べられますか？",
        a: "はい、市販薬・処方薬・サプリメントの3種類の組み合わせに対応しています。入力欄①に薬A、入力欄②に薬Bを入力してください。「ロキソニン と ワーファリン」のように入力するとより精度が上がります。"
      },
      {
        q: "「危険」と表示されました。すぐに服薬をやめるべきですか？",
        a: "「危険」の判定はリスクの可能性を示すものであり、必ずしも即座に服薬を中断すべきという意味ではありません。判定結果を参考に、かかりつけ医や薬剤師に「この組み合わせは大丈夫か」と相談することをおすすめします。"
      },
    ]
  },
  {
    category: "ℹ️ サイトについて",
    items: [
      {
        q: "このサービスは無料で使えますか？",
        a: "はい、現在は全ての機能を無料でご利用いただけます。AI解析の回数制限もありません。"
      },
      {
        q: "広告はどのような基準で表示されますか？",
        a: "当サイトはGoogle AdSenseを利用しており、Googleのアルゴリズムによってユーザーの興味に合わせた広告が自動表示されます。特定の商品・企業から広告出稿料を受け取って解析結果を操作することは一切ありません。"
      },
      {
        q: "解析した商品の情報は保存・公開されますか？",
        a: "解析履歴はお使いのブラウザ（localStorage）にのみ保存され、サーバーには送信・保存されません。個人情報の収集は一切行っておりません。"
      },
      {
        q: "間違った解析結果を修正してもらえますか？",
        a: "お問い合わせページよりご連絡ください。ご指摘の内容を確認の上、プロンプトやデータの改善を検討いたします。ただし、AIの特性上、個別商品の解析結果を手動修正することは難しい場合があります。"
      },
    ]
  },
];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<string | null>(null);

  const toggle = (key: string) => setOpenIdx(openIdx === key ? null : key);

  return (
    <>
      <Header />
      <main className="container">
        <div className="glass-panel" style={{ marginTop: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
            <HelpCircle size={36} color="var(--primary)" />
            <h1 className="title" style={{ margin: 0 }}>よくある質問</h1>
          </div>
          <p className="subtitle" style={{ marginBottom: "3rem" }}>TrueReview AIに関するよくある疑問をまとめました</p>

          {faqs.map((section, si) => (
            <div key={si} style={{ marginBottom: "2.5rem" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#0f172a", marginBottom: "1rem", paddingLeft: "0.8rem", borderLeft: "4px solid var(--primary)" }}>
                {section.category}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {section.items.map((item, qi) => {
                  const key = `${si}-${qi}`;
                  const isOpen = openIdx === key;
                  return (
                    <div key={qi} style={{ border: "1px solid #e2e8f0", borderRadius: "16px", overflow: "hidden", background: isOpen ? "#f0f9ff" : "#fff" }}>
                      <button
                        onClick={() => toggle(key)}
                        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.1rem 1.5rem", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: "1rem" }}
                      >
                        <span style={{ fontSize: "0.95rem", fontWeight: "700", color: "#0f172a" }}>Q. {item.q}</span>
                        {isOpen ? <ChevronUp size={18} color="#64748b" style={{ flexShrink: 0 }} /> : <ChevronDown size={18} color="#64748b" style={{ flexShrink: 0 }} />}
                      </button>
                      {isOpen && (
                        <div style={{ padding: "0 1.5rem 1.2rem", fontSize: "0.9rem", color: "#475569", lineHeight: "1.8", borderTop: "1px solid #e2e8f0" }}>
                          <p style={{ marginTop: "1rem" }}>A. {item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div style={{ background: "linear-gradient(135deg, var(--primary) 0%, #3b82f6 100%)", borderRadius: "20px", padding: "2rem", color: "white", marginTop: "2rem" }}>
            <p style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "1rem" }}>解決しない場合はお気軽にお問い合わせください</p>
            <a href="/contact" style={{ display: "inline-block", background: "white", color: "var(--primary)", padding: "0.7rem 2rem", borderRadius: "12px", fontWeight: "800", textDecoration: "none", fontSize: "0.9rem" }}>
              お問い合わせフォームへ
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
