import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET!;
const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN!;
const SITE_URL = 'https://true-diet-reviewer.vercel.app';

// LINE署名検証
function validateSignature(body: string, signature: string): boolean {
  const hash = crypto
    .createHmac('SHA256', CHANNEL_SECRET)
    .update(body)
    .digest('base64');
  return hash === signature;
}

// LINEに返信
async function replyToLine(replyToken: string, messages: any[]) {
  await fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ replyToken, messages }),
  });
}

// 商品を解析してLINE用テキストを生成
async function analyzeProduct(productName: string): Promise<string> {
  try {
    const res = await fetch(`${SITE_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productName }),
    });
    if (!res.ok) throw new Error('解析失敗');
    const data = await res.json();

    const riskEmoji = data.riskLevel === '安全' ? '✅' : data.riskLevel === '危険' ? '🔴' : '⚠️';
    const subRisk = data.subscriptionRisk?.hasSubscription ? '⚠️ 定期購入あり（注意）' : '✅ 定期縛りの情報なし';
    const yakukiho = data.yakukiho?.hasViolation ? `🚨 薬機法違反の疑いあり（リスク: ${data.yakukiho.riskLevel}）` : '✅ 薬機法上の問題表現なし';

    const pros = data.prosSummary?.slice(0, 2).map((p: string) => `・${p}`).join('\n') || '';
    const cons = data.consSummary?.slice(0, 2).map((c: string) => `・${c}`).join('\n') || '';

    return `📊「${data.productName}」のAI判定結果

${riskEmoji} 総合判定: ${data.riskLevel}

━━━ スコア ━━━
🎯 効果の信頼性: ${data.scores.effectiveness}/100
💰 コスパ満足度: ${data.scores.costPerformance}/100
😊 継続しやすさ: ${data.scores.continuation}/100
🕵️ ステマ危険度: ${data.scores.stemaRisk}/100
⚕️ 健康リスク: ${data.scores.healthRisk}/100

━━━ チェック ━━━
${subRisk}
${yakukiho}

━━━ 良い点 ━━━
${pros}

━━━ 注意点 ━━━
${cons}

🔗 詳細はこちら
${SITE_URL}

※AIによる自動解析です。購入の最終判断はご自身でお願いします。`;
  } catch {
    return '解析中にエラーが発生しました。しばらく待ってから再度お試しください。';
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-line-signature') || '';

  // 署名検証
  if (!validateSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const body = JSON.parse(rawBody);
  const events = body.events || [];

  for (const event of events) {
    // テキストメッセージのみ対応
    if (event.type !== 'message' || event.message.type !== 'text') {
      // 使い方を返信
      await replyToLine(event.replyToken, [{
        type: 'text',
        text: '📝 ダイエット商品名を送ってください！\n例：「ナイシトール」「メタバリア」\n\nAIがステマ度・効果・成分・薬機法をリアルタイム解析します🔍',
      }]);
      continue;
    }

    const userText = event.message.text.trim();

    // 使い方コマンド
    if (userText === 'ヘルプ' || userText === 'help' || userText === '使い方') {
      await replyToLine(event.replyToken, [{
        type: 'text',
        text: `🤖 TrueDiet Reviewer Bot の使い方

調べたいダイエット商品名を送るだけ！

📌 例：
・ナイシトール
・メタバリアS
・〇〇ダイエットサプリ

AIが以下を自動判定します：
✅ 効果の信頼性
🕵️ ステマ危険度
💰 コスパ
⚕️ 健康リスク
🚨 薬機法チェック

詳細はこちら：
${SITE_URL}`,
      }]);
      continue;
    }

    // 解析中メッセージをすぐ返す（LINEは5秒以内に応答が必要）
    // 解析を実行
    await replyToLine(event.replyToken, [{
      type: 'text',
      text: `🔍「${userText}」を解析中...\n少々お待ちください（10〜20秒）`,
    }]);

    // バックグラウンドで解析（Push APIで送信）
    const resultText = await analyzeProduct(userText);
    await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        to: event.source.userId,
        messages: [{ type: 'text', text: resultText }],
      }),
    });
  }

  return NextResponse.json({ status: 'ok' });
}
