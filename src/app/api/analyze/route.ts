import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as cheerio from 'cheerio';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { productName } = await req.json();

    if (!productName) {
      return NextResponse.json({ error: '商品名が入力されていません。' }, { status: 400 });
    }

    if (!GEMINI_API_KEY) {
      console.error('Missing Gemini API Key');
      return NextResponse.json({ error: 'サーバーのGemini APIキー設定が不足しています。' }, { status: 500 });
    }

    // 1. Yahooウェブ検索にて口コミを収集
    const searchQuery = `${productName} 口コミ OR 嘘 OR 痩せない OR ステマ OR 解約`;
    const searchUrl = `https://search.yahoo.co.jp/search?p=${encodeURIComponent(searchQuery)}`;
    const headers = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36" };

    const searchResponse = await fetch(searchUrl, { headers });
    if (!searchResponse.ok) {
       return NextResponse.json({ error: '検索エンジンへのアクセスに失敗しました。時間をおいて再試行してください。' }, { status: 500 });
    }

    const html = await searchResponse.text();
    const $ = cheerio.load(html);
    const searchSnippetsList: string[] = [];

    $('.sw-Card').each((i, el) => {
      const title = $(el).find('h3').text() || $(el).find('.sw-Card__title').text();
      const snippet = $(el).find('.sw-Card__summary').text() || $(el).find('.sw-Card__desc').text();
      if (title && snippet) {
        searchSnippetsList.push(`【記事${i + 1}】\nタイトル: ${title}\n要約: ${snippet}`);
      }
    });

    if (searchSnippetsList.length === 0) {
      return NextResponse.json({ error: '口コミ情報が見つかりませんでした。対象商品のリアルな情報がネット上に存在しない可能性があります。' }, { status: 404 });
    }
    const searchSnippets = searchSnippetsList.join('\n\n');

    // 2. Yahoo画像検索にて商品サムネイルを収集
    const imageUrlSearchUrl = `https://search.yahoo.co.jp/image/search?p=${encodeURIComponent(productName + ' 商品 パッケージ')}`;
    let productImageUrl = "";
    try {
      const imgRes = await fetch(imageUrlSearchUrl, { headers });
      const imgHtml = await imgRes.text();
      const $img = cheerio.load(imgHtml);
      $img('img').each((i, el) => {
        const src = $img(el).attr('src');
        if (src && (src.startsWith('https://') || src.startsWith('http://')) && !productImageUrl) {
          productImageUrl = src;
        }
      });
    } catch (e) {
      console.error("Image scrape error:", e);
    }

    // 3. Gemini API を使用したテキスト解析と判定
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const prompt = `
あなたは優秀な「ダイエット商品の口コミ・ステマ判定AI」です。
ユーザーが調べたい商品名: 「${productName}」
以下の検索エンジンの抽出結果（リアルな口コミサイトや掲示板が中心）を分析し、ステマ（宣伝）の可能性、消費者の本音、そして定期購入のリスクを客観的に判定してください。

【検索結果データ】
---
${searchSnippets}
---

上記データを元に、以下のJSONフォーマットで**必ず正しいJSON文字列のみ**を出力してください。追加のマークダウンや文章は一切不要です。

{
  "productName": "${productName}",
  "scores": {
    "stemaRisk": 0から100の整数 (100が最もステマの可能性が高く危険),
    "effectiveness": 0から100の整数 (実際のダイエット効果・変化の信頼性。100が最も信頼できる),
    "costPerformance": 0から100の整数 (価格設定へのユーザーの納得感、解約のしやすさなど。100が最もコスパ良し),
    "healthRisk": 0から100の整数 (下痢や体調不良への懸念スコア。100が最も健康被害リスクが高い),
    "continuation": 0から100の整数 (味、飲む量などの継続しやすさ。100が最も続けやすい)
  },
  "riskLevel": "安全" | "注意" | "危険" のいずれか (stemaRiskやhealthRiskを総合して判定),
  "prosSummary": ["メリット1", "メリット2", "メリット3", "メリット4", "メリット5"] (必ず5つ出してください),
  "consSummary": ["デメリット1", "デメリット2", "デメリット3", "デメリット4", "デメリット5"] (必ず5つ出してください),
  "warningPoints": ["具体的な解約トラブルや強い副作用の報告があれば記載1", "気をつけるべき点2"] (なければ空配列),
  "adRatio": 0から100の整数 (検索結果における広告・アフィリエイト割合),
  "subscriptionRisk": {
    "hasSubscription": true または false (定期縛りや定期購入の記述があればtrue、一切見当たらなければfalse。買い切りならfalse),
    "notes": "定期購入に関するユーザーの声や注意点（例：定期縛りあり、初回のみ安いが解約が電話のみ、など。情報がない場合は「定期購入の制限に関する目立った情報はありません」）"
  }
}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // JSONのパース
    const jsonStr = responseText.replace(/```json\n?|\n?```/g, '').trim();
    const analysisResult = JSON.parse(jsonStr);

    // 画像URLをレスポンスに付与
    analysisResult.imageUrl = productImageUrl;

    return NextResponse.json(analysisResult);

  } catch (error: any) {
    console.error('Analytics API Error:', error);
    return NextResponse.json({ error: `解析中にエラーが発生しました: ${error.message}` }, { status: 500 });
  }
}
