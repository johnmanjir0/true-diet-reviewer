import { NextRequest, NextResponse } from 'next/server';

const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get('keyword');

  if (!keyword) {
    return NextResponse.json({ error: 'keyword is required' }, { status: 400 });
  }

  if (!RAKUTEN_APP_ID) {
    return NextResponse.json({ error: 'Rakuten App ID not configured' }, { status: 500 });
  }

  try {
    const url = new URL('https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706');
    url.searchParams.set('applicationId', RAKUTEN_APP_ID);
    url.searchParams.set('keyword', keyword);
    url.searchParams.set('hits', '3');
    url.searchParams.set('format', 'json');
    url.searchParams.set('sort', '-reviewCount');

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`Rakuten API error: ${res.status}`);
    }

    const data = await res.json();

    const items = (data.Items || []).map((item: any) => ({
      name: item.Item.itemName,
      price: item.Item.itemPrice,
      imageUrl: item.Item.mediumImageUrls?.[0]?.imageUrl || '',
      shopName: item.Item.shopName,
      itemUrl: item.Item.itemUrl,
      reviewAverage: item.Item.reviewAverage,
      reviewCount: item.Item.reviewCount,
    }));

    return NextResponse.json({ items });
  } catch (error: any) {
    console.error('Rakuten API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
