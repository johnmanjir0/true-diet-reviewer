import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET || '';
const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || '';
const SITE_URL = 'https://true-diet-reviewer.vercel.app';

// LINE署名検証
function validateSignature(body: string, signature: string): boolean {
  if (!CHANNEL_SECRET) return true; // 未設定時はパス
  try {
    const hash = crypto
      .createHmac('SHA256', CHANNEL_SECRET.trim())
      .update(body)
      .digest('base64');
    const isValid = hash === signature;
    if (!isValid) {
      console.warn('Signature mismatch. Hash:', hash, 'Signature:', signature);
    }
    return isValid;
  } catch (e) {
    console.error('Signature validation error:', e);
    return true;
  }
}

// LINEに返信
async function replyToLine(replyToken: string, messages: any[]) {
  if (!CHANNEL_ACCESS_TOKEN) {
    console.error('LINE_CHANNEL_ACCESS_TOKEN is not set');
    return;
  }
  try {
    const res = await fetch('https://api.line.me/v2/bot/message/reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN.trim()}`,
      },
      body: JSON.stringify({ replyToken, messages }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error('LINE reply error:', res.status, JSON.stringify(errData));
    }
  } catch (e) {
    console.error('replyToLine fetch error:', e);
  }
}

// 商品のサイトリンクを生成
function buildResultMessage(productName: string): string {
  const encodedName = encodeURIComponent(productName);
  return `📊「${productName}」のAI判定を開始します！

🔗 以下のリンクをタップして結果を確認してください：
${SITE_URL}?q=${encodedName}

✅ ステマ危険度
✅ 効果の信頼性
✅ 薬機法チェック
✅ 成分の科学的根拠
✅ 定期縛りリスク

などを無料でAI解析します！

※「ヘルプ」と送ると使い方を表示します`;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-line-signature') || '';

    if (!validateSignature(rawBody, signature)) {
      console.warn('LINE signature validation failed');
      return NextResponse.json({ status: 'ok' });
    }

    const body = JSON.parse(rawBody);
    const events = body.events || [];

    if (events.length === 0) {
      return NextResponse.json({ status: 'ok' });
    }

    for (const event of events) {
      if (event.type !== 'message' || event.message?.type !== 'text') {
        if (event.replyToken) {
          await replyToLine(event.replyToken, [{
            type: 'text',
            text: '📝 調べたいダイエット商品名を送ってください！\n例：「ナイシトール」「メタバリア」',
          }]);
        }
        continue;
      }

      const userText = event.message.text.trim();

      if (userText === 'ヘルプ' || userText === 'help' || userText === '使い方') {
        await replyToLine(event.replyToken, [{
          type: 'text',
          text: `🤖 TrueDiet Reviewer Bot\n\n調べたいダイエット商品名を送るだけ！\n\n📌 例：\n・ナイシトール\n・メタバリアS\n・〇〇ダイエットサプリ\n\nAIが以下を無料判定：\n✅ ステマ危険度\n✅ 効果の信頼性\n✅ 薬機法チェック\n✅ 成分の科学的根拠\n\n🔗 サイトはこちら：\n${SITE_URL}`,
        }]);
        continue;
      }

      // URL付きの結果メッセージを即座に返信
      await replyToLine(event.replyToken, [{
        type: 'text',
        text: buildResultMessage(userText),
      }]);
    }
  } catch (err) {
    console.error('LINE webhook error:', err);
  }

  return NextResponse.json({ status: 'ok' });
}
