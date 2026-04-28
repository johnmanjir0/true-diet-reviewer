import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const maxDuration = 60;

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
      console.warn('Search failed:', e);
    }

    const prompt = `あなたは薬剤師・医療専門家として、「${productName}」の飲み合わせリスクと安全性を客観的に評価してください。
${searchContext ? `\n参考情報:\n${searchContext}\n` : ''}

【重要なスコアリングルール】
- riskLevelと各スコアは必ず整合性を持たせてください
- riskLevel「危険」の場合: healthRisk は 70〜100 の範囲で設定
- riskLevel「要注意」の場合: healthRisk は 40〜69 の範囲で設定
- riskLevel「安全」の場合: healthRisk は 0〜39 の範囲で設定
- stemaRisk（誇大広告・ステマの可能性）は薬・医薬品の場合は低く、健康食品の場合は高めに設定
- effectiveness（エビデンスの強さ）は医薬品は高く、サプリや健康食品は中〜低に設定
- continuation（長期連用リスク）は依存性・耐性のある薬は高く設定

以下のJSON形式のみで回答してください（説明文・コードブロック不要）:

{
  "productName": "${productName}",
  "riskLevel": "要注意",
  "scores": {
    "stemaRisk": { "value": 15, "explanation": "医薬品は誇大広告リスクが低い" },
    "effectiveness": { "value": 85, "explanation": "臨床データに基づく効果が確立されている" },
    "costPerformance": { "value": 70, "explanation": "後発品（ジェネリック）が存在しコスパが良い" },
    "healthRisk": { "value": 60, "explanation": "特定の薬との併用で相互作用が起こる可能性がある" },
    "continuation": { "value": 45, "explanation": "長期連用で胃腸障害の懸念あり" }
  },
  "verdict": "30文字以内の総合判定文",
  "description": "飲み合わせの詳細な解説。どのような成分が競合・拮抗するか、避けるべき食品や習慣も含めた200〜300文字の説明。",
  "prosSummary": ["期待できる効果や安全に使えるケース1", "2", "3"],
  "consSummary": ["副作用や注意すべき組み合わせ1", "2", "3"],
  "warningPoints": ["具体的な警告事項1（例：〇〇との併用は禁忌）", "2"],
  "subscriptionRisk": { "hasSubscription": false, "detail": "医薬品のため定期購入リスクはなし" },
  "yakukiho": { "hasViolation": false, "riskLevel": "低", "violationWords": [], "advice": "服薬に関する注意点や医師への相談推奨" },
  "ingredients": [{ "name": "主要成分名", "evidence": "high", "note": "その成分の薬理作用と相互作用リスクの説明" }],
  "imageUrl": "",
  "adRatio": 10
}

実際の「${productName}」のリスクを正確に評価し、上記ルールに従って数値を設定してください。`;

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
              temperature: 0.2
            }
          })
        });
        const resJson = await geminiRes.json();
        if (geminiRes.ok && resJson.candidates?.[0]?.content?.parts?.[0]?.text) {
          const text = resJson.candidates[0].content.parts[0].text;
          try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            const parsed = JSON.parse(jsonMatch?.[0] || text);
            
            // スコアとriskLevelの整合性チェック・自動修正
            if (parsed.riskLevel === '危険' && parsed.scores?.healthRisk?.value < 70) {
              parsed.scores.healthRisk.value = Math.max(parsed.scores.healthRisk.value + 40, 70);
            } else if (parsed.riskLevel === '安全' && parsed.scores?.healthRisk?.value > 39) {
              parsed.scores.healthRisk.value = Math.min(parsed.scores.healthRisk.value - 20, 39);
            }
            
            responseData = parsed;
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
