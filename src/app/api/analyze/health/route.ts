import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { productName } = await req.json();

    if (!productName) {
      return NextResponse.json({ error: '商品名（または飲み合わせの組み合わせ）が入力されていません。' }, { status: 400 });
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'サーバーのGemini APIキー設定が不足しています。' }, { status: 500 });
    }

    const searchQuery = `${productName} 飲み合わせ 副作用 相互作用 リスク 評判`;
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
あなたは優秀な「薬・サプリメントの飲み合わせ＆リスク判定AI」です。
ユーザーが調べたい内容: 「${productName}」
以下のウェブ検索結果とあなたの医療・化学知識を元に、相互作用のリスク、副作用、成分の信頼性を客観的に分析し、JSON形式で返してください。

【検索結果データ】
${searchContext}

【出力ルール】
- 医療的なアドバイスではないことを前提としつつ、一般的な知見として正確なリスク情報を提示してください。
- 飲み合わせの危険がある場合は「リスクスコア」を高く設定してください。

【出力形式】
{
  "productName": "${productName}",
  "riskLevel": "安全" | "要注意" | "危険",
  "scores": {
    "stemaRisk": { "value": 0-100, "explanation": "健康商材特有の広告の煽り度やステマの可能性" },
    "effectiveness": { "value": 0-100, "explanation": "臨床データや論文に基づく成分の効果の信頼性" },
    "costPerformance": { "value": 0-100, "explanation": "医療用成分との比較等からのコスパ" },
    "healthRisk": { "value": 0-100, "explanation": "副作用の報告頻度や相互作用リスクの高さ（高いほど危険）" },
    "continuation": { "value": 0-100, "explanation": "長期連用による耐性や依存、経済的負担" }
  },
  "verdict": "飲み合わせ等のズバリ判定（30文字以内）",
  "description": "成分同士の競合や、服用時に避けるべき食べ物・習慣などの詳細解析",
  "prosSummary": ["期待される効果1", "メリット2", "3", "4", "5"],
  "consSummary": ["主な副作用の懸念1", "デメリット2", "3", "4", "5"],
  "warningPoints": ["必ず守るべき併用禁止薬や、既存疾患への影響など"],
  "subscriptionRisk": { "hasSubscription": boolean, "detail": "健康食品等の解約条件。医薬品の場合は空欄可。" },
  "yakukiho": { "hasViolation": boolean, "riskLevel": "高"| "中"| "低", "violationWords": [], "advice": "健康被害防止のための助言" },
  "ingredients": [{ "name": "注目すべき成分", "evidence": "high"|"medium"|"low", "note": "その成分が及ぼす影響の解説" }],
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
