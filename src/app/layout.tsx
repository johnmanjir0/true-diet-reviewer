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
  title: "TrueReview AI｜ダイエット・美容・健康の総合解析ポータル",
  description: "AIがネット上の本音を可視化。ダイエットサプリ、美容コスメ、薬の飲み合わせリスクをリアルタイム解析。ステマや誇大広告に惑わされない、納得の選択をサポートする無料ツール群です。",
  keywords: ["ステマ判定", "AI解析", "ダイエット", "美容コスメ", "飲み合わせ", "口コミ本音", "サプリメント", "成分解析", "解約トラブル"],
  icons: {
    icon: "/icon.png?v=2",
  },
  openGraph: {
    title: "TrueReview AI｜ダイエット・美容・健康の総合解析ポータル",
    description: "AIがネット上の本音を可視化。ダイエットサプリ、美容コスメ、飲み合わせリスクをリアルタイム解析。",
    type: "website",
    locale: "ja_JP",
    url: "https://true-diet-reviewer.vercel.app",
    images: [{
      url: "https://true-diet-reviewer.vercel.app/ogp.png?v=2",
      width: 1200,
      height: 630,
      alt: "TrueDiet Reviewer - AIダイエット商品判定ツール",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TrueReview AI｜ダイエット・美容・健康の総合解析ポータル",
    description: "AIが口コミの本音を可視化。納得できる商品選びをサポートします（無料解析）",
    images: ["https://true-diet-reviewer.vercel.app/ogp.png?v=2"],
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
