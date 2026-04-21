import { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約 | TrueDiet Reviewer",
};

export default function TermsPage() {
  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1rem", color: "#334155", lineHeight: "1.8" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: "0.5rem" }}>利用規約</h1>
      <p style={{ color: "#64748b", marginBottom: "2rem" }}>最終更新日：2026年4月21日</p>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", borderBottom: "2px solid #e2e8f0", paddingBottom: "0.5rem", marginBottom: "1rem" }}>1. サービスの概要</h2>
        <p>「TrueDiet Reviewer」（以下「本サービス」）は、ダイエット商品に関するWEB上の口コミ情報をAIが自動収集・分析し、ステマリスクや成分根拠などの情報を提供する無料ツールです。</p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", borderBottom: "2px solid #e2e8f0", paddingBottom: "0.5rem", marginBottom: "1rem" }}>2. 免責事項</h2>
        <ul style={{ paddingLeft: "1.5rem" }}>
          <li>本サービスの分析結果はAIによる自動生成であり、正確性・完全性を保証するものではありません。</li>
          <li>商品の購入・使用に関する最終判断はユーザー自身でお願いいたします。</li>
          <li>本サービスの利用により生じたいかなる損害についても、運営者は責任を負いません。</li>
          <li>本サービスはアマゾンアソシエイト・楽天アフィリエイトに参加しており、商品リンクから購入した場合に報酬が発生することがあります。</li>
        </ul>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", borderBottom: "2px solid #e2e8f0", paddingBottom: "0.5rem", marginBottom: "1rem" }}>3. 禁止事項</h2>
        <ul style={{ paddingLeft: "1.5rem" }}>
          <li>本サービスへの不正アクセス・過度な自動リクエスト</li>
          <li>サービスの内容を商業目的で無断転用すること</li>
          <li>法令または公序良俗に反する利用</li>
        </ul>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", borderBottom: "2px solid #e2e8f0", paddingBottom: "0.5rem", marginBottom: "1rem" }}>4. サービスの変更・終了</h2>
        <p>運営者は予告なくサービスの内容を変更・終了する場合があります。</p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", borderBottom: "2px solid #e2e8f0", paddingBottom: "0.5rem", marginBottom: "1rem" }}>5. 準拠法</h2>
        <p>本規約は日本法に基づき解釈されるものとします。</p>
      </section>
    </main>
  );
}
