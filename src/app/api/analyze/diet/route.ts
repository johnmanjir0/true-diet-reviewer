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

    // 1. Yahooウェブ検索にて口コミを収集（詳細化）
    const searchQuery = `${productName} 口コミ OR 評判 OR 痩せない OR ステマ OR 効果`;
    const searchUrl = `https://search.yahoo.co.jp/search?p=${encodeURIComponent(searchQuery)}`;
    const headers = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36" };

    let searchContext = "";
    try {
      const searchResponse = await fetch(searchUrl, { headers });
      if (searchResponse.ok) {
        const html = await searchResponse.text();
        const $ = cheerio.load(html);
        const snippets: string[] = [];
        $('.sw-Card').each((i, el) => {
          const title = $(el).find('h3').text() || $(el).find('.sw-Card__title').text();
          const summary = $(el).find('.sw-Card__summary').text() || $(el).find('.sw-Card__desc').text();
          if (title && summary) {
            snippets.push(`【記事${i+1}】\n${title}\n${summary}`);
          }
        });
        searchContext = snippets.slice(0, 8).join('\n\n');
      }
    } catch (e) {
      console.warn('Search failed:', e);
    }

    const prompt = `
あなたは優秀な「ダイエット商品の口コミ・ステマ判定AI」です。
ユーザーが調べたい商品名: 「${productName}」
以下のウェブ検索結果を元に、客観的かつ多角的に分析し、JSON形式で返してください。

【検索結果データ】
${searchContext}

【出力ルール】
- 必ず有効なJSONのみを返してください。
- prosSummary と consSummary は、具体的かつリアルな声を反映し、それぞれ必ず「5つ」出してください。
- 各スコアには、その点数になった理由を説明する「scoreExplanation」を付けてください。

【出力形式】
{
  "productName": "${productName}",
  "riskLevel": "安全" | "要注意" | "危険",
  "scores": {
    "stemaRisk": { "value": 0-100, "explanation": "点数の根拠" },
    "effectiveness": { "value": 0-100, "explanation": "点数の根拠" },
    "costPerformance": { "value": 0-100, "explanation": "点数の根拠" },
    "healthRisk": { "value": 0-100, "explanation": "点数の根拠" },
    "continuation": { "value": 0-100, "explanation": "点数の根拠" }
  },
  "verdict": "ズバリ判定の一言（30文字以内）",
  "description": "詳しい詳細分析とユーザーへの最終アドバイス",
  "prosSummary": ["メリット1", "メリット2", "メリット3", "メリット4", "メリット5"],
  "consSummary": ["デメリット1", "デメリット2", "デメリット3", "デメリット4", "デメリット5"],
  "warningPoints": ["具体的な解約トラブルなどの注意点1", "注意点2"],
  "subscriptionRisk": { "hasSubscription": boolean, "detail": "定期コース等の注意点" },
  "yakukiho": { "hasViolation": boolean, "riskLevel": "高"| "中"| "低", "violationWords": [], "advice": "" },
  "ingredients": [{ "name": "", "evidence": "high"|"medium"|"low", "note": "" }],
  "imageUrl": "",
  "adRatio": 0-100
}
    `;

    const apiKey = GEMINI_API_KEY.trim();
    const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash'];

    let responseData = null;
    let lastErrorDetails = "";

    for (const model of MODELS) {
      try {
        console.log(`[Analyze] Using model: ${model}`);
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        
        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        });

        const resJson = await geminiRes.json();
        if (geminiRes.ok && resJson.candidates?.[0]?.content?.parts?.[0]?.text) {
          const text = resJson.candidates[0].content.parts[0].text;
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          responseData = JSON.parse(jsonMatch ? jsonMatch[0] : text);
          break;
        } else {
          lastErrorDetails = resJson.error?.message || JSON.stringify(resJson);
        }
      } catch (e: any) {
        lastErrorDetails = e.message;
      }
    }

    if (!responseData) {
      return NextResponse.json({ error: 'AI解析に失敗しました。', details: lastErrorDetails }, { status: 503 });
    }

    return NextResponse.json(responseData);

  } catch (error: any) {
    console.error('Final Analysis error:', error);
    return NextResponse.json({ error: 'システム内部エラーが発生しました。', details: error.message }, { status: 500 });
  }
}
