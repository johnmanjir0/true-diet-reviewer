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
      return NextResponse.json({ error: 'サーバーのGemini APIキー設定が不足しています。' }, { status: 500 });
    }

    const searchQuery = `${productName} 美容 口コミ OR 評判 OR 効果なし OR ステマ OR 成分`;
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
あなたは優秀な「美容・コスメ商品の口コミ・ステマ判定AI」です。
ユーザーが調べたい商品名: 「${productName}」
以下のウェブ検索結果を元に、成分の信頼性、肌質への適合性、SNSでの過大な宣伝（ステマ）を客観的に分析し、JSON形式で返してください。

【検索結果データ】
${searchContext}

【出力形式】
{
  "productName": "${productName}",
  "riskLevel": "安全" | "要注意" | "危険",
  "scores": {
    "stemaRisk": { "value": 0-100, "explanation": "SNSでの不自然な絶賛やPR投稿の多さを考慮したステマの可能性" },
    "effectiveness": { "value": 0-100, "explanation": "成分の有効性と、実際の利用者の肌質改善の実感度" },
    "costPerformance": { "value": 0-100, "explanation": "成分量に対する価格の妥当性" },
    "healthRisk": { "value": 0-100, "explanation": "肌荒れリスクや添加物の多さ" },
    "continuation": { "value": 0-100, "explanation": "使い心地や香りの評判" }
  },
  "verdict": "ズバリ判定の一言（30文字以内）",
  "description": "美容面から見た詳細分析とアドバイス。特に肌質（乾燥・脂性等）への適合点",
  "prosSummary": ["メリット1", "メリット2", "メリット3", "メリット4", "メリット5"],
  "consSummary": ["デメリット1", "デメリット2", "デメリット3", "デメリット4", "デメリット5"],
  "warningPoints": ["肌荒れの予兆や、特定の成分への注意点など"],
  "subscriptionRisk": { "hasSubscription": boolean, "detail": "初回限定価格や解約条件の不透明さ" },
  "yakukiho": { "hasViolation": boolean, "riskLevel": "高"| "中"| "低", "violationWords": [], "advice": "美容における誇大広告への助言" },
  "ingredients": [{ "name": "主要成分名", "evidence": "high"|"medium"|"low", "note": "成分の役割と科学的知見" }],
  "imageUrl": "",
  "adRatio": 0-100
}
    `;

    const apiKey = GEMINI_API_KEY.trim();
    const MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash'];
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
            generationConfig: { responseMimeType: "application/json" }
          })
        });
        const resJson = await geminiRes.json();
        if (geminiRes.ok && resJson.candidates?.[0]?.content?.parts?.[0]?.text) {
          const text = resJson.candidates[0].content.parts[0].text;
          responseData = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] || text);
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
    return NextResponse.json({ error: 'システム内部エラー', details: error.message }, { status: 500 });
  }
}
