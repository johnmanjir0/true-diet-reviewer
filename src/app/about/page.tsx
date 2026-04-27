import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Sparkles, ShieldCheck, Activity, Search } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="container">
        <div className="glass-panel" style={{ marginTop: "2rem" }}>
          <h1 className="title">当サイトについて</h1>
          <p className="subtitle">AIの力で、溢れる情報の「真実」を見抜く</p>

          <div style={{ marginTop: "3rem", color: "#334155", lineHeight: "2" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "900", marginBottom: "1.5rem", borderBottom: "2px solid #e2e8f0", paddingBottom: "0.5rem" }}>
              TrueReview AI の使命
            </h2>
            <p style={{ marginBottom: "1.5rem" }}>
              現代のインターネットには、ダイエット、美容、健康に関する膨大な情報が溢れています。
              しかし、その多くは企業による広告や、金銭的な見返りを目的に書かれた「ステマ（ステルスマーケティング）」であり、
              本当に消費者が知りたい「本音」や「リスク」が見えにくくなっています。
            </p>
            <p style={{ marginBottom: "1.5rem" }}>
              TrueReview AIは、そんな情報の霧を最先端のAI技術で晴らし、<strong>「誰にも忖度しない客観的な解析結果」</strong>を
              提供するために設立されました。
            </p>

            <h2 style={{ fontSize: "1.5rem", fontWeight: "900", marginBottom: "1.5rem", marginTop: "3rem", borderBottom: "2px solid #e2e8f0", paddingBottom: "0.5rem" }}>
              AI解析の仕組み
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
              <div>
                <h4 style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "800", marginBottom: "0.8rem" }}>
                  <Search size={20} color="var(--primary)" /> リアルタイムデータ収集
                </h4>
                <p style={{ fontSize: "0.9rem" }}>
                  商品名が入力されるたびに、WEB上の膨大なニュース、掲示板、SNS、ECサイトのレビューをAIがリアルタイムに巡回し、情報を収集します。
                </p>
              </div>
              <div>
                <h4 style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "800", marginBottom: "0.8rem" }}>
                  <ShieldCheck size={20} color="var(--primary)" /> 言語パターンによるステマ検出
                </h4>
                <p style={{ fontSize: "0.9rem" }}>
                  PR投稿特有の言い回しや、不自然に高い評価の偏りをAIが言語的に解析。ステマの可能性を独自のアルゴリズムで算出します。
                </p>
              </div>
            </div>

            <h2 style={{ fontSize: "1.5rem", fontWeight: "900", marginBottom: "1.5rem", marginTop: "3rem", borderBottom: "2px solid #e2e8f0", paddingBottom: "0.5rem" }}>
              私たちの姿勢
            </h2>
            <p>
              私たちは特定のメーカーや販売代理店と提携していません。
              AIが出した解析結果がたとえ「厳しいもの」であっても、
              それをそのままユーザーにお伝えすることが、将来的な健康被害や金銭的トラブルを防ぐ唯一の手段だと信じています。
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
