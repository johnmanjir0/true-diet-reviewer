import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword') || '';

  // デバッグ用: 環境変数の設定状況を確認
  if (keyword === 'debug-env') {
    return NextResponse.json({
      secretSet: !!process.env.LINE_CHANNEL_SECRET,
      tokenSet: !!process.env.LINE_CHANNEL_ACCESS_TOKEN,
      secretLength: process.env.LINE_CHANNEL_SECRET?.length || 0,
      tokenLength: process.env.LINE_CHANNEL_ACCESS_TOKEN?.length || 0,
    });
  }

  const appId = process.env.RAKUTEN_APP_ID;
  const url = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601?applicationId=${appId}&keyword=${encodeURIComponent(keyword)}&hits=5`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch Rakuten data" }, { status: 500 });
  }
}
