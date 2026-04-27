import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="container">
        <div className="glass-panel" style={{ marginTop: "2rem" }}>
          <h1 className="title" style={{ fontSize: "2rem" }}>プライバシーポリシー</h1>
          
          <div style={{ marginTop: "2rem", color: "#334155", lineHeight: "1.8", fontSize: "0.95rem" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: "800", margin: "1.5rem 0 1rem" }}>1. 広告の配信について</h2>
            <p>
              当サイトでは、第三者配信の広告サービス「Google AdSense（グーグルアドセンス）」を利用しています。
              広告配信事業者は、ユーザーの興味に応じた広告を表示するためにCookie（クッキー）を使用することがあります。
            </p>

            <h2 style={{ fontSize: "1.2rem", fontWeight: "800", margin: "1.5rem 0 1rem" }}>2. アクセス解析ツールについて</h2>
            <p>
              当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。
              このGoogleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。
              トラフィックデータは匿名で収集されており、個人を特定するものではありません。
            </p>

            <h2 style={{ fontSize: "1.2rem", fontWeight: "800", margin: "1.5rem 0 1rem" }}>3. 個人情報の利用目的</h2>
            <p>
              当サイトでは、メールでのお問い合わせの際に、氏名（ハンドルネーム）、メールアドレス等の個人情報をご登録いただく場合がございます。
              これらの個人情報は質問に対する回答や必要な情報を電子メールなどをでご連絡する場合に利用させていただくものであり、それ以外の目的では利用いたしません。
            </p>

            <h2 style={{ fontSize: "1.2rem", fontWeight: "800", margin: "1.5rem 0 1rem" }}>4. 免責事項</h2>
            <p>
              当サイトのAIによる解析結果は、インターネット上の情報をAIが独自に収集・分析したものであり、その正確性、効果、安全性を保証するものではありません。
              当サイトから提供する情報に基づいて行われた、あらゆる行為および損害について、当サイトは一切の責任を負いません。
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
