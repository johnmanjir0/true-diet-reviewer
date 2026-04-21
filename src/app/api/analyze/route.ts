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
    const snippets: string[] = [];
    $('.sw-CardContent').each((_, el) => {
      snippets.push($(el).text().trim());
    });
    const searchContext = snippets.slice(0, 10).join('\n\n');

    const prompt = `
以下のダイエット商品の基本情報と検索結果の断片をもとに、客観的な判定を行ってください。
必ず有効なJSON形式で出力してください。

【対象商品】
${productName}

【検索結果のコンテキスト】
${searchContext}

【出力形式】
{
  "productName": "商品名",
  "riskLevel": "安全" | "要注意" | "危険",
  "scores": {
    "stemaRisk": 0-100,
    "effectiveness": 0-100,
    "costPerformance": 0-100,
    "continuation": 0-100,
    "healthRisk": 0-100
  },
  "verdict": "判定の結論（100文字程度）",
  "description": "総合判定の下に表示する、ユーザーが取るべき行動やアドバイス（左寄せ、150文字程度）",
  "prosSummary": ["メリット1", "メリット2"],
  "consSummary": ["デメリット1", "デメリット2"],
  "subscriptionRisk": {
    "hasSubscription": boolean,
    "detail": "定期購入に関する詳細（例：4回の回数縛りあり、初回のみ解約可など）"
  },
  "yakukiho": {
    "hasViolation": boolean,
    "riskLevel": "高" | "中" | "低",
    "violationWords": ["具体的な違反ワード1", "2"],
    "advice": "広告や口コミを見る際の注意点"
  },
  "ingredients": [
    { "name": "成分名", "evidence": "high" | "medium" | "low", "note": "その成分の効果に関する短い解説" }
  ],
  "imageUrl": "商品画像のURL（検索結果から推測されるものがあれば）"
}
    `;

    const MODELS_TO_TRY = [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-2.0-flash-exp'
    ];
    let responseText = '';
    let lastError: any = null;

    for (const modelName of MODELS_TO_TRY) {
      try {
        console.log(`Trying model: ${modelName}`);
        // v1betaでの404回避のため、安定版のv1を明示的に指定（expモデル以外）
        const apiVersion = modelName.includes('exp') ? 'v1beta' : 'v1';
        const model = genAI.getGenerativeModel({ model: modelName }, { apiVersion });
        
        const result = await model.generateContent(prompt);
        responseText = result.response.text();
        if (responseText) {
          console.log(`Success with model: ${modelName}`);
          break;
        }
      } catch (e: any) {
        lastError = e;
        console.error(`Model ${modelName} failed:`, e.status, e.message);
        // 次のモデルへ
      }
    }

    if (!responseText) {
      console.error('All models failed. Last error:', lastError?.message);
      return NextResponse.json({ 
        error: 'AIモデルが現在混み合っているか、アクセスできません。時間を置いて再度お試しください。',
        details: lastError?.message 
      }, { status: 503 });
    }

    // JSONの抽出（Markdownのデコレーションを除去）
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : responseText;
    const data = JSON.parse(jsonStr);

    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: '解析中にエラーが発生しました。', details: error.message }, { status: 500 });
  }
}
