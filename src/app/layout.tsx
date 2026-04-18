import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrueDiet Reviewer｜ダイエット商品のステマ・口コミをAIで判定",
  description: "ダイエットサプリや痩せる商品の口コミをAIがリアルタイム解析。ステマ危険度・効果の信頼性・コスパ・副作用リスク・定期縛りの有無を6項目で徹底判定。購入前に必ずチェック！",
  keywords: ["ダイエット", "サプリ", "口コミ", "ステマ", "判定", "AI", "副作用", "定期購入", "解約", "効果なし", "嘘"],
  openGraph: {
    title: "TrueDiet Reviewer｜ダイエット商品のステマ・口コミをAIで判定",
    description: "商品名を入力するだけでAIがリアルタイム解析。ステマ・定期縛りのリスクを購入前にチェックできる無料ツールです。",
    type: "website",
    locale: "ja_JP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1479779730258058"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
