import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";

const categories: Record<string, { label: string; description: string; products: string[] }> = {
  "スキンケア": {
    label: "✨ スキンケア・基礎化粧品",
    description: "洗顔・化粧水・乳液・美容液・クリームなどの基礎スキンケア商品。成分の浸透率・配合濃度・防腐剤の種類などがユーザーの肌に合うかどうかを左右します。ヒアルロン酸・ナイアシンアミド・レチノールなど成分を軸に比較検討するのがおすすめです。",
    products: ["SKII フェイシャルトリートメントエッセンス", "ランコム ジェニフィック", "エスティローダー アドバンス", "オルビス ユードット", "ファンケル マイルドクレンジング", "ドクターシーラボ アクアコラーゲン", "無印良品 化粧水", "ちふれ 化粧水"]
  },
  "美白": {
    label: "🌸 美白・シミ対策",
    description: "メラニン生成を抑制したり、既存のシミを薄くする効果を謳った化粧品・サプリのカテゴリー。有効成分としてはビタミンC誘導体・アルブチン・トランサミン（トラネキサム酸）などが代表的です。医薬品成分か化粧品成分かによって効果の強さが大きく異なります。",
    products: ["ハクシオン", "トランシーノ II", "シナール", "資生堂 ホワイトルーセント", "コーセー コスメデコルテ ホワイトロジスト", "ロート製薬 メラノCC", "ドモホルンリンクル", "アルブチン 美白クリーム"]
  },
  "アンチエイジング": {
    label: "⏰ アンチエイジング・エイジングケア",
    description: "肌の老化サインに働きかけるエイジングケア商品のカテゴリー。レチノール・ペプチド・EGF（上皮細胞成長因子）・コラーゲン・ビタミンA誘導体などが主力成分です。強い成分は効果が高い一方、刺激も強くなる傾向があります。",
    products: ["POLA BAクリーム", "フィルフォルテ", "ドモホルンリンクル 保護乳液", "ニールズヤード レメディーズ", "THE PUBLIC ORGANIC", "リンクルショット", "ナールスゲン配合クリーム", "エクストラバージン スクワラン"]
  },
  "ヘアケア": {
    label: "💇 ヘアケア・育毛",
    description: "シャンプー・トリートメント・育毛剤・ヘアマスクなどのヘアケア商品。育毛剤は薬機法上の医薬品・医薬部外品の区分が重要で、有効成分（ミノキシジルなど）の含有量と濃度が効果を左右します。",
    products: ["スカルプD", "リアップ X5", "フォリックス F5%", "ロゴナ シャンプー", "ケラスターゼ バンアルジャン", "ダイアン パーフェクトビューティ", "MOIST DIANE", "パンテーン ミラクルズ"]
  },
};

export default async function BeautyCategoryPage({ params }: { params: Promise<{ type: string }> }) {
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
            <Link href="/beauty" style={{ color: "#db2777", fontWeight: "700" }}>← 美容解析へ戻る</Link>
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
        <div className="glass-panel" style={{ marginTop: "2rem", borderTop: "4px solid #db2777" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem", justifyContent: "center" }}>
            <Heart color="#db2777" size={30} />
            <h1 className="title" style={{ margin: 0 }}>{cat.label}</h1>
          </div>
          <p className="subtitle" style={{ marginBottom: "2rem" }}>美容カテゴリー別 商品一覧・AI解析ガイド</p>

          <div style={{ background: "rgba(236,72,153,0.05)", border: "1px solid rgba(236,72,153,0.2)", borderRadius: "16px", padding: "1.5rem", marginBottom: "2.5rem", lineHeight: "1.8", color: "#334155" }}>
            <p>{cat.description}</p>
          </div>

          <h2 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "1.2rem", color: "#0f172a" }}>
            このカテゴリーのよく調べられる商品
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.8rem", marginBottom: "3rem" }}>
            {cat.products.map(p => (
              <Link key={p} href={`/beauty?q=${encodeURIComponent(p)}`} style={{ textDecoration: "none" }}>
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "1rem 1.2rem", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s" }}>
                  <span style={{ fontWeight: "700", color: "#0f172a", fontSize: "0.9rem" }}>{p}</span>
                  <ArrowRight size={16} color="#db2777" />
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#64748b", marginBottom: "1rem" }}>商品名を直接入力してAI解析する</p>
            <Link href="/beauty" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#db2777", color: "#fff", padding: "0.8rem 2rem", borderRadius: "16px", fontWeight: "800", textDecoration: "none" }}>
              <Heart size={18} /> 美容解析ツールへ
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
