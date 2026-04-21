import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    RAKUTEN_APP_ID: !!process.env.RAKUTEN_APP_ID,
    LINE_CHANNEL_SECRET: !!process.env.LINE_CHANNEL_SECRET,
    LINE_CHANNEL_ACCESS_TOKEN: !!process.env.LINE_CHANNEL_ACCESS_TOKEN,
    GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
    RAKUTEN_APP_ID_LENGTH: process.env.RAKUTEN_APP_ID?.length || 0,
    LINE_CHANNEL_SECRET_LENGTH: process.env.LINE_CHANNEL_SECRET?.length || 0,
  });
}
