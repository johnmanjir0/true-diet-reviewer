import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

const categories: Record<string, { label: string; description: string; products: string[] }> = {
  "脂肪燃焼": {
    label: "🔥 脂肪燃焼・代謝アップ系",
    description: "体内の脂肪を燃焼・分解することを謳った商品カテゴリー。カルニチン・唐辛子成分（カプサイシン）・コエンザイムQ10などが主成分として多用されます。医薬品ではないため個人差が大きく、AIによる成分・口コミ検証が特に重要なカテゴリーです。",
    products: ["ナイシトールZ", "防風通聖散", "シボヘール", "内脂サポート", "ビスラットゴールド", "リポビタン スリム", "Lカルニチン サプリ", "カプサイシン サプリ"]
  },
  "糖質カット": {
    label: "🍞 糖質・脂質カット系",
    description: "食事の糖質・脂質の吸収を抑制することを謳ったサプリメント。白いんげん豆エキス・サラシア・難消化性デキストリンなどが使われます。食後血糖値の上昇を緩やかにする機能性表示食品も含まれるカテゴリーです。",
    products: ["カロリミット", "大人のカロリミット", "メタバリアEX", "賢者の食卓", "トリプルカッター", "糖質ぱっくん", "ベジバリア", "サラシア 100"]
  },
  "腸内環境": {
    label: "🌿 菌活・酵素・腸内環境系",
    description: "乳酸菌・ビフィズス菌・酵素などで腸内環境を整えることを目的としたサプリ・ドリンク。プロバイオティクスとして科学的根拠が積み重なっているカテゴリーですが、菌の株や量によって効果は大きく異なります。",
    products: ["ラクビ", "ビセラ", "コンブチャクレンズ", "ベルタ酵素", "万田酵素", "キラリ麹の炭クレンズ", "ヤクルト 1000", "ビオフェルミン"]
  },
  "置き換え": {
    label: "🥗 置き換え・プロテイン系",
    description: "1食分を置き換えることで摂取カロリーをコントロールするダイエット食品。プロテインシェイク・スムージー・置き換えダイエット食品が含まれます。栄養バランスの設計が重要で、長期使用には注意が必要です。",
    products: ["マイプロテイン", "ザバス", "優光泉", "スリモア", "ライザップ サポートプロテイン", "ベルタこうじ生酵素", "フルーツ青汁", "ファスティング ドリンク"]
  },
};

export default async function DietCategoryPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const decoded = decodeURIComponent(type);
  const cat = categories[decoded];

  if (!cat) {
    return (
      <>
        <Header />
        <main className="container">
          <div className="glass-panel" style={{ marginTop: "2rem", textAlign: "center" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: "900", marginBottom: "1rem" }}>カテゴリーが見つかりません</h1>
            <Link href="/diet" style={{ color: "var(--primary)", fontWeight: "700" }}>← ダイエット解析へ戻る</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container">
        <div className="glass-panel" style={{ marginTop: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem", justifyContent: "center" }}>
            <Zap color="#ca8a04" size={30} />
            <h1 className="title" style={{ margin: 0 }}>{cat.label}</h1>
          </div>
          <p className="subtitle" style={{ marginBottom: "2rem" }}>ダイエットカテゴリー別 商品一覧・AI解析ガイド</p>

          <div style={{ background: "rgba(14,165,233,0.06)", border: "1px solid rgba(14,165,233,0.2)", borderRadius: "16px", padding: "1.5rem", marginBottom: "2.5rem", lineHeight: "1.8", color: "#334155" }}>
            <p>{cat.description}</p>
          </div>

          <h2 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "1.2rem", color: "#0f172a" }}>
            このカテゴリーのよく調べられる商品
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.8rem", marginBottom: "3rem" }}>
            {cat.products.map(p => (
              <Link key={p} href={`/diet?q=${encodeURIComponent(p)}`} style={{ textDecoration: "none" }}>
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "1rem 1.2rem", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s" }}
                  onMouseOver={(e: any) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.background = "#f0f9ff"; }}
                  onMouseOut={(e: any) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#fff"; }}
                >
                  <span style={{ fontWeight: "700", color: "#0f172a", fontSize: "0.9rem" }}>{p}</span>
                  <ArrowRight size={16} color="var(--primary)" />
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#64748b", marginBottom: "1rem" }}>商品名を直接入力してAI解析する</p>
            <Link href="/diet" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--primary)", color: "#fff", padding: "0.8rem 2rem", borderRadius: "16px", fontWeight: "800", textDecoration: "none" }}>
              <Zap size={18} /> ダイエット解析ツールへ
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
