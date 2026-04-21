import { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー | TrueDiet Reviewer",
};

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1rem", color: "#334155", lineHeight: "1.8" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: "0.5rem" }}>プライバシーポリシー</h1>
      <p style={{ color: "#64748b", marginBottom: "2rem" }}>最終更新日：2026年4月21日</p>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", borderBottom: "2px solid #e2e8f0", paddingBottom: "0.5rem", marginBottom: "1rem" }}>1. 収集する情報</h2>
        <p>当サービス「TrueDiet Reviewer」（以下「本サービス」）は、以下の情報を収集することがあります。</p>
        <ul style={{ paddingLeft: "1.5rem", marginTop: "0.5rem" }}>
          <li>ユーザーが入力した商品名（解析目的のみに使用）</li>
          <li>Google Analytics・Google AdSenseによるアクセスログ（IPアドレス、ブラウザ情報等）</li>
          <li>LINE Botをご利用の場合：LINEのユーザーIDおよびメッセージ内容（返信目的のみ）</li>
        </ul>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", borderBottom: "2px solid #e2e8f0", paddingBottom: "0.5rem", marginBottom: "1rem" }}>2. 情報の利用目的</h2>
        <ul style={{ paddingLeft: "1.5rem" }}>
          <li>ダイエット商品の口コミ解析結果の提供</li>
          <li>サービスの改善・統計分析</li>
          <li>Google AdSenseによる広告配信</li>
        </ul>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", borderBottom: "2px solid #e2e8f0", paddingBottom: "0.5rem", marginBottom: "1rem" }}>3. 第三者への提供</h2>
        <p>収集した個人情報は、法令に基づく場合を除き、ユーザーの同意なく第三者に提供することはありません。</p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", borderBottom: "2px solid #e2e8f0", paddingBottom: "0.5rem", marginBottom: "1rem" }}>4. Cookieの使用</h2>
        <p>本サービスはGoogle AdSense・Google Analyticsを利用しており、これらがCookieを使用する場合があります。ブラウザの設定によりCookieを無効にすることが可能です。</p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", borderBottom: "2px solid #e2e8f0", paddingBottom: "0.5rem", marginBottom: "1rem" }}>5. お問い合わせ</h2>
        <p>プライバシーポリシーに関するお問い合わせは、LINE Bot経由またはSNSにてご連絡ください。</p>
      </section>
    </main>
  );
}
