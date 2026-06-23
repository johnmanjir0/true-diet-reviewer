import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword') || '';

  if (!keyword) {
    return NextResponse.json({ error: 'keyword is required' }, { status: 400 });
  }

  const appId = process.env.RAKUTEN_APP_ID;
  const accessKey = process.env.RAKUTEN_ACCESS_KEY;

  if (!appId || !accessKey) {
    return NextResponse.json({ error: 'Rakuten API credentials not configured' }, { status: 500 });
  }

  // 2026年2月〜 新エンドポイント・新認証仕様
  const url = `https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20260401?applicationId=${appId}&accessKey=${accessKey}&keyword=${encodeURIComponent(keyword)}&hits=5`;

  try {
    const res = await fetch(url, {
      headers: {
        'Referer': 'https://truereview-ai.vercel.app/',
        'Origin': 'https://truereview-ai.vercel.app',
      },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch Rakuten data" }, { status: 500 });
  }
}
