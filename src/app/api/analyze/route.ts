import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as cheerio from 'cheerio';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

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

    // APIキーをトリム（余計な空白を除去）
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY.trim());

    // 1. Yahooウェブ検索にて口コミを収集（軽量化）
    const searchQuery = `${productName} 口コミ OR ステマ OR 効果`;
    const searchUrl = `https://search.yahoo.co.jp/search?p=${encodeURIComponent(searchQuery)}`;
    const headers = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36" };

    const searchResponse = await fetch(searchUrl, { headers });
    let searchContext = "";
    if (searchResponse.ok) {
       const html = await searchResponse.text();
       const $ = cheerio.load(html);
       const snippets: string[] = [];
       $('.sw-CardContent').each((_, el) => {
         snippets.push($(el).text().trim());
       });
       searchContext = snippets.slice(0, 5).join('\n\n'); // コンテキストを半分に削減
    }

    const prompt = `
以下のダイエット商品の情報を解析し、JSON形式で返してください。
【対象商品】
${productName}
【検索結果】
${searchContext}

【出力形式】
JSONのみを出力してください（Markdown装飾なし）。
{
  "productName": "${productName}",
  "riskLevel": "安全" | "要注意" | "危険",
  "scores": { "stemaRisk": 0-100, "effectiveness": 0-100, "costPerformance": 0-100, "continuation": 0-100, "healthRisk": 0-100 },
  "verdict": "判定の結論",
  "description": "ユーザーへのアドバイス",
  "prosSummary": [],
  "consSummary": [],
  "subscriptionRisk": { "hasSubscription": boolean, "detail": "" },
  "yakukiho": { "hasViolation": boolean, "riskLevel": "高"| "中"| "低", "violationWords": [], "advice": "" },
  "ingredients": [{ "name": "", "evidence": "high"|"medium"|"low", "note": "" }],
  "imageUrl": ""
}
    `;

    // 404エラー対策：利用可能なモデルを順番に試す
    const MODELS_TO_TRY = [
      { name: 'gemini-1.5-flash-latest', version: 'v1' },
      { name: 'gemini-1.5-flash', version: 'v1' },
      { name: 'gemini-1.5-pro-latest', version: 'v1' },
      { name: 'gemini-1.5-pro', version: 'v1' }
    ];

    let responseText = '';
    let lastErrorMsg = '';

    for (const modelInfo of MODELS_TO_TRY) {
      try {
        console.log(`[Analyze] Trying ${modelInfo.name} (${modelInfo.version})...`);
        const model = genAI.getGenerativeModel(
          { model: modelInfo.name },
          { apiVersion: modelInfo.version as any }
        );
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        responseText = response.text();
        
        if (responseText) {
          console.log(`[Analyze] Success with ${modelInfo.name}`);
          break;
        }
      } catch (e: any) {
        lastErrorMsg = e.message;
        console.warn(`[Analyze] ${modelInfo.name} failed: ${e.message}`);
        // 429 (Rate Limit) なら少し待つ
        if (e.message?.includes('429')) {
             await new Promise(resolve => setTimeout(resolve, 1000));
        }
        continue;
      }
    }

    if (!responseText) {
      console.error('[Analyze] All models failed. Last error:', lastErrorMsg);
      return NextResponse.json({ 
        error: 'AI解析サービスへ接続できませんでした。',
        details: lastErrorMsg
      }, { status: 503 });
    }

    // JSONの抽出
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : responseText;
    const data = JSON.parse(jsonStr);

    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Final Analysis error:', error);
    return NextResponse.json({ error: 'システム内部エラーが発生しました。', details: error.message }, { status: 500 });
  }
}
