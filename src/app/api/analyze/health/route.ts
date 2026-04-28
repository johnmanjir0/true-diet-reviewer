import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const maxDuration = 60; // Vercel Pro: 60秒

export async function POST(req: NextRequest) {
  try {
    const { productName } = await req.json();

    if (!productName) {
      return NextResponse.json({ error: '商品名（または飲み合わせの組み合わせ）が入力されていません。' }, { status: 400 });
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'サーバーのGemini APIキー設定が不足しています。' }, { status: 500 });
    }

    const searchQuery = `${productName} 飲み合わせ 副作用 相互作用 リスク`;
    const searchUrl = `https://search.yahoo.co.jp/search?p=${encodeURIComponent(searchQuery)}`;
    const headers = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" };

    let searchContext = "";
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const searchResponse = await fetch(searchUrl, { headers, signal: controller.signal });
      clearTimeout(timeoutId);
      if (searchResponse.ok) {
        const html = await searchResponse.text();
        const $ = cheerio.load(html);
        const snippets: string[] = [];
        $('.sw-Card').each((i, el) => {
          const title = $(el).find('h3').text() || $(el).find('.sw-Card__title').text();
          const summary = $(el).find('.sw-Card__summary').text() || $(el).find('.sw-Card__desc').text();
          if (title && summary) {
            snippets.push(`[記事${i+1}] ${title}: ${summary}`);
          }
        });
        searchContext = snippets.slice(0, 5).join('\n');
      }
    } catch (e) {
      console.warn('Search failed, proceeding with AI knowledge only:', e);
    }

    const prompt = `あなたは「薬・サプリメントの飲み合わせ＆リスク判定AI」です。
ユーザーが調べたい内容: 「${productName}」
${searchContext ? `\n参考情報:\n${searchContext}\n` : ''}
以下のJSON形式のみで回答してください。説明文や追加テキストは一切不要です。

{
  "productName": "${productName}",
  "riskLevel": "安全",
  "scores": {
    "stemaRisk": { "value": 20, "explanation": "説明文" },
    "effectiveness": { "value": 70, "explanation": "説明文" },
    "costPerformance": { "value": 60, "explanation": "説明文" },
    "healthRisk": { "value": 30, "explanation": "説明文" },
    "continuation": { "value": 50, "explanation": "説明文" }
  },
  "verdict": "30文字以内の総合判定",
  "description": "詳細な解説文（200文字程度）",
  "prosSummary": ["メリット1", "メリット2", "メリット3"],
  "consSummary": ["デメリット1", "デメリット2", "デメリット3"],
  "warningPoints": ["注意事項1", "注意事項2"],
  "subscriptionRisk": { "hasSubscription": false, "detail": "定期購入に関する情報" },
  "yakukiho": { "hasViolation": false, "riskLevel": "低", "violationWords": [], "advice": "アドバイス" },
  "ingredients": [{ "name": "成分名", "evidence": "medium", "note": "解説" }],
  "imageUrl": "",
  "adRatio": 20
}

riskLevelは「安全」「要注意」「危険」のいずれかを選んでください。
evidenceは「high」「medium」「low」のいずれかを選んでください。
${productName}の実際のリスクに基づいてvalueの数値を設定してください。`;

    const apiKey = GEMINI_API_KEY.trim();
    const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash'];
    let responseData = null;
    let lastErrorDetails = "";

    for (const model of MODELS) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { 
              responseMimeType: "application/json",
              temperature: 0.3
            }
          })
        });
        const resJson = await geminiRes.json();
        if (geminiRes.ok && resJson.candidates?.[0]?.content?.parts?.[0]?.text) {
          const text = resJson.candidates[0].content.parts[0].text;
          try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            responseData = JSON.parse(jsonMatch?.[0] || text);
            break;
          } catch (parseErr) {
            lastErrorDetails = `JSON parse error: ${parseErr}`;
          }
        } else {
          lastErrorDetails = resJson.error?.message || JSON.stringify(resJson).slice(0, 200);
        }
      } catch (e: any) {
        lastErrorDetails = e.message;
      }
    }

    if (!responseData) {
      return NextResponse.json({ error: 'AI解析に失敗しました。しばらくしてから再度お試しください。', details: lastErrorDetails }, { status: 503 });
    }
    return NextResponse.json(responseData);
  } catch (error: any) {
    return NextResponse.json({ error: 'システム内部エラー', details: error.message }, { status: 500 });
  }
}
