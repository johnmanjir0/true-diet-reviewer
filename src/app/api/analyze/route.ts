import { NextRequest, NextResponse } from 'next/server';
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

    // 1. Yahooウェブ検索にて口コミを収集（軽量化）
    const searchQuery = `${productName} 口コミ OR 評判 OR 効果`;
    const searchUrl = `https://search.yahoo.co.jp/search?p=${encodeURIComponent(searchQuery)}`;
    const headers = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36" };

    let searchContext = "検索結果を取得できませんでした。";
    try {
      const searchResponse = await fetch(searchUrl, { headers });
      if (searchResponse.ok) {
        const html = await searchResponse.text();
        const $ = cheerio.load(html);
        const snippets: string[] = [];
        $('.sw-CardContent').each((_, el) => {
          snippets.push($(el).text().trim());
        });
        if (snippets.length > 0) {
          searchContext = snippets.slice(0, 5).join('\n\n');
        }
      }
    } catch (e) {
      console.warn('Search failed:', e);
    }

    const prompt = `
以下のダイエット商品の情報を解析し、JSON形式で返してください。Markdown装飾は不要です。
【対象商品】
${productName}
【検索結果】
${searchContext}

【出力形式】
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

    // 安定性を極大化するため、SDKを使わず直接REST APIを叩く
    const apiKey = GEMINI_API_KEY.trim();
    // 試行するモデルのリスト
    const MODELS = [
      'gemini-1.5-flash',
      'gemini-flash-latest',
      'gemini-2.0-flash',
      'gemini-pro-latest'
    ];

    let responseData = null;
    let lastErrorDetails = "";

    for (const model of MODELS) {
      try {
        console.log(`[Analyze] Fetching from Google API using model: ${model}`);
        const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;
        
        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { response_mime_type: "application/json" }
          })
        });

        const resJson = await geminiRes.json();

        if (geminiRes.ok && resJson.candidates?.[0]?.content?.parts?.[0]?.text) {
          const text = resJson.candidates[0].content.parts[0].text;
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          responseData = JSON.parse(jsonMatch ? jsonMatch[0] : text);
          console.log(`[Analyze] Success with model: ${model}`);
          break;
        } else {
          lastErrorDetails = resJson.error?.message || JSON.stringify(resJson);
          console.warn(`[Analyze] Model ${model} failed: ${lastErrorDetails}`);
        }
      } catch (e: any) {
        lastErrorDetails = e.message;
        console.error(`[Analyze] Request to ${model} failed:`, e);
      }
    }

    if (!responseData) {
      return NextResponse.json({ 
        error: 'AI解析サービスとの通信に失敗しました。',
        details: lastErrorDetails 
      }, { status: 503 });
    }

    return NextResponse.json(responseData);

  } catch (error: any) {
    console.error('Final Analysis error:', error);
    return NextResponse.json({ error: '解析中にエラーが発生しました。', details: error.message }, { status: 500 });
  }
}
