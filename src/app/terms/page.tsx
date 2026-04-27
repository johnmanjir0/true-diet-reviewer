import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="container">
        <div className="glass-panel" style={{ marginTop: "2rem" }}>
          <h1 className="title" style={{ fontSize: "2rem" }}>利用規約</h1>
          
          <div style={{ marginTop: "2rem", color: "#334155", lineHeight: "1.8", fontSize: "0.95rem" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: "800", margin: "1.5rem 0 1rem" }}>1. サービスの利用</h2>
            <p>
              本サービスは、AIを用いてサプリメントやコスメ等の商品に関する情報の解析結果を提示するものです。
              ユーザーは、本規約に同意の上、自己の責任において本サービスを利用するものとします。
            </p>

            <h2 style={{ fontSize: "1.2rem", fontWeight: "800", margin: "1.5rem 0 1rem" }}>2. 禁止事項</h2>
            <p>
              ・当サイトの情報を不正に取得、改ざん、または再配布する行為。<br />
              ・サーバーに過度な負荷をかける自動スクリプトの実行。<br />
              ・他者の知的財産権を侵害する行為。
            </p>

            <h2 style={{ fontSize: "1.2rem", fontWeight: "800", margin: "1.5rem 0 1rem" }}>3. 解析結果について</h2>
            <p>
              本サービスが提供する解析結果は、AIアルゴリズムによる推測を含むものであり、医学的・法的な証拠として使用することはできません。
              また、解析結果は検索時点のデータに基づいているため、最新の情報とは異なる場合があります。
            </p>

            <h2 style={{ fontSize: "1.2rem", fontWeight: "800", margin: "1.5rem 0 1rem" }}>4. 規約の変更</h2>
            <p>
              当サイトは、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
